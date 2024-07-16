import { Response } from "express";
import { roles } from "../utils/utils";
import { UserCredentials } from "../interfaces/UserCredentials";
import { User } from "../models/user";
import bcrypt from "bcrypt";

export function handleValidationRol(rol: string, res: Response) {
  if (!roles.map((r) => r.name).includes(rol))
    return res.status(400).json({ message: "Invalid rol" });
}

export async function handleValidateUniqueUser(
  credentials: UserCredentials,
  res: Response
) {
  if (
    await User.findOne({
      $or: [
        { email: credentials.email },
        { username: credentials.username },
        { phone: credentials.phone },
      ],
    })
  )
    return res.status(400).json({ message: "User already exists" });
}

export function handleValidateEmail(email: string, res: Response) {
  if (!/^\w+([.-]?\w+)*@(gmail|hotmail|outlook)\.com$/.test(email))
    return res.status(400).json({
      message: "Email must be an email from gmail, hotmail or outlook",
    });
}

export function handleValidatePhone(phone: number, res: Response) {
  if (
    !/^(\\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$/.test(phone.toString())
  )
    return res.status(400).json({ message: "Phone must be a Spanish phone" });
}

export function handleValidatePassword(password: string, res: Response) {
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password))
    return res.status(400).json({
      message:
        "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
    });
}

export function handleValidationErrors(error: any, res: Response) {
  const keyError = error.message.split(":");
  console.log("keyError", keyError);
  return res.status(400).json({
    atributeError: keyError[1].trim(),
    message: keyError[2].trim().split(",")[0],
  });
}

export async function checkPassword(
  password: string,
  res: Response,
  userFound: any
) {
  const matchPassword = await bcrypt.compare(password, userFound.password); //userFound.password es la contraseña encriptada
  if (!matchPassword)
    return res.status(401).json({ message: "Invalid password" });
}

export function validateJoinableLobby(lobby: any, res: Response) {
  if (lobby.status !== "En espera") {
    res.status(400).json({ message: "Lobby not available to join" });
    return true;
  }
  if (lobby.players.length >= lobby.maxPlayers) {
    res.status(400).json({ message: "Lobby is full" });
    return true;
  }
  return false;
}

export function validateLeaveingLobby(lobby: any, res: Response) {
  if (lobby.status !== "En espera") {
    res.status(400).json({ message: "Lobby not available to leave" });
    return true;
  }
}

export function validateStartGame(lobby: any, res: Response) {
  if (lobby.status !== "En espera") {
    res.status(400).json({ message: "Lobby not available to start game" });
    return true;
  }
  if (lobby.players.length < 2) {
    res
      .status(400)
      .json({ message: "Lobby needs at least 2 players to start game" });
    return true;
  }
  return false;
}
