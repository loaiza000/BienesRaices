import { Router } from "express";
import pagosController from "../controllers/pagos.controller.js";

const pagoRouter = Router();

pagoRouter.get("/", pagosController.getAllPagos);
pagoRouter.get("/:id", pagosController.getPagoById);
pagoRouter.post("/", pagosController.postPago);
pagoRouter.put("/:id", pagosController.putPago);
pagoRouter.delete("/:id", pagosController.deletePago);

// ** pagos completados
pagoRouter.get("/completados", pagosController.getPagosCompletados);

// ** pagos por credito
pagoRouter.get("/credito", pagosController.getPagosCredito);

// ** pagos en efectivo
pagoRouter.get("/efectivo", pagosController.getPagosEfectivo);

// ** pagos fallidos
pagoRouter.get("/fallido", pagosController.getPagosFallidos);

// ** pagos pendientes
pagoRouter.get("/pendientes", pagosController.getPagosPendientes);

// ** pagos por transferencia
pagoRouter.get("/transferencia", pagosController.getPagosTransferencia);

// ** simular credito
pagoRouter.post("/simularCredito", pagosController.simularCredito);

export default pagoRouter;
