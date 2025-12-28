import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

async function testGroqChat() {
  console.log('Testing Groq Chat API...\n');
  
  try {
    const model = new ChatOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama3-8b-8192',
      baseURL: 'https://api.groq.com/openai/v1',
      temperature: 0.7
    });
    
    console.log('Model created successfully');
    
    const response = await model.invoke("Say hello!");
    console.log('✅ Chat API working! Response:', response.content);
  } catch (error) {
    console.error('❌ Chat API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.response?.status);
  }
}

testGroqChat();