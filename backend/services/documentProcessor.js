import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text from uploaded document
 */
export const extractText = async (filePath, fileType) => {
  try {
    switch (fileType) {
      case 'pdf':
        return await extractPdfText(filePath);
      case 'docx':
        return await extractDocxText(filePath);
      case 'txt':
        return await extractTxtText(filePath);
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from PDF
 */
const extractPdfText = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

/**
 * Extract text from DOCX
 */
const extractDocxText = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

/**
 * Extract text from TXT
 */
const extractTxtText = async (filePath) => {
  const text = await fs.readFile(filePath, 'utf-8');
  return text;
};

/**
 * Chunk text into smaller pieces for embedding
 */
export const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    
    chunks.push({
      content: chunk.trim(),
      chunkIndex: chunks.length
    });

    startIndex += chunkSize - overlap;
  }

  return chunks;
};

/**
 * Clean and normalize text
 */
export const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
};
