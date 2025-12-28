import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

async function testOpenAI() {
  console.log('Testing OpenAI Chat API...\n');
  
  try {
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
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

testOpenAI();