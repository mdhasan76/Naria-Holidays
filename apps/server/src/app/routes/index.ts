import express from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/users",
    route: UserRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;
