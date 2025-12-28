import Document from '../models/Document.js';
import { extractText, chunkText, cleanText } from '../services/documentProcessor.js';
import { createVectorStore, deleteVectorStore } from '../services/vectorStore.js';
import path from 'path';
import fs from 'fs/promises';

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { filename, originalname, path: filePath, size } = req.file;
    const fileType = path.extname(originalname).slice(1).toLowerCase();

    // Extract text from document
    const rawText = await extractText(filePath, fileType);
    const textContent = cleanText(rawText);

    if (!textContent || textContent.length < 10) {
      // Delete uploaded file if text extraction failed
      await fs.unlink(filePath);
      return res.status(400).json({
        success: false,
        message: 'Could not extract meaningful text from the document'
      });
    }

    // Chunk the text
    const chunks = chunkText(textContent);

    // Create document record
    const document = await Document.create({
      userId: req.user._id,
      filename,
      originalName: originalname,
      fileType,
      filePath,
      fileSize: size,
      textContent,
      chunks
    });

    // Create vector store
    const vectorStoreId = await createVectorStore(chunks, document._id.toString());
    
    // Update document with vector store ID
    document.vectorStoreId = vectorStoreId;
    await document.save();

    res.status(201).json({
      success: true,
      data: {
        _id: document._id,
        originalName: document.originalName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt,
        chunksCount: chunks.length
      }
    });
  } catch (error) {
    // Clean up uploaded file if processing failed
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    console.error('Document upload error:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message;
    
    if (error.message.includes('rate limit')) {
      errorMessage = 'Hugging Face API rate limit reached. Please wait a moment and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. The document might be too large. Try a smaller file.';
    } else if (error.message.includes('embedding')) {
      errorMessage = 'Failed to generate embeddings. Please try again in a few moments.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-textContent -chunks -filePath')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('-filePath');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    await fs.unlink(document.filePath).catch(() => {});

    // Delete vector store
    await deleteVectorStore(document.vectorStoreId);

    // Delete document from database
    await document.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
