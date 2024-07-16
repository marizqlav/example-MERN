import { Router } from "express";

// local imports
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from "../controllers/game.controller";
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  errorHandlingFiles,
  upload,
  uploadGameImage,
} from "../utils/uploadImage";

const router = Router();

router.get("/games", getGames);
router.post("/games", checkAdmin, createGame);
router.get("/game/:id", getGameById);
router.patch("/game/:id", checkAdmin, updateGame); //patch es para actualizar solo un o varios campos del objeto y put es para actualizar todos los campos del objeto de manera obligatoria
router.delete("/game/:id", checkAdmin, deleteGame);
router.post(
  "/game/:id/uploadImage", //endpoint
  checkAdmin, //middleware guardian del admin
  upload.single("image"), // controlador de multer/middleware de multer
  errorHandlingFiles, //submiddleware para validacion personalizada de los errores del middleware de multer, si no esta sale mucho texto que no entiende el usuario
  uploadGameImage //controlador de subida de imagen
); //tipo de subida= single o array)//esta ruta solo la hagan los administradores

export default router;
