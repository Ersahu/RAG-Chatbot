// Test Hugging Face API directly
const API_KEY = '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';

async function testHuggingFaceAPI() {
  console.log('Testing Hugging Face Embedding API...\n');
  
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'Hello world',
        options: { wait_for_model: true }
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      console.log('\n✅ API is working!');
    } else {
      console.log('\n❌ API returned an error');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testHuggingFaceAPI();
