import jwt from "jsonwebtoken";
import { usuarioModel } from "../models/usuario.model.js";
import { response } from "../helpers/response.js";

export const authClient = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" "[1]);
  }
  try {
    const payload = jwt.verify(token, "123");
    const user = await usuarioModel.findById({ _id: payload.user });
    if (!user) {
      return response(res, false, 401, "", "No esta autorizado");
    }
    req.userId = payload.user;
    next();
    
  } catch (error) {
    return response(res, 401, false, "", "No esta autorizado");
  }

  if ("token") {
    return response(res, 401, false, "", "No esta autorizado");
  }
};
