import { Router, type IRouter } from "express";
import healthRouter from "./health";
import artistsRouter from "./artists";
import adminRouter from "./admin";
import storageRouter from "./storage";
import authRouter from "./auth";
import projectsRouter from "./projects";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(dashboardRouter);
router.use(artistsRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
