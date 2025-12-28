import dotenv from 'dotenv';

dotenv.config();

async function listGroqModels() {
  console.log('Listing available Groq models...\n');
  
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      return;
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:');
      data.data.forEach(model => {
        console.log(`- ${model.id}`);
      });
    } else {
      const errorText = await response.text();
      console.log('❌ Error listing models:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

listGroqModels();