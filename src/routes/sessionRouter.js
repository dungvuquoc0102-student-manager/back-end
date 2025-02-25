import { Router } from "express";
import sessionController from "../controllers/sessionController.js";

const sessionRouter = Router();

//routes for CRUD session with before path /sessions
sessionRouter.post("/:classId", sessionController.createSession);
sessionRouter.get("/", sessionController.getAllSessions);
sessionRouter.patch("/:sessionId", sessionController.updateSession);
sessionRouter.delete("/:sessionId", sessionController.deleteSession);

//route for Get one
sessionRouter.get("/:sessionId", sessionController.getSessionById);

//route for Get all sessions of a class by class id
sessionRouter.get("/class/:classId", sessionController.getAllSessionsByClassId);

export default sessionRouter;
