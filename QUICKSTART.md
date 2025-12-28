# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] MongoDB installed and running
- [ ] OpenAI API key obtained

## 5-Minute Setup

### Step 1: Clone or Download the Project
```bash
cd guigghfyfy
```

### Step 2: Backend Setup (2 minutes)
```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

Start backend:
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 3: Frontend Setup (2 minutes)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 4: Start Using (1 minute)
1. Open browser: http://localhost:5173
2. Click "Sign up" and create an account
3. Upload a document (PDF, DOCX, or TXT)
4. Ask questions about your document!

## Test with Sample Question

After uploading a document, try these questions:
- "What is this document about?"
- "Summarize the main points"
- "What are the key findings?"

## Troubleshooting

### MongoDB not connected?
Start MongoDB:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### OpenAI API Error?
- Verify your API key is correct
- Check you have credits: https://platform.openai.com/account/usage

### Port already in use?
Change ports in:
- Backend: `backend/.env` → `PORT=5001`
- Frontend: `frontend/vite.config.js` → `port: 5174`

## What's Next?

After successful setup:
1. ✅ Upload multiple documents to build knowledge base
2. ✅ Try complex questions across documents
3. ✅ Check conversation history
4. ✅ Test document deletion and re-upload
5. ✅ Explore API endpoints with Postman

## Default Test Credentials
Create your own account - no default credentials needed!

## Need Help?
Check the main [README.md](./README.md) for detailed documentation.
