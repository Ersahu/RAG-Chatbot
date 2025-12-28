import { Embeddings } from '@langchain/core/embeddings';

/**
 * Custom Hugging Face Embeddings implementation using direct API calls
 */
export class HuggingFaceEmbeddings extends Embeddings {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.model = config.model || 'sentence-transformers/all-MiniLM-L6-v2';
    this.baseUrl = 'https://router.huggingface.co/pipeline/feature-extraction';
  }

  async callAPI(inputs) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs, options: { wait_for_model: true } })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HuggingFace API error: ${error}`);
    }

    const data = await response.json();
    return data;
  }

  async embedDocuments(texts) {
    const embeddings = [];
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      let retries = 3;
      let success = false;
      
      while (retries > 0 && !success) {
        try {
          console.log(`Processing chunk ${i + 1}/${texts.length}...`);
          
          const response = await this.callAPI(text.substring(0, 512));
          
          // Convert response to array if needed
          const embedding = Array.isArray(response) ? response : Array.from(response);
          embeddings.push(embedding);
          success = true;
          
          // Small delay between requests to avoid rate limiting
          if (i < texts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          retries--;
          console.warn(`Embedding attempt failed for chunk ${i + 1}, retries left: ${retries}`);
          console.warn(`Error: ${error.message}`);
          
          if (retries === 0) {
            throw new Error(`Failed to generate embeddings after 3 attempts: ${error.message}`);
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
        }
      }
    }
    
    return embeddings;
  }

  async embedQuery(text) {
    let retries = 3;
    
    while (retries > 0) {
      try {
        const response = await this.callAPI(text.substring(0, 512));
        return Array.isArray(response) ? response : Array.from(response);
      } catch (error) {
        retries--;
        console.warn(`Query embedding failed, retries left: ${retries}`);
        
        if (retries === 0) {
          throw new Error(`Failed to generate query embedding: ${error.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
