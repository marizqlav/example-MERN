import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interfaces/customRequest";

export const checkUserRol = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  //1)
  const token = req.headers.authorization;
  //2)
  if (!token) {
    return res
      .status(401)
      .json({ error: "You must login to use this feature" });
  }
  //3)
  try {
    const user = jwt.verify(token, "secretkey") as jwt.JwtPayload;
    //4)
    if (user.rol === "anonymous") {
      return res.status(403).json({ message: "You must login to use this feature" });
    }
    req.user = user;
    //5)
    next();
  } catch (error: any) {
    //tema de hacking si es token invalido
    return res.status(403).json({ error: "Invalid token" });
  }
};
