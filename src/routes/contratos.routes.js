import { Router } from "express";
import contratosController from "../controllers/contratos.controller.js";

const contratosRoutes = Router();

contratosRoutes.get("/", contratosController.getAllContratos);
contratosRoutes.get("/:id", contratosController.getContratoById);
contratosRoutes.post("/", contratosController.postController);
contratosRoutes.put("/:id", contratosController.postController);
contratosRoutes.delete("/:id", contratosController.deleteContrato);

// ** obtener agentes inactivos
contratosRoutes.get("/inactivos", contratosController.getContratosInactivos);

// ** obtener agentes activos
contratosRoutes.get("/activos", contratosController.getContratosActivos);

// ** historial contratos por usuario
contratosRoutes.get(
  "/historialUsuarioEsp/:id",
  contratosController.historialUsuario
);

// ** contratos de un agente especifico
contratosRoutes.get(
  "/contratosAgenteEsp/:id",
  contratosController.getContratosAgenteEsp
);

export default contratosRoutes;
