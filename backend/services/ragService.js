import { getChatModel } from '../utils/llmProvider.js';
import { loadVectorStore, searchSimilarChunks } from './vectorStore.js';
import Document from '../models/Document.js';

/**
 * Generate answer using RAG
 */
export const generateAnswer = async (userId, query) => {
  try {
    // Get user's documents
    const documents = await Document.find({ userId });
    
    if (!documents || documents.length === 0) {
      return {
        answer: "I don't have any documents to reference. Please upload some documents first so I can answer your questions based on them.",
        sources: []
      };
    }

    const documentIds = documents.map(doc => doc.vectorStoreId);
    
    // Load vector store
    const vectorStore = await loadVectorStore(documentIds);
    
    // Search for relevant chunks
    const relevantChunks = await searchSimilarChunks(vectorStore, query, 4);
    
    if (relevantChunks.length === 0) {
      return {
        answer: "I couldn't find relevant information in your documents to answer this question.",
        sources: []
      };
    }

    // Prepare context from relevant chunks
    const context = relevantChunks
      .map((chunk, idx) => `[${idx + 1}] ${chunk.content}`)
      .join('\n\n');

    // Create prompt for LLM
    const prompt = `You are a helpful AI assistant. Answer the user's question based STRICTLY on the provided context from their documents. 
If the answer cannot be found in the context, say "I don't have enough information in the uploaded documents to answer this question."

Context from documents:
${context}

User Question: ${query}

Instructions:
- Answer based only on the provided context
- Be concise and accurate
- If you reference specific information, mention which source [number] it came from
- Do not make up information not present in the context

Answer:`;

    // Generate answer using LLM
    const model = getChatModel();
    const response = await model.invoke(prompt);
    
    // Extract answer text (OpenAI format)
    const answerText = typeof response === 'string' ? response : response.content || response.text || String(response);
    
    // Extract source documents
    const sources = relevantChunks.map(chunk => {
      const doc = documents.find(d => d.vectorStoreId === chunk.metadata.documentId);
      return {
        documentId: doc?._id,
        documentName: doc?.originalName,
        relevanceScore: chunk.score
      };
    });

    // Remove duplicates from sources
    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex((s) => s.documentId?.toString() === source.documentId?.toString())
    );

    return {
      answer: answerText.trim(),
      sources: uniqueSources
    };
  } catch (error) {
    console.error('RAG Service Error:', error);
    // More descriptive error message
    if (error.message.includes('API key')) {
      throw new Error('Configuration error: Invalid API key. Please check your LLM provider configuration.');
    } else if (error.message.includes('quota')) {
      throw new Error('Service error: API quota exceeded. Please try again later.');
    } else if (error.message.includes('rate limit')) {
      throw new Error('Service error: Rate limit exceeded. Please wait a moment and try again.');
    } else {
      throw new Error(`Answer generation failed: ${error.message}`);
    }
  }
};

/**
 * Generate conversation title based on first message
 */
export const generateConversationTitle = async (firstMessage) => {
  try {
    const model = getChatModel();
    
    const prompt = `Generate a short, concise title (max 6 words) for a conversation that starts with this question: "${firstMessage}"
    
Return only the title, nothing else.`;

    const response = await model.invoke(prompt);
    const titleText = typeof response === 'string' ? response : response.text || response.content || String(response);
    return titleText.replace(/['"`]/g, '').trim();
  } catch (error) {
    return 'New Conversation';
  }
};
