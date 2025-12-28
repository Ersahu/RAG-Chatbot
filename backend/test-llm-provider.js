import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

async function testLLMProvider() {
  // Replicate the getChatModel function logic
  const provider = process.env.LLM_PROVIDER || 'openai';

  const PROVIDER_CONFIG = {
    openai: {
      baseURL: 'https://api.openai.com/v1',
      embeddingModel: 'text-embedding-3-small',
      chatModel: 'gpt-3.5-turbo'
    },
    groq: {
      baseURL: 'https://api.groq.com/openai/v1',
      embeddingModel: 'nomic-ai/nomic-embed-text-v1.5',
      chatModel: 'llama-3.1-8b-instant'
    },
    together: {
      baseURL: 'https://api.together.xyz/v1',
      embeddingModel: 'togethercomputer/m2-bert-80M-8k-retrieval',
      chatModel: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    }
  };

  const config = PROVIDER_CONFIG[provider];

  let apiKey, baseURL, model;

  switch (provider) {
    case 'groq':
      apiKey = process.env.GROQ_API_KEY;
      baseURL = config.baseURL;
      model = process.env.CHAT_MODEL || config.chatModel;
      break;
      
    case 'together':
      apiKey = process.env.TOGETHER_API_KEY;
      baseURL = config.baseURL;
      model = process.env.CHAT_MODEL || config.chatModel;
      break;
      
    case 'openai':
    default:
      apiKey = process.env.OPENAI_API_KEY;
      baseURL = config.baseURL;
      model = process.env.CHAT_MODEL || config.chatModel;
      break;
  }

  console.log('Provider:', provider);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  console.log('Base URL:', baseURL);
  console.log('Model:', model);

  if (!apiKey) {
    console.error(`Missing API key for ${provider}. Please set it in .env file.`);
    process.exit(1);
  }

  console.log(`🤖 Using ${provider} for chat (model: ${model})`);

  const chatModel = new ChatOpenAI({
    apiKey: apiKey,
    model: model,
    temperature: 0.7,
    maxTokens: 512,
    baseURL: baseURL
  });

  console.log('Model created successfully');

  // Test the model
  try {
    const response = await chatModel.invoke("Say hello in one word!");
    console.log('✅ Chat API working! Response:', response.content);
  } catch (error) {
    console.error('❌ Chat API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.response?.status);
  }
}

testLLMProvider();