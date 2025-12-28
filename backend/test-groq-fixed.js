import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

async function testGroq() {
  console.log('Testing Groq Chat API with correct configuration...\n');
  
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      return;
    }
    
    console.log('API Key length:', process.env.GROQ_API_KEY.length);
    
    const model = new ChatOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant', // Updated to correct model
      baseURL: 'https://api.groq.com/openai/v1',
      temperature: 0.7
    });
    
    console.log('Model created successfully');
    
    const response = await model.invoke("Say hello in one word!");
    console.log('✅ Groq API working! Response:', response.content);
  } catch (error) {
    console.error('❌ Groq API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.response?.status);
    console.error('Full error:', error);
  }
}

testGroq();