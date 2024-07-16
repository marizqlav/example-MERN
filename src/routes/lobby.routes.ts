import { Router } from 'express';

// local imports
import { createLobby, getInWaitingLobbies, leaveLobby, startGame, joinLobby, getInProgressLobbies } from '../controllers/lobby.controller';
import { checkUserRol } from '../middlewares/checkUserRol';

const router = Router();

router.get('/inWait', checkUserRol, getInWaitingLobbies);
router.get('/inProgress', checkUserRol, getInProgressLobbies);
router.post('/create', checkUserRol, createLobby);
router.post('/join/:id', checkUserRol, joinLobby);
router.post('/leave/:id', checkUserRol, leaveLobby);
router.post('/start/:id', checkUserRol, startGame);

export default router;