import dotenv from 'dotenv';

dotenv.config();

async function testGroqDirect() {
  console.log('Testing Groq API directly with fetch...\n');
  
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      return;
    }
    
    console.log('API Key length:', process.env.GROQ_API_KEY.length);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: 'Say hello in one word!' }],
        temperature: 0.7
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct API working! Response:', data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log('❌ Direct API Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testGroqDirect();