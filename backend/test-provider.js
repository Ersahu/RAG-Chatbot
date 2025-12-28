import dotenv from 'dotenv';
import { getProviderInfo } from './utils/llmProvider.js';

dotenv.config();

console.log('\n🎉 LLM Provider Configuration:');
console.log(JSON.stringify(getProviderInfo(), null, 2));
console.log('\n✅ Configuration loaded successfully!\n');
