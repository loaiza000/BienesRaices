import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";

const usuarioRouter = Router();

usuarioRouter.get("/", usuarioController.getAllUser);
usuarioRouter.get("/:id", usuarioController.getUserById);
usuarioRouter.post("/", usuarioController.postUser);
usuarioRouter.put("/:id", usuarioController.putUsuario);
usuarioRouter.delete("/:id", usuarioController.deleteUsuario);

// ** usuarios inactivos
usuarioRouter.get("/inactivos", usuarioController.getUserInactive);

// ** usuarios activos
usuarioRouter.get("/activos", usuarioController.getUsersActivos);

export default usuarioRouter;
