import { Router } from "express";
import visitasController from "../controllers/visitas.controller.js";

const visitasRouter = Router();

visitasRouter.get("/", visitasController.getAllVisitas);
visitasRouter.get("/:id", visitasController.getVisitasById);
visitasRouter.post("/", visitasController.postVisita);
visitasRouter.put("/:id", visitasController.putVisita);
visitasRouter.delete("/:id", visitasController.deleteVisita);

// ** visitas pendientes
visitasRouter.get("/pendientes", visitasController.getVisistasPendientes);

// ** visitas canceladas
visitasRouter.get("/canceladas", visitasController.getVisitasCanceladas);

// ** visitas confirmadas
visitasRouter.get("/confirmadas", visitasController.getVisitasConfirmadas);

export default visitasRouter;
