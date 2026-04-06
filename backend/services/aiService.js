const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateConfig = async (prompt) => {
  // Use the API key from .env (User must replace 'dummy_key_for_now' with a real key)
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    throw new Error('Please add a valid Google Gemini API Key to backend/.env (GEMINI_API_KEY=your_key) to use real game generation.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  // Instruct the LLM on exactly what JSON format to return
  const systemInstruction = `
  You are an expert game designer engine. Convert the user's prompt into a strict JSON object detailing the game mechanics.
  
  CRITICAL: You MUST use the following schema exactly. DO NOT use "type" inside the player object and DO NOT use an "obstacles" object. Instead, use "shape" for the player and an "entities" ARRAY.
  
  JSON Schema:
  {
    "gameType": "platformer" | "topdown" | "racing" | "shooter",
    "player": {
        "shape": "circle" | "square" | "triangle" | "star" | "spaceship" | "car" | "snake" | "bird",
        "speed": <number 50-500>,
        "size": <number 0.5-3.0>,
        "color": "<hex colorcode>"
    },
    "entities": [
      {
        "name": "<string (e.g. Apple, Spike, Shark)>",
        "shape": "circle" | "square" | "triangle" | "star" | "pipe" | "ghost" | "diamond" | "hexagon",
        "color": "<hex colorcode>",
        "behavior": "collect" | "avoid",
        "speed": <number 50-400>,
        "spawnChance": <number 0.1-1.0>
      }
    ],
    "goal": "<short string description>",
    "mechanic": "avoid" | "catch",
    "difficulty": "easy" | "medium" | "hard",
    "background": "<hex colorcode dark shade>"
  }
  
  Only output valid JSON.
  
  Drawing Logic for 'shape' (Use these names exactly):
  - circle, square, triangle, star, pipe, ghost, diamond, hexagon, spaceship, car, snake, bird.
  
  Logic for 'behavior':
  - "collect": player gets points, no death on touch.
  - "avoid": player dies on touch.
  
  MATCH THE USER THEME EXACTLY. 
  - Create entities that make sense for the prompt. 
  - If it's a food game, create multiple types of "fruit" or "junk food" with "collect" behavior.
  - If it's a ninja game, create "shurikens" to "avoid" and "sushi" to "collect".
  - Always provide at least one entity in the "entities" array.
  `;

  try {
    const result = await model.generateContent(systemInstruction + "\n\nUser prompt: " + prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting from LLM response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const config = JSON.parse(text);
    console.log('Generated AI Config:', JSON.stringify(config, null, 2));
    return config;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate game logic from AI.");
  }
};
