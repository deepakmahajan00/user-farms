import { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import coordinate from "./coordinate.routes";
import farm from "./farm.routes";
import { authMiddleware } from "middlewares/auth.middleware";
import codeexercise from "./codeexercise.routes";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/codeexercises", codeexercise);

routes.use(authMiddleware)

routes.use("/coordinates", coordinate);
routes.use("/farms", farm);

export default routes;
