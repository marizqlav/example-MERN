import { Request, Response } from "express";

// local imports
import { Lobby } from "../models/lobby";
import {
  handleValidationErrors,
  validateJoinableLobby,
  validateLeaveingLobby,
  validateStartGame,
} from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";

export const getInWaitingLobbies = async (_req: Request, res: Response) => {
  try {
    const lobbies = await Lobby.find({ status: "En espera" });
    return res.status(200).json(lobbies);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInProgressLobbies = async (_req: Request, res: Response) => {
  try {
    const lobbies = await Lobby.find({ status: "En progreso" });
    return res.status(200).json(lobbies);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const createLobby = async (req: CustomRequest, res: Response) => {
  //creamos la partida
  try {
    //console.log("req", req);
    const lobby = new Lobby(req.body);
    lobby.createdBy = req.user?.username;
    await lobby.save();
    return res.status(201).json(lobby);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const joinLobby = async (req: CustomRequest, res: Response) => {
  //1) Obtener la partida --> findLobbyById
  //2) Verificar si la partida existe o no y veificar si esta en espera
  //3) Unirme a la partida validando que no este llena y que el usuario no este ya en la partida
  // unirme a la partida --> meter en la lista de jugadores el username del usuario
  try {
    //1)
    const { id } = req.params;
    const lobby = await Lobby.findById(id);

    //2)
    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found" });
    }
    if (validateJoinableLobby(lobby, res)) return;

    //3)
    const user = req.user?.username;
    if (!lobby.players.includes(user)) {
      lobby.players.push(user);
      await lobby.save();
      return res.status(200).json(lobby);
    } else {
      return res.status(400).json({ message: "User already in lobby" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const leaveLobby = async (req: CustomRequest, res: Response) => {
  try {
    //1)
    const { id } = req.params;
    const lobby = await Lobby.findById(id);

    //2)
    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found" });
    }
    if (validateLeaveingLobby(lobby, res)) return;

    //3)
    const user = req.user?.username;

    if (lobby.players.includes(user)) {
      lobby.players = lobby.players.filter((player) => player !== user); //coge todos los jugadores menos el que se va
      await lobby.save();
      return res.status(200).json(lobby);
    } else {
      return res.status(400).json({ message: "User not in lobby" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const startGame = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lobby = await Lobby.findById(id);

    if (!lobby) {
      return res.status(404).json({ message: "Lobby not found" });
    }
    if (validateStartGame(lobby, res)) return;

    lobby.status = "En progreso";
    //ir incrementando el tiempo de juego
    // configurar el juego, asignar roles, asignar las cartas, etc
    await lobby.save();
    return res.status(200).json({ message: "Game started" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
