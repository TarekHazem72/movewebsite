import { Router } from "express";
import { db, usersTable, articlesTable, commentsTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";
import { CreateArticleBody, GetArticleParams, DeleteArticleParams, ListArticlesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/articles", async (req, res) => {
  const parsed = ListArticlesQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;
  const offset = parsed.success ? (parsed.data.offset ?? 0) : 0;

  const articlesWithAuthors = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      content: articlesTable.content,
      movieTitle: articlesTable.movieTitle,
      rating: articlesTable.rating,
      authorId: articlesTable.authorId,
      authorUsername: usersTable.username,
      createdAt: articlesTable.createdAt,
      commentCount: sql<number>`cast(count(${commentsTable.id}) as int)`,
    })
    .from(articlesTable)
    .innerJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
    .leftJoin(commentsTable, eq(commentsTable.articleId, articlesTable.id))
    .groupBy(articlesTable.id, usersTable.username)
    .orderBy(desc(articlesTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db.select({ total: count() }).from(articlesTable);

  res.json({ articles: articlesWithAuthors, total: Number(total) });
});

router.post("/articles", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user || user.role !== "poster") {
    res.status(403).json({ error: "Only posters can create articles" });
    return;
  }

  const parsed = CreateArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { title, content, movieTitle, rating } = parsed.data;
  const [article] = await db
    .insert(articlesTable)
    .values({ title, content, movieTitle, rating, authorId: user.id })
    .returning();

  res.status(201).json({
    id: article.id,
    title: article.title,
    content: article.content,
    movieTitle: article.movieTitle,
    rating: article.rating,
    authorId: article.authorId,
    authorUsername: user.username,
    commentCount: 0,
    createdAt: article.createdAt,
  });
});

router.get("/articles/:id", async (req, res) => {
  const parsed = GetArticleParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parsed.data;

  const [row] = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      content: articlesTable.content,
      movieTitle: articlesTable.movieTitle,
      rating: articlesTable.rating,
      authorId: articlesTable.authorId,
      authorUsername: usersTable.username,
      createdAt: articlesTable.createdAt,
      commentCount: sql<number>`cast(count(${commentsTable.id}) as int)`,
    })
    .from(articlesTable)
    .innerJoin(usersTable, eq(articlesTable.authorId, usersTable.id))
    .leftJoin(commentsTable, eq(commentsTable.articleId, articlesTable.id))
    .where(eq(articlesTable.id, id))
    .groupBy(articlesTable.id, usersTable.username)
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(row);
});

router.delete("/articles/:id", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = DeleteArticleParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parsed.data;

  const [article] = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  if (article.authorId !== req.session.userId) {
    res.status(403).json({ error: "You can only delete your own articles" });
    return;
  }

  await db.delete(articlesTable).where(eq(articlesTable.id, id));
  res.json({ message: "Article deleted" });
});

export default router;
