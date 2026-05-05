import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import articlesRouter from "./articles";
import commentsRouter from "./comments";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(articlesRouter);
router.use(commentsRouter);
router.use(usersRouter);

export default router;
