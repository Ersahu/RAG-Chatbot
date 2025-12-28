import dotenv from 'dotenv';

dotenv.config();

async function testGroqAPI() {
  console.log('Testing Groq API...\n');
  
  try {
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
      console.log('✅ API is working! Found', data.data.length, 'models');
      console.log('First model:', data.data[0]?.id);
    } else {
      const error = await response.text();
      console.log('❌ API Error:', error);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testGroqAPI();
