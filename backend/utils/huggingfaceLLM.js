/**
 * Custom Hugging Face LLM implementation using direct API calls
 */
export class HuggingFaceLLM {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'mistralai/Mistral-7B-Instruct-v0.2';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 512;
    this.baseUrl = 'https://router.huggingface.co/models';
  }

  async callAPI(inputs, parameters) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs, parameters, options: { wait_for_model: true } })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HuggingFace API error: ${error}`);
    }

    const data = await response.json();
    return data;
  }

  async invoke(prompt) {
    try {
      const parameters = {
        max_new_tokens: this.maxTokens,
        temperature: this.temperature,
        return_full_text: false
      };
        
      const response = await this.callAPI(prompt, parameters);
        
      // Handle response format
      if (Array.isArray(response) && response.length > 0) {
        return response[0].generated_text || response[0];
      }
        
      return response.generated_text || response;
    } catch (error) {
      console.error('Hugging Face LLM error:', error);
      throw new Error(`LLM generation failed: ${error.message}`);
    }
  }

  async call(prompt) {
    return this.invoke(prompt);
  }
}
