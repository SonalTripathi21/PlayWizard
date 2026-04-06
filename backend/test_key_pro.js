const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = 'AIzaSyAmWqaMMZdhtW5WFPTLLpE45r6hviELAZQ';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  try {
    console.log('Testing gemini-pro...');
    const result = await model.generateContent('Hi');
    console.log('Success!', result.response.text());
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
