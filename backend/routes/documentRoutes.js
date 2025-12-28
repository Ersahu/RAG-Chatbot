import express from 'express';
import { 
  uploadDocument, 
  getDocuments, 
  getDocument, 
  deleteDocument 
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.delete('/:id', protect, deleteDocument);

export default router;
