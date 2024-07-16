import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Game } from "../models/game";

// Multer configuration
//1) configurar el storage --> en disco (base64) o en memoria
//2) inicializar el middleware de multer

//// creacion del controlador de express que me permita la subida de la imagen

//1) configurar el storage --> en disco (base64) o en memoria
//en caso de que fuese en disco(te crea una carpeta con un conj de archivos randomizados en base64)
//const storage = multer.diskStorage({ destination: "uploads/" });

//en caso de que fuese en memoria: lo guarda en la memoria del servidor en la cache de datos
const storage = multer.memoryStorage();

//2) inicializar el middleware de multer
export const upload = multer({ storage });
//({ storage: storage }) == ({ storage });
//export const upload = multer({ storage, limits: { fileSize: 1000000 } }); //1MB para validar limites de tamaño de la imagen

//para subir single una solo imagen, array varias imagenes o solo una imagen
export const uploadGameImage = async (req: Request, res: Response) => {
  //obtener con el juego con el que yo quiero adjuditcar la imagen
  //de la peticion que me envia front o thunder client queremos obtener la imagen de la peticion
  //validar si se adjunta una imagen
  //actualizamos el juego con la imagen

  //obtener el juego
  const { id } = req.params;
  //obtener la imagen
  const img = req.file; // en singular single
  //const images = req.files; //en plural array de imagenes
  if (!img) return res.status(400).json({ message: "Image is required" });
  try {
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    //para plural
    //for(let img of images) {
    // game.images.push(img)}

    game.image = img.buffer; //imagen
    await game.save();
    return res
      .status(200)
      .json({ message: "Image uploaded successfully", img }); // img == img: img.buffer
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

//submiddleware porque usamos el middleware de multer personalizando por respuesta el error del del middleware de multer
export const errorHandlingFiles = (
  err: any, // o multer.MulterError
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError)
    //si err es del tipo multer.MulterError
    return res.status(400).json({ message: "Unexpected field in the request" });
  next();
};
