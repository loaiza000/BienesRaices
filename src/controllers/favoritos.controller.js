import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { favoritosModel } from "../models/favoritos.model.js";
import { propiedadesModel } from "../models/propiedades.model.js";
import { usuarioModel } from "../models/usuario.model.js";

const favoritosController = {};

favoritosController.getAllFav = async (req, res) => {
  try {
    const favorites = await favoritosModel
      .find()
      .populate(
        "propiedades",
        "nombre descripcion tipo_contrato ubicacion precio estado"
      )
      .populate(
        "usuario",
        "nombre apellido numCelular role pais ciudad activo"
      );

    if (favorites.length === 0) {
      return response(res, 404, false, "", "No se encontraron favoritos");
    }

    return response(res, 200, true, favorites, "Lista de todos los favoritos");
  } catch (error) {
    return handleError(res, error);
  }
};

favoritosController.getFvoritoById = async (req, res) => {
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

    const favoriteFound = await favoritosModel.findById({ _id: id });
    if (!favoriteFound) {
      return response(res, 404, false, "", "Favorito no encontrado");
    }

    return response(res, 200, true, favoriteFound, "Favorito encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

favoritosController.postFavorito = async (req, res) => {
  try {
    const { usuario, propiedades } = req.body;

    const usuarioFound = await usuarioModel.findById({ _id: usuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const propiedadFound = await propiedadesModel.findById({
      _id: propiedades,
    });
    if (!propiedadFound) {
      return response(res, 404, false, "", "Propiedad no encontrada");
    }

    const newFavorite = await favoritosModel.create(req.body);
    return response(res, 201, true, newFavorite, "Favorito creado");
  } catch (error) {
    return handleError(res, error);
  }
};

favoritosController.putFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, propiedades } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `EL id ${id} no es compatible con la base de datos`
      );
    }

    const favoriteFound = await favoritosModel.findById({ _id: id });
    if (!favoriteFound) {
      return response(res, 404, false, "", "Favorito no encontrado");
    }

    if (favoriteFound.usuario != usuario) {
      const usuarioFound = await usuarioModel.findById({ _id: usuario });
      if (!usuarioFound) {
        return response(res, 404, false, "", "Usuario no encontrado");
      }
    }

    if (favoriteFound.propiedades != propiedades) {
      const propiedadFound = await propiedadesModel.findById({
        _id: propiedades,
      });
      if (!propiedadFound) {
        return response(res, 404, false, "", "Propiedad no encontrada");
      }
    }

    const favoriteUpdated = await favoritosModel.updateOne(req.body);
    return response(res, 200, true, favoriteUpdated, "Favorito actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

favoritosController.deleteFavorito = async (req, res) => {
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

    const favoriteFound = await favoritosModel.findById({ _id: id });
    if (!favoriteFound) {
      return response(res, 404, false, "", "Favorito no encontrado");
    }

    return response(res, 200, true, "", "Favorito eliminado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** favoritos uaruario esp

favoritosController.getFavoritosUsuarioEsp = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idUsuario} del usuario no es valido`
      );
    }

    const usuarioFound = await usuarioModel.findById({ _id: idUsuario });
    if (!usuarioFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    const favoritosUsuario = await propiedadesModel.find({
      usuario: idUsuario,
    });
    if (favoritosUsuario.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "El usuario no tiene favoritos asociados"
      );
    }

    return response(
      res,
      200,
      true,
      favoritosUsuario,
      "Lista de favoritos del usuario con el id ${idUsuario}"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default favoritosController;
