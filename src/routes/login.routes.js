import { Router } from "express";
import logController from "../controllers/log.controller.js";

const loginRouter = Router();

// ** register
loginRouter.post("/register", logController.register);

// ** login
loginRouter.post("/login", logController.login);

export default loginRouter;
