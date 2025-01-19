import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { contratoModel } from "../models/contratos.model.js";
import { propiedadesModel } from "../models/propiedades.model.js";
import { usuarioModel } from "../models/usuario.model.js";
import { agenteModel } from "../models/agentes.model.js";

const contratosController = {};

contratosController.getAllContratos = async (req, res) => {
  try {
    const contratos = await contratoModel
      .find()
      .populate(
        "propiedades",
        "nombre descripcion tipo_contrato ubicacion precio estado"
      )
      .populate(
        "usuario",
        "nombre apellido numCelular role pais ciudad activo"
      );

    if (contratos.length === 0) {
      return response(res, 404, false, "", "No se encontraron contratos");
    }

    return response(res, 200, true, contratos, "Lista de todos los contratos");
  } catch (error) {
    return handleError(res, error);
  }
};

contratosController.getContratoById = async (req, res) => {
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

    const contratoFound = await contratoModel.findById({ _id: id });
    if (!contratoFound) {
      return response(res, 404, false, "", "Contrato no encontrado");
    }

    return response(res, 200, true, contratoFound, "Contrato encontrato");
  } catch (error) {
    return handleError(res, error);
  }
};

contratosController.postController = async (req, res) => {
  try {
    const { propiedad, usuario, tipo_contrato, estado } = req.body;

    const propiedadFound = await propiedadesModel.findById({ _id: propiedad });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    const usuarioFound = await usuarioModel.findById({ _id: usuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", " Usuario no encontrado");
    }

    if (
      tipo_contrato != "alquiler".toLowerCase ||
      tipo_contrato != "venta".toLowerCase
    ) {
      return response(
        res,
        400,
        false,
        "",
        "Solo se puede de tipo alquiler o venta"
      );
    }

    if (
      estado != "activo".toLowerCase ||
      estado != "finalizado".toLowerCase ||
      estado != "cancelado".toLowerCase
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser activo, finalizado o cancelado"
      );
    }

    const newContrato = await contratoModel.create(req.body);
    return response(res, 201, true, newContrato, "Contrato creado");
  } catch (error) {
    return handleError(res, error);
  }
};

contratosController.putController = async (req, res) => {
  try {
    const { id } = req.params;
    const { propiedad, usuario, tipo_contrato, estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const contratoFound = await contratoModel.findById({ _id: id });
    if (!contratoFound) {
      return response(res, 404, false, "", "Contrato no encontrato");
    }

    if (contratoFound.propiedad != propiedad) {
      const propiedadFound = await propiedadesModel.findById({
        _id: propiedad,
      });
      if (!propiedadFound) {
        return response(res, 404, false, "", "Propiedad no encontrada");
      }
    }

    if (contratoFound.usuario != usuario) {
      const usuarioFound = await usuarioModel.findById({ _id: usuario });
      if (!usuarioFound) {
        return response(res, 404, false, "", " Usuario no encontrado");
      }
    }

    if (contratoFound.tipo_contrato != tipo_contrato) {
      if (
        tipo_contrato != "alquiler".toLowerCase ||
        tipo_contrato != "venta".toLowerCase
      ) {
        return response(
          res,
          400,
          false,
          "",
          "Solo se puede de tipo alquiler o venta"
        );
      }
    }

    if (contratoFound.estado != estado) {
      if (
        estado != "activo".toLowerCase ||
        estado != "finalizado".toLowerCase ||
        estado != "cancelado".toLowerCase
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El estado solo puede ser activo, finalizado o cancelado"
        );
      }
    }

    const contratoUpdate = await contratoFound.updateOne(req.body);
    return response(res, 200, true, contratoUpdate, "Contrato actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

contratosController.deleteContrato = async (req, res) => {
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

    const contratoFound = await contratoModel.findById({ _id: id });
    if (!contratoFound) {
      return response(res, 404, false, "", "Contrato no encontrato");
    }

    const contratoInactive = await contratoModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    return response(
      res,
      200,
      true,
      contratoInactive,
      "Conrato inactivo/eliminado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** get contratos inactivos

contratosController.getContratosInactivos = async (req, res) => {
  try {
    const contratosInactives = await contratoModel.find({ activo: false });
    if (!contratosInactives) {
      return response(res, 404, false, "", "No hay ningun contrato inactivo");
    }

    return response(
      res,
      200,
      true,
      contratosInactives,
      "Lista con contratos inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** contratos activos

contratosController.getContratosActivos = async (req, res) => {
  try {
    const contratosActive = await contratoModel.find({ activo: true });
    if (!contratosActive) {
      return response(res, 404, false, "", "No hay contratos activos");
    }
    return response(
      res,
      200,
      true,
      contratosActive,
      "Lista de contratos activos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** historial de contratos por usuario

contratosController.historialUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return response(
        res,
        400,
        false,
        "",
        "El id de usuario no es valido para la base de datos"
      );
    }

    const usuarioFound = await usuarioModel.find({ _id: idUsuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const usuarioContrato = await contratoModel.find({ usuario: idUsuario });
    if (usuarioContrato.length === 0) {
      return response(res, 404, false, "", "El usuario no tiene contratos aun");
    }

    return response(
      res,
      200,
      true,
      usuarioContrato,
      `Lista de contratos para el usuario con el id ${idUsuario}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** contratos de un agente esp

contratosController.getContratosAgenteEsp = async (req, res) => {
  try {
    const { idAgente } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idAgente)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idAgente} no es valido para la base de datos`
      );
    }

    const agenteFound = await agenteModel.findById({ _id: idAgente });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agente no encontrado");
    }

    const contratosAgenteEsp = await contratoModel.find({ agente: idAgente });
    if (contratosAgenteEsp.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "El agente no tiene propiedades asignadas"
      );
    }

    return response(
      res,
      200,
      true,
      contratosAgenteEsp,
      `Lista de contratos del agente con el id ${idAgente}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default contratosController;
