import { Router } from "express";
import classController from "../controllers/classController.js";

const classRouter = Router();

//routes for CRUD class with before path /classes
classRouter.post("/", classController.createClass);
classRouter.get("/", classController.getAllClasses);
classRouter.patch("/:classId", classController.updateClass);
classRouter.delete("/:classId", classController.deleteClass);

//route for Get one
classRouter.get("/:classId", classController.getClassById);

//route for Add, Remove user to class
classRouter.post("/:classId/user/:userId", classController.addUserToClass);
classRouter.delete(
  "/:classId/user/:userId",
  classController.removeUserFromClass
);

export default classRouter;
