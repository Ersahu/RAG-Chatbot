import { getEmbeddings } from '../utils/llmProvider.js';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document as LangchainDocument } from 'langchain/document';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_PATH = path.join(__dirname, '..', 'vector_store');

// In-memory store for vector databases (for development)
// For production, use a persistent vector database like Pinecone or Weaviate
const vectorStoreCache = new Map();

// Ensure vector store directory exists
await fs.mkdir(VECTOR_STORE_PATH, { recursive: true }).catch(() => {});

/**
 * Create and save vector store for document
 */
export const createVectorStore = async (chunks, documentId) => {
  try {
    const embeddings = getEmbeddings();
    
    // Convert chunks to Langchain documents
    const docs = chunks.map((chunk) => new LangchainDocument({
      pageContent: chunk.content,
      metadata: {
        documentId,
        chunkIndex: chunk.chunkIndex
      }
    }));

    // Create vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    
    // Store in memory cache
    vectorStoreCache.set(documentId, vectorStore);
    
    // Optionally save to disk as JSON for persistence
    const storePath = path.join(VECTOR_STORE_PATH, `${documentId}.json`);
    const data = {
      documents: docs.map(d => ({ pageContent: d.pageContent, metadata: d.metadata }))
    };
    await fs.writeFile(storePath, JSON.stringify(data));

    return documentId;
  } catch (error) {
    throw new Error(`Vector store creation failed: ${error.message}`);
  }
};

/**
 * Load vector store for a user
 */
export const loadVectorStore = async (documentIds) => {
  try {
    const embeddings = getEmbeddings();
    
    if (!documentIds || documentIds.length === 0) {
      throw new Error('No documents available for search');
    }

    // Try to get from cache first
    const firstId = documentIds[0];
    if (vectorStoreCache.has(firstId)) {
      return vectorStoreCache.get(firstId);
    }

    // Load from disk
    const storePath = path.join(VECTOR_STORE_PATH, `${firstId}.json`);
    const data = JSON.parse(await fs.readFile(storePath, 'utf-8'));
    
    const docs = data.documents.map(d => new LangchainDocument({
      pageContent: d.pageContent,
      metadata: d.metadata
    }));

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    vectorStoreCache.set(firstId, vectorStore);
    
    // For multiple documents, merge them
    for (let i = 1; i < documentIds.length; i++) {
      const docId = documentIds[i];
      if (!vectorStoreCache.has(docId)) {
        const docStorePath = path.join(VECTOR_STORE_PATH, `${docId}.json`);
        try {
          const docData = JSON.parse(await fs.readFile(docStorePath, 'utf-8'));
          const moreDocs = docData.documents.map(d => new LangchainDocument({
            pageContent: d.pageContent,
            metadata: d.metadata
          }));
          await vectorStore.addDocuments(moreDocs);
        } catch (error) {
          console.warn(`Failed to load vector store ${docId}:`, error.message);
        }
      }
    }
    
    return vectorStore;
  } catch (error) {
    throw new Error(`Vector store loading failed: ${error.message}`);
  }
};

/**
 * Perform similarity search
 */
export const searchSimilarChunks = async (vectorStore, query, k = 4) => {
  try {
    const results = await vectorStore.similaritySearchWithScore(query, k);
    
    return results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      score: score
    }));
  } catch (error) {
    throw new Error(`Similarity search failed: ${error.message}`);
  }
};

/**
 * Delete vector store for a document
 */
export const deleteVectorStore = async (documentId) => {
  try {
    // Remove from cache
    vectorStoreCache.delete(documentId);
    
    // Delete from disk
    const storePath = path.join(VECTOR_STORE_PATH, `${documentId}.json`);
    await fs.rm(storePath, { force: true });
  } catch (error) {
    console.warn(`Failed to delete vector store ${documentId}:`, error.message);
  }
};
