import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { contratoModel } from "../models/contratos.model.js";
import { pagoModel } from "../models/pagos.model.js";
import { usuarioModel } from "../models/usuario.model.js";
import mongoose from "mongoose";

const pagosController = {};

const validMetodosPago = ["tarjeta de credito", "transferencia", "efectivo"];
const validEstados = ["pendiente", "completado", "fallido"];

pagosController.getAllPagos = async (req, res) => {
  try {
    const pagos = await pagoModel
      .find()
      .populate(
        "contrato",
        "propiedad usuario agente tipo_contrato fecha_inicio fecha_fin precio estado condiciones activo"
      )
      .populate(
        "usuario",
        "nombre apellido numCelular role pais ciudad activo"
      );

    if (pagos.length === 0) {
      return response(res, 404, false, "", "No se encontraron pagos");
    }

    return response(res, 200, true, pagos, "Lista de pagos");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.getPagoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const pagoFound = await pagoModel.findById(id);
    if (!pagoFound) {
      return response(res, 404, false, "", "Pago no encontrado");
    }
    return response(res, 200, true, pagoFound, "Pago encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.postPago = async (req, res) => {
  try {
    const { contrato, usuario, metodo_pago, estado } = req.body;

    const contratoFound = await contratoModel.findById(contrato);
    if (!contratoFound) {
      return response(res, 404, false, "", "Contrato no encontrado");
    }

    const usuarioFound = await usuarioModel.findById(usuario);
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    if (!validMetodosPago.includes(metodo_pago.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        "El metodo de pago solo puede ser tarjeta de credito, transferencia o efectivo"
      );
    }

    if (!validEstados.includes(estado.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser pendiente, completado o fallido"
      );
    }

    const newPago = await pagoModel.create(req.body);
    return response(res, 201, true, newPago, "Pago creado");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.putPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { contrato, usuario, metodo_pago, estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const pagoFound = await pagoModel.findById(id);
    if (!pagoFound) {
      return response(res, 404, false, "", "Pago no encontrado");
    }

    if (contrato && contrato !== pagoFound.contrato) {
      const contratoFound = await contratoModel.findById(contrato);
      if (!contratoFound) {
        return response(res, 404, false, "", "Contrato no encontrado");
      }
    }

    if (usuario && usuario !== pagoFound.usuario) {
      const usuarioFound = await usuarioModel.findById(usuario);
      if (!usuarioFound) {
        return response(res, 404, false, "", "Usuario no encontrado");
      }
    }

    if (metodo_pago && !validMetodosPago.includes(metodo_pago.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        "El metodo de pago solo puede ser tarjeta de credito, transferencia o efectivo"
      );
    }

    if (estado && !validEstados.includes(estado.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser pendiente, completado o fallido"
      );
    }

    const pagoUpdate = await pagoModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return response(res, 200, true, pagoUpdate, "Pago actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.deletePago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const pagoFound = await pagoModel.findById(id);
    if (!pagoFound) {
      return response(res, 404, false, "", "Pago no encontrado");
    }

    await pagoModel.findByIdAndDelete(id);
    return response(res, 200, true, "", "Pago eliminado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos pendientes

pagosController.getPagosPendientes = async (req, res) => {
  try {
    const pagosPendientes = await pagoModel.find({ estado: "pendiente" });
    if (!pagosPendientes) {
      return response(res, 404, false, "", "No hay pagos pendientes");
    }
    return response(
      res,
      200,
      true,
      pagosPendientes,
      "Lista de pagos pendientes"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos completados

pagosController.getPagosCompletados = async (req, res) => {
  try {
    const pagosCompletados = await pagoModel.find({ estado: "completado" });
    if (!pagosCompletados) {
      return response(res, 404, false, "", "No hay pagos fallidos");
    }
    return response(
      res,
      200,
      true,
      pagosCompletados,
      "Lista de pagos completados"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos fallidos

pagosController.getPagosFallidos = async (req, res) => {
  try {
    const pagosFallidos = await pagoModel.find({ estado: "fallido" });
    if (!pagosFallidos) {
      return response(res, 404, false, "", "No hay pagos fallidos");
    }
    return response(res, 200, true, pagosFallidos, "Lista de pagos fallidos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos con credito

pagosController.getPagosCredito = async (req, res) => {
  try {
    const pagosCredito = await pagoModel.find({
      metodo_pago: "tarjeta de credito",
    });
    if (!pagosCredito) {
      return response(res, 404, false, "", "No hay pagos con credito");
    }
    return response(
      res,
      200,
      true,
      pagosCredito,
      "Lista de pagos con tarjeta de crédito"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos con trasnferencia

pagosController.getPagosTransferencia = async (req, res) => {
  try {
    const pagosTransferencia = await pagoModel.find({
      metodo_pago: "transferencia",
    });
    if (!pagosTransferencia) {
      return response(
        res,
        404,
        false,
        "",
        "No hay pagos realizados con transferencia"
      );
    }
    return response(
      res,
      200,
      true,
      pagosTransferencia,
      "Lista de pagos con transferencia"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** pagos con efectivo

pagosController.getPagosEfectivo = async (req, res) => {
  try {
    const pagosEfectivo = await pagoModel.find({ metodo_pago: "efectivo" });
    if (!pagosEfectivo) {
      return response(res, 404, false, "", "Np hay pagos con efectivo");
    }
    return response(
      res,
      200,
      true,
      pagosEfectivo,
      "Lista de pagos con efectivo"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** simular credito

pagosController.simularCredito = async (req, res) => {
  try {
    const { years } = req.body;

    if (!years || years < 1 || years > 5) {
      return response(
        res,
        400,
        false,
        "",
        "Por favor envíe un número de años válido (1, 2, 3, 4 o 5)."
      );
    }

    const meses = 12;
    const tasas = {
      1: 1.9,
      2: 2.1,
      3: 2.3,
      4: 2.5,
      5: 2.7,
    };

    const tasa = tasas[years];
    const valorMensual = meses * tasa;
    const totalCredito = valorMensual * years;

    return response(
      res,
      200,
      true,
      { valorMensual, totalCredito },
      "Valor mensual para un crédito a ${years} años"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default pagosController;
