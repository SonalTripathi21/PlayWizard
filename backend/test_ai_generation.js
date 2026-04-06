const { generateConfig } = require('./services/aiService');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function test() {
  const prompt = "Create a game where I am a cat and I have to catch mice while avoiding dogs";
  console.log(`Testing prompt: "${prompt}"`);
  try {
    const config = await generateConfig(prompt);
    console.log("SUCCESS! Generated Config:");
    console.log(JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("FAILED!", error.message);
  }
}

test();
