const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Route to generate a new game based on a prompt
router.post('/generate', gameController.generateGame);

// Route to save a generated game
router.post('/save', gameController.saveGame);

// Route to get a saved game by ID
router.get('/:id', gameController.getGame);

// Route to get all saved games (history)
router.get('/', gameController.getAllGames);

module.exports = router;
