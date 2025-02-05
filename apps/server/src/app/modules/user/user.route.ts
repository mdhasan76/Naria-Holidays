import express from "express";
import { UserController } from "./user.controller";
import auth from "../../../middlewares/auth";

const route = express.Router();
// route.use(auth());
route
  .post(
    "/create",
    // validateRequest(UserValidation.CreateUserZodSchema),
    UserController.createUser
  )
  .patch("/:id", UserController.updateUser)
  .delete("/:id", UserController.deleteUser)
  .get("/:id", UserController.getUserById)
  .get("/", UserController.getUsers);

export const UserRouter = route;
