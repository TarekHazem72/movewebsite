import { Router } from "express";
import { db, usersTable, articlesTable, commentsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { ListCommentsParams, CreateCommentParams, CreateCommentBody, DeleteCommentParams } from "@workspace/api-zod";

const router = Router();

router.get("/articles/:id/comments", async (req, res) => {
  const parsed = ListCommentsParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parsed.data;

  const comments = await db
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      articleId: commentsTable.articleId,
      authorId: commentsTable.authorId,
      authorUsername: usersTable.username,
      createdAt: commentsTable.createdAt,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(eq(commentsTable.articleId, id))
    .orderBy(asc(commentsTable.createdAt));

  res.json({ comments });
});

router.post("/articles/:id/comments", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = CreateCommentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid article id" });
    return;
  }
  const { id } = parsed.data;

  const bodyParsed = CreateCommentBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const [article] = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [comment] = await db
    .insert(commentsTable)
    .values({ content: bodyParsed.data.content, articleId: id, authorId: user.id })
    .returning();

  res.status(201).json({
    id: comment.id,
    content: comment.content,
    articleId: comment.articleId,
    authorId: comment.authorId,
    authorUsername: user.username,
    createdAt: comment.createdAt,
  });
});

router.delete("/comments/:id", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const parsed = DeleteCommentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { id } = parsed.data;

  const [comment] = await db.select().from(commentsTable).where(eq(commentsTable.id, id)).limit(1);
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  if (comment.authorId !== req.session.userId) {
    res.status(403).json({ error: "You can only delete your own comments" });
    return;
  }

  await db.delete(commentsTable).where(eq(commentsTable.id, id));
  res.json({ message: "Comment deleted" });
});

export default router;
