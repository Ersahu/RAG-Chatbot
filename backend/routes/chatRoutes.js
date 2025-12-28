import express from 'express';
import { 
  sendMessage, 
  getConversations, 
  getConversation, 
  deleteConversation 
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId', protect, getConversation);
router.delete('/conversations/:conversationId', protect, deleteConversation);

export default router;
