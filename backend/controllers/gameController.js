const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '../data/games.json');

// Helper to ensure data directory and file exist
const initStorage = async () => {
    try {
        const dir = path.dirname(DATA_PATH);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(DATA_PATH);
        } catch {
            await fs.writeFile(DATA_PATH, JSON.stringify([]));
        }
    } catch (err) {
        console.error('Failed to init storage:', err);
    }
};

initStorage();

// Handles parsing prompt -> JSON config
exports.generateGame = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Incoming Prompt:', prompt);
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // We import aiService here to avoid circular dependency if any
    const aiService = require('../services/aiService');
    const gameConfig = await aiService.generateConfig(prompt);
    
    res.status(200).json({ config: gameConfig });
  } catch (error) {
    console.error('Error in generateGame:', error.message);
    res.status(500).json({ error: 'Failed to generate game', details: error.message });
  }
};

// Save a finalized game config to local file
exports.saveGame = async (req, res) => {
  try {
    const { prompt, config } = req.body;
    
    const data = await fs.readFile(DATA_PATH, 'utf8');
    const games = JSON.parse(data);
    
    const newGame = {
        _id: uuidv4(),
        prompt,
        config,
        createdAt: new Date().toISOString()
    };
    
    games.unshift(newGame); // Add to beginning
    await fs.writeFile(DATA_PATH, JSON.stringify(games, null, 2));
    
    res.status(201).json({ id: newGame._id, message: 'Game saved successfully' });
  } catch (error) {
    console.error('Error saving game:', error.message);
    res.status(500).json({ error: 'Failed to save game' });
  }
};

// Retrieve all games (history)
exports.getAllGames = async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    const games = JSON.parse(data);
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Retrieve a specific game
exports.getGame = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(DATA_PATH, 'utf8');
    const games = JSON.parse(data);
    
    const game = games.find(g => g._id === id);
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
