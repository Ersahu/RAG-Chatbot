import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

console.log('Creating model with:');
console.log('- API Key:', process.env.GROQ_API_KEY?.substring(0, 10) + '...');
console.log('- Base URL:', 'https://api.groq.com/openai/v1');
console.log('- Model:', 'llama3-8b-8192');

const model = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.1-8b-instant',
  baseURL: 'https://api.groq.com/openai/v1',
  temperature: 0.7
});

console.log('Model config:');
console.log('- Model name:', model.modelName);
console.log('- Base URL:', model.baseURL);
console.log('- API Key exists:', !!model.apiKey);

// Test invocation
try {
  const response = await model.invoke("Say hello!");
  console.log('✅ Model invocation successful! Response:', response.content);
} catch (error) {
  console.error('❌ Model invocation failed:', error.message);
  console.error('Error code:', error.code);
}