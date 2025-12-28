import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { LocalEmbeddings } from './localEmbeddings.js';

/**
 * Unified LLM Provider
 * Supports: OpenAI, Groq, Together AI
 */

const PROVIDER_CONFIG = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-3.5-turbo'
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    embeddingModel: 'nomic-ai/nomic-embed-text-v1.5', // Note: Groq doesn't have embeddings, will use OpenAI
    chatModel: 'llama-3.1-8b-instant'
  },
  together: {
    baseURL: 'https://api.together.xyz/v1',
    embeddingModel: 'togethercomputer/m2-bert-80M-8k-retrieval',
    chatModel: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
  }
};

// Custom Groq chat model that uses direct API call
class DirectGroqChat {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 512;
  }

  async invoke(prompt) {
    try {
      // If prompt is a string, convert it to messages format
      let messages;
      if (typeof prompt === 'string') {
        messages = [{ role: 'user', content: prompt }];
      } else if (prompt && prompt.constructor.name === 'PromptValue') {
        // Handle LangChain PromptValue
        messages = [{ role: 'user', content: prompt.toString() }];
      } else {
        messages = prompt;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: this.temperature,
          max_tokens: this.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        text: data.choices[0].message.content
      };
    } catch (error) {
      throw new Error(`Direct Groq call failed: ${error.message}`);
    }
  }
}

export function getEmbeddings() {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const config = PROVIDER_CONFIG[provider];
  
  // Use local embeddings for Groq (no API needed!)
  if (provider === 'groq') {
    console.log('📊 Using LOCAL embeddings (Transformers.js - no API key needed!)');
    return new LocalEmbeddings();
  }
  
  let apiKey, baseURL, model;
  
  switch (provider) {
    case 'together':
      apiKey = process.env.TOGETHER_API_KEY;
      baseURL = config.baseURL;
      model = process.env.EMBEDDING_MODEL || config.embeddingModel;
      break;
      
    case 'openai':
    default:
      apiKey = process.env.OPENAI_API_KEY;
      baseURL = config.baseURL;
      model = process.env.EMBEDDING_MODEL || config.embeddingModel;
      break;
  }
  
  if (!apiKey) {
    throw new Error(`Missing API key for ${provider}. Please set it in .env file.`);
  }
  
  console.log(`📊 Using ${provider} for embeddings (model: ${model})`);
  
  return new OpenAIEmbeddings({
    apiKey: apiKey,
    model: model,
    baseURL: baseURL
  });
}

export function getChatModel() {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const config = PROVIDER_CONFIG[provider];
  
  let apiKey, baseURL, model;
  
  switch (provider) {
    case 'groq':
      apiKey = process.env.GROQ_API_KEY;
      baseURL = config.baseURL;
      model = process.env.CHAT_MODEL || config.chatModel;
      
      // Use custom direct API call for Groq
      console.log(`🤖 Using ${provider} for chat (model: ${model}) with DIRECT API CALL`);
      return new DirectGroqChat({
        apiKey: apiKey,
        model: model,
        temperature: 0.7,
        maxTokens: 512
      });
      
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
  
  if (!apiKey) {
    throw new Error(`Missing API key for ${provider}. Please set it in .env file.`);
  }
  
  console.log(`🤖 Using ${provider} for chat (model: ${model})`);
  
  return new ChatOpenAI({
    apiKey: apiKey,
    model: model,
    temperature: 0.7,
    maxTokens: 512,
    baseURL: baseURL
  });
}

export function getProviderInfo() {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const config = PROVIDER_CONFIG[provider];
  
  return {
    provider,
    embeddingModel: process.env.EMBEDDING_MODEL || config.embeddingModel,
    chatModel: process.env.CHAT_MODEL || config.chatModel,
    baseURL: config.baseURL
  };
}