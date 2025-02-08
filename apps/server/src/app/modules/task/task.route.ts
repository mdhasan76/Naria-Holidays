import express from "express";
import auth from "../../../middlewares/auth";
import { TaskController } from "./task.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { TaskValidation } from "./task.validation";

const route = express.Router();
route.use(auth());
route
  .get("/", TaskController.getTasks)
  .get("/states", TaskController.getTaskStates)
  .get("/:id", TaskController.getTaskById)
  .post(
    "/",
    validateRequest(TaskValidation.taskValidationSchema),
    TaskController.createTask
  )
  .put("/:id", TaskController.updateTask)
  .delete("/:id", TaskController.deleteTask);

export const TaskRouter = route;
