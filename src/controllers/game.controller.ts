import { Request, Response } from "express";

// local imports
import { Game } from "../models/game";
import { handleValidationErrors } from "../validators/validate";

export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find();
    return res.json(games);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    //const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.json(game);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const game = new Game(req.body);
    await game.save(); //con esto lo meto en la base de datos
    return res.status(201).json(game); // 201 es que todo ha ido bien en la creacion
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const updateGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, req.body);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.status(200).json(game); //200 es que todo ha ido bien en la actualizacion
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.status(204).json({ message: "Game deleted" }); //204 es que todo ha ido bien en la eliminacion y que no hay contenido
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
