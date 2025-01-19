import { Router } from "express";
import favoritosController from "../controllers/favoritos.controller.js";

const favortitosRouter = Router();

favortitosRouter.get("/", favoritosController.getAllFav);
favortitosRouter.get("/:id", favoritosController.getFvoritoById);
favortitosRouter.post("/", favoritosController.postFavorito);
favortitosRouter.put("/:id", favoritosController.putFavorito);
favortitosRouter.delete("/:id", favoritosController.deleteFavorito);

// ** favoritos de usuario esp
favortitosRouter.get(
  "/favoritosUserEsp/:id",
  favoritosController.getFavoritosUsuarioEsp
);

export default favortitosRouter;
