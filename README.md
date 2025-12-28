# RAG AI Chatbot - Production-Ready Application

A full-stack AI chatbot application using Retrieval-Augmented Generation (RAG) that allows users to upload documents and ask questions based on their content.

## Features

- **User Authentication**: Secure login and signup with JWT
- **Document Management**: Upload PDF, DOCX, and TXT files
- **Text Processing**: Automatic text extraction and intelligent chunking
- **Vector Embeddings**: OpenAI embeddings with FAISS vector storage
- **RAG Pipeline**: Context-aware answers using semantic search + LLM
- **Chat History**: Persistent conversation storage
- **Source References**: Answers include document sources
- **Responsive UI**: Modern, mobile-friendly interface
- **Security**: Rate limiting, input validation, API key protection

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI/LLM**: OpenAI API (GPT-3.5 Turbo)
- **RAG Framework**: LangChain JS
- **Vector Database**: FAISS
- **Document Processing**: pdf-parse, mammoth
- **Security**: Helmet, express-rate-limit

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │────────>│   Express    │────────>│   MongoDB   │
│  Frontend   │<────────│   Backend    │<────────│  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               ├──────────> OpenAI API (Embeddings + LLM)
                               │
                               └──────────> FAISS Vector Store
```

### Data Flow

1. **Document Upload**: User uploads → Text extraction → Chunking → Embedding generation → Vector storage
2. **Chat Query**: User question → Vector similarity search → Context retrieval → LLM generation → Answer with sources

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rag-chatbot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage Guide

### 1. Create an Account
- Navigate to the registration page
- Enter your name, email, and password
- Click "Create Account"

### 2. Upload Documents
- Click on "Documents" in the sidebar
- Click "Upload Document"
- Select a PDF, DOCX, or TXT file (max 10MB)
- Wait for processing to complete

### 3. Ask Questions
- Type your question in the chat input
- The AI will search through your documents
- Receive accurate answers with source references
- Continue the conversation with follow-up questions

### 4. Manage Documents
- View all uploaded documents in the sidebar
- Delete documents you no longer need
- Upload multiple documents for comprehensive knowledge base

## API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**GET** `/api/auth/me` (Protected)
- Returns current user information

### Document Endpoints

**POST** `/api/documents/upload` (Protected)
- Upload: Form-data with `document` field

**GET** `/api/documents` (Protected)
- Get all user documents

**GET** `/api/documents/:id` (Protected)
- Get single document

**DELETE** `/api/documents/:id` (Protected)
- Delete document

### Chat Endpoints

**POST** `/api/chat` (Protected)
```json
{
  "message": "What is the main topic of my documents?",
  "conversationId": "optional-conversation-id"
}
```

**GET** `/api/chat/conversations` (Protected)
- Get all conversations

**GET** `/api/chat/conversations/:conversationId` (Protected)
- Get specific conversation

**DELETE** `/api/chat/conversations/:conversationId` (Protected)
- Delete conversation

## Deployment

### Backend Deployment (Render/AWS)

1. Set environment variables in your hosting platform
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend Deployment (Vercel)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers protection
- **Input Validation**: Server-side validation
- **CORS**: Configured cross-origin resource sharing
- **File Upload Limits**: Max 10MB file size
- **API Key Protection**: Environment variable storage

## Performance Optimizations

- **Text Chunking**: 1000 characters with 200 character overlap
- **Vector Search**: Top 4 most relevant chunks
- **Efficient Embeddings**: OpenAI text-embedding-3-small model
- **Database Indexing**: Optimized MongoDB queries
- **Lazy Loading**: Documents loaded on demand

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`

**OpenAI API Error**
- Verify API key is valid
- Check API quota and billing

**File Upload Error**
- Check file size (max 10MB)
- Verify file type (PDF, DOCX, TXT only)

### Frontend Issues

**CORS Error**
- Ensure backend FRONTEND_URL matches frontend URL
- Check proxy configuration in vite.config.js

**Authentication Error**
- Clear localStorage and try logging in again
- Check JWT_SECRET is consistent

## Project Structure

```
rag-chatbot/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, upload, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (RAG, vector store)
│   ├── utils/           # Helper functions
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── context/     # Auth context provider
│   │   ├── pages/       # Login, Register, Chat
│   │   ├── utils/       # API client
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # React entry point
│   └── index.html
│
└── README.md
```

## Future Enhancements

- [ ] Support for more file types (CSV, JSON, Markdown)
- [ ] Multi-language support
- [ ] Conversation export
- [ ] Advanced search filters
- [ ] Document preview
- [ ] Team collaboration features
- [ ] Custom LLM model selection
- [ ] Voice input/output

## 🤝 Contributions
We welcome pull requests! For major changes, please open an issue to discuss what you'd like to improve or add.

## 📧 Contact
**Developer**: Vaibhav

**Email**: sahuvaibhav064@gmail.com

**LinkedIn**: https://www.linkedin.com/in/vaibhav-chaudhary-615712272/

## 📜 License
MIT License © 2025 Vaibhav
