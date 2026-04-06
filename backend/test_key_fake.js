const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = 'AIzaSyFakeKey1234567890';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  try {
    console.log('Testing key...');
    const result = await model.generateContent('Hi');
    console.log('Success!', result.response.text());
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
