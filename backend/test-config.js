import dotenv from 'dotenv';
import { getChatModel, getEmbeddings } from './utils/llmProvider.js';

dotenv.config();

console.log('\n=== Testing Configuration ===');
console.log('LLM_PROVIDER:', process.env.LLM_PROVIDER);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);

try {
  const chatModel = getChatModel();
  console.log('✅ Chat model created successfully');
  console.log('Model config:', {
    baseURL: chatModel.configuration?.baseURL,
    modelName: chatModel.modelName
  });
} catch (error) {
  console.error('❌ Chat model error:', error.message);
}

try {
  const embeddings = getEmbeddings();
  console.log('✅ Embeddings created successfully');
  console.log('Embeddings type:', embeddings.constructor.name);
} catch (error) {
  console.error('❌ Embeddings error:', error.message);
}

console.log('=== Configuration Test Complete ===\n');