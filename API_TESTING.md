# API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Testing with cURL / Postman / Thunder Client

### 1. Authentication APIs

#### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Current User Profile
```bash
GET /api/auth/me
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Document APIs

#### Upload Document
```bash
POST /api/documents/upload
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

# Form data:
document: <file.pdf | file.docx | file.txt>

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "originalName": "document.pdf",
    "fileType": "pdf",
    "fileSize": 123456,
    "uploadedAt": "2024-12-15T...",
    "chunksCount": 15
  }
}
```

#### Get All Documents
```bash
GET /api/documents
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "originalName": "document.pdf",
      "fileType": "pdf",
      "fileSize": 123456,
      "uploadedAt": "2024-12-15T..."
    },
    ...
  ]
}
```

#### Get Single Document
```bash
GET /api/documents/:documentId
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "originalName": "document.pdf",
    "fileType": "pdf",
    "fileSize": 123456,
    "textContent": "Full extracted text...",
    "chunks": [...],
    "uploadedAt": "2024-12-15T..."
  }
}
```

#### Delete Document
```bash
DELETE /api/documents/:documentId
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### 3. Chat APIs

#### Send Message (New Conversation)
```bash
POST /api/chat
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "message": "What is this document about?"
}

# Expected Response:
{
  "success": true,
  "data": {
    "conversationId": "uuid-v4",
    "message": {
      "role": "assistant",
      "content": "Based on your documents...",
      "sources": [
        {
          "documentId": "...",
          "documentName": "document.pdf",
          "relevanceScore": 0.85
        }
      ]
    },
    "isNewConversation": true
  }
}
```

#### Send Message (Existing Conversation)
```bash
POST /api/chat
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "message": "Tell me more about that topic",
  "conversationId": "existing-uuid"
}

# Expected Response:
{
  "success": true,
  "data": {
    "conversationId": "existing-uuid",
    "message": {
      "role": "assistant",
      "content": "...",
      "sources": [...]
    },
    "isNewConversation": false
  }
}
```

#### Get All Conversations
```bash
GET /api/chat/conversations
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "conversationId": "...",
      "title": "Document Analysis Questions",
      "createdAt": "2024-12-15T...",
      "updatedAt": "2024-12-15T..."
    },
    ...
  ]
}
```

#### Get Specific Conversation
```bash
GET /api/chat/conversations/:conversationId
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "data": {
    "conversationId": "...",
    "title": "Document Analysis",
    "messages": [
      {
        "role": "user",
        "content": "What is this about?",
        "timestamp": "..."
      },
      {
        "role": "assistant",
        "content": "This document discusses...",
        "sources": [...],
        "timestamp": "..."
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Delete Conversation
```bash
DELETE /api/chat/conversations/:conversationId
Authorization: Bearer <your-token>

# Expected Response:
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Document not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error description here",
  "stack": "..." // Only in development mode
}
```

---

## Testing Workflow

### Complete Test Sequence

1. **Register a new user**
   - POST /api/auth/register
   - Save the token from response

2. **Login** (optional, to test login)
   - POST /api/auth/login
   - Verify token received

3. **Verify authentication**
   - GET /api/auth/me with token

4. **Upload a document**
   - POST /api/documents/upload with file
   - Save document ID

5. **Get all documents**
   - GET /api/documents
   - Verify uploaded document appears

6. **Send first chat message**
   - POST /api/chat with message
   - Save conversationId

7. **Continue conversation**
   - POST /api/chat with message and conversationId

8. **Get conversation history**
   - GET /api/chat/conversations/:conversationId

9. **Get all conversations**
   - GET /api/chat/conversations

10. **Delete document** (optional)
    - DELETE /api/documents/:documentId

11. **Delete conversation** (optional)
    - DELETE /api/chat/conversations/:conversationId

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All /api/* endpoints
- **Response**: 429 status with error message

Test rate limiting:
```bash
# Send 101 requests rapidly to trigger rate limit
for i in {1..101}; do
  curl http://localhost:5000/api/auth/me
done
```

---

## Sample Test Document

Create a test text file:

```text
# sample-document.txt

Project Overview:
This is a sample document for testing the RAG AI Chatbot.
The system uses Retrieval-Augmented Generation to answer questions.

Key Features:
- Document upload support
- Semantic search
- Context-aware responses
- Source attribution

Technical Stack:
- Backend: Node.js with Express
- Frontend: React with Tailwind
- AI: OpenAI GPT-3.5 Turbo
- Vector Database: FAISS
```

Test questions for this document:
- "What is this project about?"
- "What are the key features?"
- "What technology stack is used?"
- "What AI model is used?"

---

## Postman Collection

Import this JSON to Postman:

```json
{
  "info": {
    "name": "RAG Chatbot API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Automated Testing Script

```javascript
// test-api.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function testAPI() {
  try {
    // 1. Register
    const register = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    token = register.data.data.token;
    console.log('✅ Registration successful');

    // 2. Get profile
    await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get profile successful');

    // 3. Get documents
    const docs = await axios.get(`${BASE_URL}/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Get documents successful (${docs.data.count} documents)`);

    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
```

Run: `node test-api.js`

---

**Happy Testing! 🧪**
