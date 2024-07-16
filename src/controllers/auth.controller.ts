import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// local imports
import {
  checkPassword,
  handleValidateEmail,
  handleValidatePassword,
  handleValidatePhone,
  handleValidateUniqueUser,
  handleValidationErrors,
  handleValidationRol,
} from "../validators/validate";
import { User } from "../models/user";
import {
  createCheackoutSession,
  getCustomerSuscriptionByEmail,
  getUserByEmailOrUsername,
} from "../utils/utils";

async function registerUser(req: Request, res: Response) {
  const newUser = new User(req.body);
  newUser.password = await bcrypt.hash(newUser.password, 10);
  await newUser.save();
  //aqui se puede meter que cree el token y lo devuelva
  return res.status(201).json({ message: `${newUser}` });
}

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, phone, rol } = req.body;
  if (handleValidationRol(rol, res)) return;
  if (await handleValidateUniqueUser({ email, username, phone }, res)) return;
  if (handleValidateEmail(email, res)) return;
  if (handleValidatePhone(phone, res)) return;
  if (handleValidatePassword(password, res)) return;
  try {
    if (rol === "admin") {
      //pasarela de pago
      const session = await createCheackoutSession(email);
      const customerSuscription = await getCustomerSuscriptionByEmail(email);
      if (customerSuscription) {
        await registerUser(req, res);
      }
      return res.status(200).json({ url: session.url });
    } else {
      await registerUser(req, res);
    }
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  //findUserByEmailOrUsername
  //despues de que se registre tiene que loguearse para crear el token suyo
  //devolver el token(jwt) de sesion

  const userFound = await getUserByEmailOrUsername(
    req.body.email,
    req.body.username
  );
  if (!req.body.password)
    return res.status(400).json({ message: "Password is required" });
  if (!userFound) return res.status(404).json({ message: "User not found" });
  if (await checkPassword(req.body.password, res, userFound)) return;

  // create token jwt devolverlo
  //id: userFound._id a quien le quiero crear el token
  const token = jwt.sign(
    { id: userFound._id, rol: userFound.rol, username: userFound.username},
    "secretkey",
    {
      expiresIn: 86400, // 24 hours
      algorithm: "HS512",
    }
  );
  return res.json({ token });
};
