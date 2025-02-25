import { Router } from "express";
import userRouter from "./userRouter.js";
import classRouter from "./classRouter.js";
import sessionRouter from "./sessionRouter.js";
import pointRouter from "./pointRouter.js";

const router = Router();

//use routes for user, class, session, point with before path /users
router.use("/users", userRouter);
router.use("/classes", classRouter);
router.use("/sessions", sessionRouter);
router.use("/points", pointRouter);

export default router;
