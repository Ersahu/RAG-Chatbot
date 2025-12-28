import ChatHistory from '../models/ChatHistory.js';
import { generateAnswer, generateConversationTitle } from '../services/ragService.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Send chat message
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let conversation;
    let isNewConversation = false;

    // Check if conversation exists
    if (conversationId) {
      conversation = await ChatHistory.findOne({
        conversationId,
        userId: req.user._id
      });
    }

    // Create new conversation if doesn't exist
    if (!conversation) {
      const newConversationId = uuidv4();
      const title = await generateConversationTitle(message);
      
      conversation = await ChatHistory.create({
        userId: req.user._id,
        conversationId: newConversationId,
        title,
        messages: []
      });
      
      isNewConversation = true;
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Generate AI response using RAG
    const { answer, sources } = await generateAnswer(req.user._id, message);

    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: answer,
      sources
    });

    await conversation.save();

    res.json({
      success: true,
      data: {
        conversationId: conversation.conversationId,
        message: {
          role: 'assistant',
          content: answer,
          sources
        },
        isNewConversation
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    console.error('Error stack:', error.stack);
    
    // More specific error handling
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.message.includes('API key')) {
      errorMessage = 'Configuration error: Invalid API key. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      errorMessage = 'Service error: API quota exceeded. Please try again later.';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Service error: Rate limit exceeded. Please wait a moment and try again.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// @desc    Get all conversations
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await ChatHistory.find({ userId: req.user._id })
      .select('conversationId title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get conversation by ID
// @route   GET /api/chat/conversations/:conversationId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const conversation = await ChatHistory.findOne({
      conversationId: req.params.conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/chat/conversations/:conversationId
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await ChatHistory.findOne({
      conversationId: req.params.conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await conversation.deleteOne();

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
