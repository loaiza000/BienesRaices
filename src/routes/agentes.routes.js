import { Router } from "express";
import agenteController from "../controllers/agentes.controller.js";

const agentesRoutes = Router();

agentesRoutes.get("/", agenteController.getAllagentes);
agentesRoutes.get("/:id", agenteController.getAgenteById);
agentesRoutes.post("/", agenteController.postAgente);
agentesRoutes.put("/:id", agenteController.putAgente);
agentesRoutes.delete("/:id", agenteController.deleteAgente);

// **  obtener agentes inactivos
agentesRoutes.get("/inactivos", agenteController.getAllAgentesInactives);

// ** obtener agentes activos
agentesRoutes.get("/activos", agenteController.getAllAgentesActivos);

// ** calificar agente
agentesRoutes.post("/calificarAgente/:id", agenteController.calificarAgente);

export default agentesRoutes;
