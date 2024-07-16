import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  //1) obtener el token de sesion
  //2) validar si le pasamos token o no
  //3) decodificar el token y validar si es valido (user)
  //4) del token del usuario, mirar su rol
  //5) si el rol es admin, entonces next()

  //1)
  const token = req.headers.authorization;
  //2)
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  //3)
  try {
    const user = jwt.verify(token, "secretkey") as jwt.JwtPayload;
    //4)
    if (user.rol !== "admin") {
      return res.status(403).json({ message: "You are not an admin" });
    }
    //5)
    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
