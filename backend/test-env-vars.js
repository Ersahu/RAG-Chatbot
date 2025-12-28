import dotenv from 'dotenv';

dotenv.config();

console.log('LLM_PROVIDER:', process.env.LLM_PROVIDER);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length);
console.log('CHAT_MODEL:', process.env.CHAT_MODEL);