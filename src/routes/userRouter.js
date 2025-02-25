import { Router } from "express";
import userController from "../controllers/userController.js";

const userRouter = Router();

//routes for CRUD user with before path /users
userRouter.post("/", userController.createUser);
userRouter.get("/", userController.getAllUsers);
userRouter.patch("/:userId", userController.updateUser);
userRouter.delete("/:userId", userController.deleteUser);

//route for Get one
userRouter.get("/:userId", userController.getUserById);

//route for Add, Remove class for user (student, teaching assistant)
userRouter.post("/:userId/class/:classId", userController.addClassForUser);
userRouter.delete("/:userId/class/:classId", userController.removeClassForUser);

export default userRouter;
