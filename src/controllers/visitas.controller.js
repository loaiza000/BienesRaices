import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { propiedadesModel } from "../models/propiedades.model.js";
import { usuarioModel } from "../models/usuario.model.js";
import { visitaModel } from "../models/visitas.model.js";

const visitasController = {};

visitasController.getAllVisitas = async (req, res) => {
  try {
    const visitas = await visitaModel
      .find()
      .populate(
        "propiedades",
        "nombre descripcion tipo_contrato ubicacion precio estado"
      )
      .populate(
        "usuario",
        "nombre apellido numCelular role pais ciudad activo"
      );

    if (visitas.lenght === 0) {
      return response(res, 404, false, "", "No se encontraron visitas");
    }

    return response(res, 200, true, visitas, "Lista de visitas");
  } catch (error) {
    return handleError(res, error);
  }
};

visitasController.getVisitasById = async (req, res) => {
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

    const visitaFound = await visitaModel.findById(id);
    if (!visitaFound) {
      return response(res, 404, false, "", "Visita no encontrada");
    }

    return response(res, 200, true, visitaFound, "Visita encontrada");
  } catch (error) {
    return handleError(res, error);
  }
};

visitasController.postVisita = async (req, res) => {
  try {
    const { propiedad, usuario, estado } = req.body;

    const propiedadFound = await propiedadesModel.findById(propiedad);
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    if (propiedadFound.estado === "No disponible") {
      return response(
        res,
        400,
        false,
        "",
        "La propiedad no esta disponible para la visita"
      );
    }

    const usuarioFound = await usuarioModel.findById({ _id: usuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const estadosValidos = ["pendiente", "confirmada", "cancelada"];
    if (!estadosValidos.includes(estado)) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser pendiente, confirmada o cancelada"
      );
    }

    const newVisita = await visitaModel.create(req.body);
    return response(res, 201, true, newVisita, "Visita creada");
  } catch (error) {
    return handleError(res, error);
  }
};

visitasController.putVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const { propiedad, usuario, estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const visitaFound = await visitaModel.findById(id);
    if (!visitaFound) {
      return response(res, 404, false, "", "Visita no encontrada");
    }

    if (propiedad && visitaFound.propiedad !== propiedad) {
      const propiedadFound = await propiedadesModel.findById(propiedad);
      if (!propiedadFound) {
        return response(res, 404, false, "", "Propiedad no encontrada");
      }
    }

    if (usuario && visitaFound.usuario !== usuario) {
      const usuarioFound = await usuarioModel.findById(usuario);
      if (!usuarioFound) {
        return response(res, 404, false, "", "Usuario no encontrado");
      }
    }

    const estadosValidos = ["pendiente", "confirmada", "cancelada"];
    if (estado && !estadosValidos.includes(estado)) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser pendiente, confirmada o cancelada"
      );
    }

    const visitaUpdated = await visitaModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return response(res, 200, true, visitaUpdated, "Visita actualizada");
  } catch (error) {
    return handleError(res, error);
  }
};

visitasController.deleteVisita = async (req, res) => {
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

    const visitaFound = await visitaModel.findById(id);
    if (!visitaFound) {
      return response(res, 404, false, "", "Visita no encontrada");
    }

    await visitaModel.deleteOne({ _id: id });
    return response(res, 200, true, "", "Visita eliminada");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** visitas pendientes
visitasController.getVisistasPendientes = async (req, res) => {
  try {
    const visitasPendientes = await visitaModel.find({ estado: "pendiente" });
    if (visitasPendientes.lenght === 0) {
      return response(res, 404, false, "", "No hay visitas pendientes");
    }

    return response(
      res,
      200,
      true,
      visitasPendientes,
      "Lista de visitas pendientes"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** visitas confirmadas
visitasController.getVisitasConfirmadas = async (req, res) => {
  try {
    const visitasConfirmadas = await visitaModel.find({ estado: "confirmada" });
    if (visitasConfirmadas.length === 0) {
      return response(res, 404, false, "", "No hay visitas confirmadas");
    }

    return response(
      res,
      200,
      true,
      visitasConfirmadas,
      "Lista de visitas confirmadas"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** visitas canceladas

visitasController.getVisitasCanceladas = async (req, res) => {
  try {
    const visitasCanceladas = await visitaModel.find({ estado: "cancelada" });
    if (visitasCanceladas.length === 0) {
      return response(res, 404, false, "", "No hay visitas canceladas");
    }

    return response(
      res,
      200,
      true,
      visitasCanceladas,
      "Lista de visitas canceladas"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default visitasController;
