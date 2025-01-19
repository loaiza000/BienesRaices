import { generateToken } from "../helpers/generateToken.js";
import { usuarioModel } from "../models/usuario.model.js";
import { response } from "../helpers/response.js";
import { handleError } from "../helpers/error.handler.js";
import mongoose from "mongoose";
import { logModel } from "../models/log.model.js";

const usuarioController = {};

usuarioController.getAllUser = async (req, res) => {
  try {
    const users = await usuarioModel
      .find()
      .populate("log", "password email createAdt");

    if (users.length === 0) {
      return response(res, 404, false, "", "No se encontraro usuarios");
    }
    
    return response(res, 200, true, users, "Lista de usuarios");
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.getUserById = async (req, res) => {
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

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(res, 404, fasle, "", "Usuario no encontrado");
    }
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.postUser = async (req, res) => {
  try {
    const { nombre, apellido, numCelular, role, pais, ciudad, idLog } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(idLog)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idLog} no es valido para DB`
      );
    }

    const loginFound = await logModel.findOne({ _id: idLog });
    if (!loginFound) {
      return response(
        res,
        404,
        false,
        "",
        "Login no encontrado para poder asociarlo"
      );
    }

    if (!pais || pais.length === 0) {
      return response(res, 400, false, "", "El pais no puede ir vacio");
    }

    if (!ciudad || ciudad.length === 0) {
      return response(res, 400, false, "", "La ciudad no puede ir vacia");
    }

    const numRepited = await usuarioModel.findOne({ numCelular: numCelular });
    if (numRepited) {
      return response(
        res,
        400,
        false,
        "",
        `El numero de celular ${numCelular} ya se encuentra en uso`
      );
    }

    const roleValid = ["admin", "usuario", "cliente"];
    if (!roleValid.includes(role.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        `Los roles permitidos son ${roleValid}`
      );
    }

    const newUser = new usuarioModel({
      nombre,
      apellido,
      numCelular,
      role,
      pais,
      ciudad,
      activo: true,
      log: idLog,
    });

    const token = generateToken({ usuario: newUser._id });
    newUser.token = token;
    await newUser.save();
    return response(res, 201, true, newUser, "Usuario creado con éxito.");
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.putUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { numCelular, role, log } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id || log)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    if (!log || userFound.log != log) {
      const loginFound = await logModel.findOne({ _id: log });
      if (!loginFound) {
        return response(
          res,
          404,
          false,
          "",
          "Login no encontrado para poder asociarlo"
        );
      }
    }

    if (!pais || pais.length === 0) {
      return response(res, 400, false, "", "El pais no puede ir vacio");
    }

    if (!ciudad || ciudad.length === 0) {
      return response(res, 400, false, "", "La ciudad no puede ir vacia");
    }

    if (userFound.numCelular != numCelular) {
      const numRepited = await usuarioModel.findOne({ numCelular: numCelular });
      if (numRepited) {
        return response(
          res,
          400,
          false,
          "",
          "El numero de celular ya se encuentra registrada"
        );
      }
    }

    const roleValid = ["admin", "usuario", "cliente"];
    if (!roleValid.includes(role.toLowerCase())) {
      return response(
        res,
        400,
        false,
        "",
        `Los roles solo pueden ser ${roleValid}`
      );
    }

    const usuarioUpdate = await userFound.updateOne(req.body);
    return response(res, 200, true, usuarioUpdate, "Usuario actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.deleteUsuario = async (req, res) => {
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

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const usuarioDesactivado = await usuarioModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    return response(
      res,
      200,
      true,
      usuarioDesactivado,
      "Usuario inactivo/eliminado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** usuarios inactivos

usuarioController.getUserInactive = async (req, res) => {
  try {
    const usersInactive = await usuarioModel.find({ activo: false });
    if (usersInactive.length === 0) {
      return response(res, 404, false, "", "No hay usuarios inactivos");
    }

    return response(
      res,
      200,
      true,
      usersInactive,
      "Lista de usuarios inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** usuarios activos

usuarioController.getUsersActivos = async (req, res) => {
  try {
    const usuarioActivo = await usuarioModel.find({ activo: true });
    if (usuarioActivo.length === 0) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    return response(res, 200, true, usuarioActivo, "Lista de usuarios activos");
  } catch (error) {
    return handleError(res, error);
  }
};

export default usuarioController;
