# RAG AI Chatbot - Architecture Documentation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                        (React + Tailwind)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Login   │  │ Register │  │   Chat   │  │Documents │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│                    (Express.js + Middleware)                    │
│  ┌────────────┐  ┌──────────┐  ┌────────────┐                 │
│  │Rate Limiter│  │   CORS   │  │   Helmet   │                 │
│  └────────────┘  └──────────┘  └────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Auth Routes     │ │   Document   │ │   Chat Routes    │
│                  │ │    Routes    │ │                  │
│ • Register       │ │ • Upload     │ │ • Send Message   │
│ • Login          │ │ • List       │ │ • Get History    │
│ • Get Profile    │ │ • Delete     │ │ • Delete Conv    │
└──────────────────┘ └──────────────┘ └──────────────────┘
            │                 │                 │
            ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                         │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Auth Controller│  │Doc Controller│  │Chat Controller│          │
│  └───────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Document        │ │   Vector     │ │   RAG Service    │
│  Processor       │ │   Store      │ │                  │
│                  │ │  Service     │ │ • Semantic       │
│ • Text Extract   │ │              │ │   Search         │
│ • Chunking       │ │ • Create     │ │ • Context        │
│ • Cleaning       │ │ • Load       │ │   Building       │
│                  │ │ • Search     │ │ • LLM Generation │
└──────────────────┘ └──────────────┘ └──────────────────┘
            │                 │                 │
            │                 ▼                 │
            │      ┌──────────────────┐        │
            │      │   FAISS Vector   │        │
            │      │      Store       │        │
            │      │  (Embeddings)    │        │
            │      └──────────────────┘        │
            │                                   │
            └───────────────┬───────────────────┘
                            ▼
            ┌───────────────────────────────────┐
            │        EXTERNAL SERVICES          │
            │                                   │
            │  ┌──────────────┐                │
            │  │  OpenAI API  │                │
            │  │              │                │
            │  │ • Embeddings │                │
            │  │ • GPT-3.5    │                │
            │  └──────────────┘                │
            └───────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────────┐
            │       DATA PERSISTENCE            │
            │                                   │
            │  ┌─────────────────┐             │
            │  │   MongoDB       │             │
            │  │                 │             │
            │  │ • Users         │             │
            │  │ • Documents     │             │
            │  │ • ChatHistory   │             │
            │  └─────────────────┘             │
            └───────────────────────────────────┘
```

## RAG Pipeline Flow

```
┌──────────────┐
│ User uploads │
│  Document    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Extract Text         │
│ (PDF/DOCX/TXT)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Clean & Normalize    │
│ Text Content         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Chunk Text           │
│ (1000 chars, 200     │
│  overlap)            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Generate Embeddings  │
│ (OpenAI API)         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Store in FAISS       │
│ Vector Database      │
└──────────────────────┘


USER QUERY FLOW:

┌──────────────┐
│ User asks    │
│  Question    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Load User's Vector   │
│ Stores               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Semantic Search      │
│ (Top 4 chunks)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Build Context from   │
│ Retrieved Chunks     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Create Prompt with   │
│ Context + Question   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ LLM Generation       │
│ (GPT-3.5-turbo)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Return Answer +      │
│ Source Documents     │
└──────────────────────┘
```

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Document Schema
```javascript
{
  userId: ObjectId,
  filename: String,
  originalName: String,
  fileType: String,
  filePath: String,
  fileSize: Number,
  textContent: String,
  chunks: [{
    content: String,
    chunkIndex: Number
  }],
  vectorStoreId: String,
  uploadedAt: Date
}
```

### ChatHistory Schema
```javascript
{
  userId: ObjectId,
  conversationId: String (UUID),
  title: String,
  messages: [{
    role: String (user/assistant),
    content: String,
    sources: [{
      documentId: ObjectId,
      documentName: String,
      relevanceScore: Number
    }],
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Security Measures

1. **Authentication**: JWT tokens with 30-day expiration
2. **Password Security**: bcrypt hashing with salt rounds
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: Server-side validation on all endpoints
5. **File Upload**: Type and size restrictions (10MB max)
6. **CORS**: Configured for specific frontend origin
7. **Helmet**: Security headers protection
8. **API Keys**: Environment variable storage

## Performance Considerations

- **Chunking Strategy**: Balances context preservation and retrieval accuracy
- **Vector Search**: K=4 optimal for most queries
- **Embedding Model**: text-embedding-3-small for speed and quality
- **Database Indexing**: userId and conversationId indexed
- **Caching**: Can be added for frequent queries
- **File Storage**: Local storage (can be upgraded to S3/Cloud Storage)
