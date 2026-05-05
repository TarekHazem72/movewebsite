import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/users", async (req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(asc(usersTable.createdAt));

  res.json({ users });
});

export default router;
