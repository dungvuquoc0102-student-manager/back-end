import { Router } from "express";
import pointController from "../controllers/pointController.js";

const pointRouter = Router();

//routes for CRUD point with before path /points
pointRouter.post("/", pointController.createPoint);
pointRouter.get("/", pointController.getAllPoints);
pointRouter.patch("/:pointId", pointController.updatePoint);
pointRouter.delete("/:pointId", pointController.deletePoint);

export default pointRouter;
