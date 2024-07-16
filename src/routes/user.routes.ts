import { Router } from "express";

// local imports
import { getAllUsers } from "../controllers/user.controller";

//vamos a crear un metodo que me devuelva todos los usuarios de la base de datos lo puede hacer todo el mundo

const router = Router();

router.get("/", getAllUsers);

export default router;