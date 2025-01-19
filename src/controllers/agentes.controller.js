import { agenteModel } from "../models/agentes.model.js";
import { response } from "../helpers/response.js";
import { propiedadesModel } from "../models/propiedades.model.js";
import { handleError } from "../helpers/error.handler.js";
import mongoose from "mongoose";

const agenteController = {};

agenteController.getAllagentes = async (req, res) => {
  try {
    const agentes = await agenteModel
      .find()
      .populate(
        "propiedades",
        "nombre descripcion tipo_contrato ubicacion precio estado"
      );

    if (agentes.length === 0) {
      return response(res, 404, false, "", "No se encontraron egentes");
    }

    return response(res, 200, true, agentes, "Lista de agentes");
  } catch (error) {
    return handleError(res, error);
  }
};

agenteController.getAgenteById = async (req, res) => {
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

    const agenteFound = await agenteModel.findById({ _id: id });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agente no encontrado");
    }
    return response(res, 200, true, agenteFound, "Agente encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

agenteController.postAgente = async (req, res) => {
  try {
    const { email, telefono, propiedades, foto } = req.body;

    const emailRepited = await agenteModel.findOne({ email: email });
    if (emailRepited) {
      return response(
        res,
        400,
        false,
        "",
        "El correo ya se encuentra registrado"
      );
    }

    const telRepited = await agenteModel.findOne({ telefono: telefono });
    if (telRepited) {
      return response(
        res,
        400,
        false,
        "",
        "El telefono ya se encuentra registrado"
      );
    }

    const propiedadesExist = await propiedadesModel.findById({
      _id: propiedades,
    });
    if (!propiedadesExist) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    if (foto.lenght === 0) {
      return response(
        res,
        400,
        false,
        "",
        "El campo de la foto no puede ir vacio"
      );
    }

    const nuevoAgente = await agenteModel.create(req.body);
    return response(res, 201, true, nuevoAgente, "Agente creado");
  } catch (error) {
    return handleError(res, error);
  }
};

agenteController.putAgente = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, telefono, propiedades, foto } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const agenteFound = await agenteModel.findById({ _id: id });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agente no encontrado");
    }

    if (agenteFound.email != email) {
      const emailRepited = await agenteModel.findOne({ email: email });
      if (emailRepited) {
        return response(
          res,
          400,
          false,
          "",
          "El correo ya se encuentra registrado"
        );
      }
    }

    if (agenteFound.telefono != telefono) {
      const telRepited = await agenteModel.findOne({ telefono: telefono });
      if (telRepited) {
        return response(
          res,
          400,
          false,
          "",
          "El telefono ya se encuentra registrado"
        );
      }
    }

    if (agenteFound.propiedades != propiedades) {
      const propiedadesExist = await propiedadesModel.findById({
        _id: propiedades,
      });
      if (!propiedadesExist) {
        return response(res, 404, false, "", "Propiedad no encontrada");
      }
    }

    if (foto.lenght === 0) {
      return response(
        res,
        400,
        false,
        "",
        "El campo de la foto no puede ir vacio"
      );
    }

    const agenteUpdate = await agenteModel.updateOne(req.body);
    return response(res, 200, true, agenteUpdate, "Agente actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

agenteController.deleteAgente = async (req, res) => {
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

    const agenteFound = await agenteModel.findById({ _id: id });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agente no encontrado");
    }

    const agenteInactive = await agenteModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    return response(res, 200, true, agenteInactive, "Agente desacativado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** agentes inactivos

agenteController.getAllAgentesInactives = async (req, res) => {
  try {
    const agentesInactives = await agenteModel.find({ activo: false });
    if (!agentesInactives) {
      return response(res, 404, false, "", "No hay agentes inactivos");
    }

    return response(
      res,
      200,
      true,
      agentesInactives,
      "Lista de agentes inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** agentes activos

agenteController.getAllAgentesActivos = async (req, res) => {
  try {
    const agenteActivos = await agenteModel.find({ activo: true });
    if (agenteActivos.length === 0) {
      return response(res, 404, false, "", "Agente no encontrao");
    }

    return response(res, 200, true, agenteActivos, "Lista de agentes activos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** propiedades de agente esp

agenteController.getPorpiedadesAgt = async (req, res) => {
  try {
    const { idAgente } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idAgente)) {
      return response(
        res,
        400,
        false,
        "",
        "El id del agente no es valido para la base de datos"
      );
    }

    const agenteFound = await agenteModel.findById({ _id: idAgente });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agnete no encontrado");
    }

    const propiedadesAgent = await propiedadesModel.find({ agente: idAgente });
    if (propiedadesAgent.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "El agenteno tiene propiedades asociadas"
      );
    }

    return response(
      res,
      200,
      true,
      propiedadesAgent,
      `Lista de propiedades del agente con el id ${idAgente}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** calificacion agente

agenteController.calificarAgente = async (req, res) => {
  try {
    const { idAgente } = req.params;
    const { calificacion } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idAgente)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${idAgente} no es compatible con la base de datos`
      );
    }

    if (calificacion < 1 || calificacion > 5) {
      return response(
        res,
        400,
        false,
        "",
        "La calificacion no puede ser menor a 1 ni mayor a 5"
      );
    }

    const agenteFound = await agenteModel.findById({ _id: idAgente });
    if (!agenteFound) {
      return response(res, 404, false, "", "Agente no encontrado");
    }

    const totalCalificaciones = agenteFound.totalCalificaciones + 1;
    const promedioCalificaciones =
      (agenteFound.calificacionPromedio * agenteFound.totalCalificaciones +
        calificacion) /
      totalCalificaciones;

    agenteFound.totalCalificaciones = totalCalificaciones;
    agenteFound.calificacionPromedio = promedioCalificaciones;

    await agenteFound.save();
    return response(
      res,
      201,
      true,
      agenteFound,
      `Calificacion guardada con exito del agente con el id ${idAgente}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default agenteController;
