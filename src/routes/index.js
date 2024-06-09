const express = require('express');
const router = express.Router();
const controller = require('../controllers/player_controllers');

const configureRouter = (app) => {

    router.post('/register/',controller.registerPlayer),
    router.post('/login/', controller.autenticatePlayer),

    router.get('/players/', controller.postPlayers),
    router.get('/players/:id', controller.getPlayer),

    router.put('/highscore/', controller.updateHighscore),
    router.delete('/players/:id', controller.deletePlayer);

    return router;
}
 module.exports = configureRouter;