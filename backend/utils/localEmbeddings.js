import { pipeline } from '@xenova/transformers';
import { Embeddings } from '@langchain/core/embeddings';

/**
 * Local embeddings using Transformers.js (runs on CPU, no API needed)
 */
export class LocalEmbeddings extends Embeddings {
  constructor() {
    super({});
    this.pipelinePromise = null;
  }

  async getPipeline() {
    if (!this.pipelinePromise) {
      console.log('📥 Loading local embedding model (first time only, ~50MB download)...');
      this.pipelinePromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.pipelinePromise;
  }

  async embedDocuments(texts) {
    const extractor = await this.getPipeline();
    const embeddings = [];
    
    for (let i = 0; i < texts.length; i++) {
      console.log(`Processing chunk ${i + 1}/${texts.length}...`);
      const output = await extractor(texts[i].substring(0, 512), { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }
    
    return embeddings;
  }

  async embedQuery(text) {
    const extractor = await this.getPipeline();
    const output = await extractor(text.substring(0, 512), { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}
