import { handleError } from "../helpers/error.handler.js";
import { logModel } from "../models/log.model.js";
import { encryptPassword } from "../helpers/encryptPassword.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { usuarioModel } from "../models/usuario.model.js";
import { response } from "../helpers/response.js";
import { generateToken } from "../helpers/generateToken.js";

const logController = {};

logController.register = async (req, res) => {
  try {
    const { password, email, idUsuario } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idUsuario} no es valido para la DB`
      );
    }

    const usuarioFound = await usuarioModel.findById({ _id: idUsuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const emailFound = await logModel.findOne({ email: email });
    if (emailFound) {
      return response(
        res,
        400,
        false,
        "",
        "El email ya se encuentra registrado"
      );
    }

    if (!password || password.lenght < 4) {
      return response(
        res,
        400,
        false,
        "",
        "El password tiene que ser mayor a 4 caracteres"
      );
    }

    const passwordFound = await logModel.find({ password: password });
    if (passwordFound) {
      return response(
        res,
        400,
        false,
        "",
        "El password ya se encuentra registrado"
      );
    }

    const passwordEncrypt = encryptPassword(password);
    const newLog = new logModel({ email, password: passwordEncrypt });
    await newLog.save();
    return response(res, 200, true, newLog, "Log creado");
  } catch (error) {
    return handleError(res, error);
  }
};

logController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(
        res,
        404,
        false,
        "",
        "El password y el email son requeridos"
      );
    }

    const log = await logModel
      .findOne({ email: email })
      .populate(
        "usuario",
        "nombre apellido numCelular role pais ciudad activo token"
      );

    if (!log) {
      return response(res, 404, false, "", "Email o password incorrectos");
    }

    if (!log.usuario.activo) {
      return response(
        res,
        400,
        false,
        "",
        "La cuenta del usuario esta desactivada"
      );
    }

    const isPasswordValid = await bcrypt.compare(password, log.password);
    if (!isPasswordValid) {
      return response(res, 400, false, "", "Credenciales inválidas");
    }

    const logData = {
      id: log._id,
      email: log.email,
      password: log.password,
      createAdt: log.createdAt,
    };

    const userData = {
      id: log.usuario._id,
      nombre: log.usuario.nombre,
      apellido: log.usuario.apellido,
      numCelular: log.usuario.numCelular,
      role: log.usuario.role,
      pais: log.usuario.pais,
      ciudad: log.usuario.ciudad,
      activo: log.usuario.activo,
    };

    const token = generateToken({ id: log._id });

    return response(res, 200, true, { logData, userData, token }, "Bienvenido");
  } catch (error) {
    return handleError(res, error);
  }
};

export default logController;
