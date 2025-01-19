import { Router } from "express";
import propiedadesController from "../controllers/propiedades.controller.js";

const propiedadesRouter = Router();

propiedadesRouter.get("/", propiedadesController.getAllPropiedades);
propiedadesRouter.get("/:id", propiedadesController.getPropiedadById);
propiedadesRouter.post("/", propiedadesController.postPropiedad);
propiedadesRouter.put("/:id", propiedadesController.updatePropiedad);
propiedadesRouter.delete("/:id", propiedadesController.deletePropiedad);

// ** propiedades disponibles
propiedadesRouter.get(
  "/disponibles",
  propiedadesController.getPropiedadesDisponible
);

// ** propiedades no disponibles
propiedadesRouter.get(
  "/noDisponibles",
  propiedadesController.getPropiedadesNoDisponibles
);

// ** venta propiedad
propiedadesRouter.put(
  "/ventaPropiedad/:id",
  propiedadesController.venderPropiedad
);

export default propiedadesRouter;
