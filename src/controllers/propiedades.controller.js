import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { agenteModel } from "../models/agentes.model.js";
import { propiedadesModel } from "../models/propiedades.model.js";
import { usuarioModel } from "../models/usuario.model.js";

const propiedadesController = {};

propiedadesController.getAllPropiedades = async (req, res) => {
  try {
    const propiedades = await propiedadesModel
      .find()
      .populate("usuario", "nombre apellido numCelular role pais ciudad activo")
      .populate(
        "agente",
        "nombre apellido email telefono foto experiencia activo calificacionPromedio totalCalificaciones"
      );

    if (propiedades.lenght === 0) {
      return response(res, 404, false, "", "No se encontraron propiedades");
    }

    return response(res, 200, propiedades, "Lista de propiedades");
  } catch (error) {
    return handleError(res, error);
  }
};

propiedadesController.getPropiedadById = async (req, res) => {
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

    const propiedadFound = await propiedadesModel.findById({ _id: id });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    return response(res, 200, true, propiedadFound, "Propiedad encontrada");
  } catch (error) {
    return handleError(res, error);
  }
};

propiedadesController.postPropiedad = async (req, res) => {
  try {
    upload.array("imagenes", 5)(req, res, async function (err) {
      if (err) {
        return response(
          res,
          400,
          false,
          "",
          "Error al subir las imágenes: " + err.message
        );
      }

      const { tipo_contrato, estado, usuario, agente } = req.body;

      if (
        tipo_contrato.toLowerCase() !== "alquiler" &&
        tipo_contrato.toLowerCase() !== "venta"
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El tipo de contrato solo se permite venta o alquiler"
        );
      }

      if (
        estado.toLowerCase() !== "disponible" &&
        estado.toLowerCase() !== "no disponible"
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El estado de la propiedad solo puede ser disponible o no disponible"
        );
      }

      const agenteFound = await agenteModel.find({ _id: agente });
      if (agenteFound.length === 0) {
        return response(res, 404, false, "", "Agente no encontrado");
      }

      if (!req.files || req.files.length === 0) {
        return response(res, 400, false, "", "Debe subir al menos una imagen");
      }

      const usuarioExist = await usuarioModel.findById({ _id: usuario });
      if (!usuarioExist) {
        return response(res, 404, false, "", "Usuario a asociar no encontrado");
      }

      const imagenesUrls = req.files.map((file) => `/uploads/${file.filename}`);

      const nuevaPropiedad = new propiedadesModel({
        ...req.body,
        imagenes: imagenesUrls,
        tipo_contrato: tipo_contrato.toLowerCase(),
        estado: estado.toLowerCase(),
      });

      const propiedadGuardada = await nuevaPropiedad.save();

      return response(
        res,
        201,
        true,
        propiedadGuardada,
        "Propiedad creada exitosamente"
      );
    });
  } catch (error) {
    return handleError(res, error);
  }
};

propiedadesController.updatePropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_contrato, imagenes, estado, usuario, agente } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const propiedadFound = await propiedadesModel.findById({ _id: id });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    if (propiedadFound.tipo_contrato != tipo_contrato) {
      if (
        tipo_contrato != "alquiler".toLowerCase ||
        tipo_contrato != "venta".toLowerCase
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El tipo de contrato solo se permite venta o alquiler"
        );
      }
    }

    if (propiedadFound.estado != estado) {
      if (
        estado != "disponible".toLowerCase ||
        estado != "no disponible".toLowerCase
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El estado de la propiedad solo puede ser disponible o no disponible"
        );
      }
    }

    if (imagenes.lenght === 0) {
      return response(
        res,
        400,
        false,
        "",
        "El campo imagenes no puede ir vacio"
      );
    }

    if (propiedadFound.agente != agente) {
      const agenteFound = await agenteModel.find({ _id: agente });
      if (agenteFound.length === 0) {
        return response(res, 404, false, "", "Agente no encontrado");
      }
    }

    if (propiedadFound.usuario != usuario) {
      const usuarioExist = await usuarioModel.findById({ _id: usuario });
      if (!usuarioExist) {
        return response(res, 404, false, "", "Usuario a asociar no encontrado");
      }
    }

    const propiedadUpdated = await propiedadesModel.updateOne(req.body);
    return response(res, 200, true, propiedadUpdated, "Propiedad actualizada");
  } catch (error) {
    return handleError(res, error);
  }
};

propiedadesController.deletePropiedad = async (req, res) => {
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

    const propiedadFound = await propiedadesModel.findById({ _id: id });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    await propiedadesModel.deleteOne(propiedadFound);
    return response(res, 200, true, "", "Propiedad eliminada");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** propiedaddes disponibles

propiedadesController.getPropiedadesDisponible = async (req, res) => {
  try {
    const propiedadesDisponbibles = await propiedadesModel.find({
      estado: true,
    });
    if (!propiedadesDisponbibles) {
      return response(
        res,
        404,
        false,
        "",
        "No hay propiedades disponibles en el momento"
      );
    }

    return response(
      res,
      200,
      true,
      propiedadesDisponbibles,
      "Lista de propiedades disponibles"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** propiedades no disponibles

propiedadesController.getPropiedadesNoDisponibles = async (req, res) => {
  try {
    const propiedadesNoDisponibles = await propiedadesModel.find({
      estado: false,
    });
    if (!propiedadesNoDisponibles) {
      return response(
        res,
        404,
        false,
        "",
        "No hay ninguna propiedad no disponible en el momento"
      );
    }

    return response(
      res,
      200,
      true,
      propiedadesNoDisponibles,
      " Lista de propiedades no disponibles"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** vender propiedad

propiedadesController.venderPropiedad = async (req, res) => {
  try {
    const { idPropiedad } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idPropiedad)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idPropiedad} no es valido para la base de datos`
      );
    }

    const propiedadFound = await propiedadesModel.findById({
      _id: idPropiedad,
    });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    if (propiedadFound.estado === "No disponible") {
      return response(
        res,
        400,
        false,
        "",
        "La propiedad ya no esta disponible"
      );
    }

    propiedadFound.estado = "No disponible";
    await propiedadFound.save();

    return response(res, 200, true, propiedadFound, "Propiedad vendida");
  } catch (error) {
    return handleError(res, error);
  }
};

export default propiedadesController;
