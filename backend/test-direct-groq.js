import dotenv from 'dotenv';

dotenv.config();

async function testDirectGroq() {
  console.log('Testing Direct Groq API Call...\n');
  
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      return;
    }
    
    console.log('API Key exists, length:', apiKey.length);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Say hello in one word!' }],
        temperature: 0.7
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct Groq API working! Response:', data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log('❌ Direct Groq API Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testDirectGroq();