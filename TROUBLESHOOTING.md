# Troubleshooting Guide

## Common Issues and Solutions

---

## Backend Issues

### 1. MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
- **Windows**: 
  ```bash
  net start MongoDB
  ```
- **Mac/Linux**: 
  ```bash
  sudo systemctl start mongod
  # or
  brew services start mongodb-community
  ```
- **Check if MongoDB is running**:
  ```bash
  # Windows
  tasklist | findstr mongod
  
  # Mac/Linux
  ps aux | grep mongod
  ```
- **Verify connection string** in `.env`:
  ```env
  MONGODB_URI=mongodb://localhost:27017/rag-chatbot
  ```

### 2. OpenAI API Error

**Error**: `401 Incorrect API key provided`

**Solutions**:
- Verify API key in `backend/.env`:
  ```env
  OPENAI_API_KEY=sk-...
  ```
- Check API key at: https://platform.openai.com/api-keys
- Ensure you have credits: https://platform.openai.com/account/usage
- Test API key with curl:
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```

**Error**: `429 Rate limit reached`

**Solutions**:
- Check usage limits on OpenAI dashboard
- Consider upgrading your OpenAI plan
- Implement request queuing/caching

### 3. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
- Change port in `backend/.env`:
  ```env
  PORT=5001
  ```
- Kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### 4. Module Not Found

**Error**: `Cannot find module 'express'`

**Solutions**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 5. FAISS Installation Error

**Error**: `node-gyp build failed`

**Solutions**:
- Install build tools:
  ```bash
  # Windows
  npm install --global windows-build-tools
  
  # Mac
  xcode-select --install
  
  # Linux
  sudo apt-get install build-essential
  ```
- Alternative: Use Pinecone instead of FAISS (modify vector store service)

---

## Frontend Issues

### 1. CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Verify `FRONTEND_URL` in `backend/.env`:
  ```env
  FRONTEND_URL=http://localhost:5173
  ```
- Check backend is running on correct port
- Clear browser cache and cookies
- Try in incognito mode

### 2. Authentication Token Issues

**Error**: `401 Not authorized, token failed`

**Solutions**:
- Clear localStorage:
  ```javascript
  // In browser console
  localStorage.clear();
  ```
- Re-login to get fresh token
- Check token in browser DevTools → Application → Local Storage
- Verify `JWT_SECRET` is same in backend `.env`

### 3. Vite Build Error

**Error**: `Failed to resolve import`

**Solutions**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 4. Tailwind Styles Not Working

**Solutions**:
- Verify `tailwind.config.js` exists
- Check `postcss.config.js` exists
- Restart dev server:
  ```bash
  npm run dev
  ```
- Clear browser cache (Ctrl+Shift+R)

### 5. Blank Page / White Screen

**Solutions**:
- Check browser console for errors (F12)
- Verify backend is running
- Check API URL in browser DevTools → Network tab
- Verify `vite.config.js` proxy settings:
  ```javascript
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
  ```

---

## Document Upload Issues

### 1. File Upload Fails

**Error**: `Invalid file type` or `File too large`

**Solutions**:
- **Supported formats**: PDF, DOCX, TXT only
- **Max size**: 10MB
- **Check file**:
  ```bash
  # Windows
  dir filename.pdf
  
  # Mac/Linux
  ls -lh filename.pdf
  ```
- Reduce file size or convert format

### 2. Text Extraction Fails

**Error**: `Could not extract meaningful text`

**Solutions**:
- Ensure PDF is not image-based (needs OCR)
- Try converting DOCX to TXT
- Verify file is not corrupted
- Check file has actual text content

### 3. Upload Permission Error

**Error**: `EACCES: permission denied`

**Solutions**:
```bash
cd backend
mkdir uploads
chmod 755 uploads  # Mac/Linux
```

---

## RAG / Chat Issues

### 1. No Answer Generated

**Error**: `I don't have any documents to reference`

**Solutions**:
- Upload at least one document first
- Wait for document processing to complete
- Check document was uploaded successfully:
  ```bash
  curl -H "Authorization: Bearer <token>" \
       http://localhost:5000/api/documents
  ```

### 2. Poor Quality Answers

**Solutions**:
- Upload more relevant documents
- Ask more specific questions
- Ensure documents contain related information
- Try rephrasing the question
- Check document text was extracted properly

### 3. Vector Store Error

**Error**: `Vector store loading failed`

**Solutions**:
- Delete and re-upload document
- Check `vector_store/` directory exists
- Verify disk space available
- Restart backend server

---

## Database Issues

### 1. Duplicate Key Error

**Error**: `E11000 duplicate key error`

**Solutions**:
- User with email already exists - use different email
- Clear MongoDB collection:
  ```javascript
  // In MongoDB shell
  use rag-chatbot
  db.users.deleteOne({ email: "duplicate@email.com" })
  ```

### 2. Connection Timeout

**Solutions**:
- Check MongoDB is running
- Increase timeout in connection string:
  ```env
  MONGODB_URI=mongodb://localhost:27017/rag-chatbot?serverSelectionTimeoutMS=5000
  ```

---

## Performance Issues

### 1. Slow Response Time

**Solutions**:
- **Large documents**: 
  - Reduce chunk size in `documentProcessor.js`
  - Upload smaller documents
- **Many documents**: 
  - Limit vector search results (reduce k value)
  - Implement caching
- **OpenAI API**: 
  - Use faster models (gpt-3.5-turbo-instruct)
  - Reduce context length

### 2. High Memory Usage

**Solutions**:
- Limit concurrent document uploads
- Clear old conversations periodically
- Use pagination for document lists
- Optimize chunk storage

---

## Development Issues

### 1. Hot Reload Not Working

**Solutions**:
```bash
# Backend
npm install -D nodemon
npm run dev

# Frontend
rm -rf node_modules/.vite
npm run dev
```

### 2. Environment Variables Not Loading

**Solutions**:
- Verify `.env` file exists (not `.env.example`)
- Restart dev server after changing `.env`
- Check file is in correct directory:
  - Backend: `backend/.env`
  - Frontend: `frontend/.env`
- Ensure no spaces around `=`:
  ```env
  # Wrong
  PORT = 5000
  
  # Correct
  PORT=5000
  ```

---

## Testing Issues

### 1. API Tests Fail

**Solutions**:
- Ensure both frontend and backend are running
- Check ports match (5173 and 5000)
- Verify MongoDB is connected
- Check OpenAI API key is valid
- Review API endpoint URLs

### 2. Postman/cURL Authentication

**Solutions**:
```bash
# Get token first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Use token
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/documents
```

---

## Deployment Issues

### 1. Environment Variables Missing

**Solutions**:
- Set all required variables in hosting platform
- Don't commit `.env` files to Git
- Use platform-specific variable management:
  - **Vercel**: Environment Variables in dashboard
  - **Render**: Environment section
  - **Heroku**: Config Vars

### 2. Build Fails

**Frontend Build Error**:
```bash
# Check build locally first
npm run build

# Fix any errors shown
```

**Backend Deployment**:
- Ensure `package.json` has correct start script
- Set `NODE_ENV=production`
- Use production MongoDB URI

---

## Getting Help

If issues persist:

1. **Check logs**:
   ```bash
   # Backend logs
   cd backend
   npm run dev  # Watch console output
   
   # Frontend logs
   cd frontend
   npm run dev  # Watch console output
   ```

2. **Enable debug mode**:
   ```env
   # backend/.env
   NODE_ENV=development
   ```

3. **Test with sample data**:
   - Create new user
   - Upload simple .txt file
   - Ask basic question

4. **Review documentation**:
   - [README.md](./README.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [API_TESTING.md](./API_TESTING.md)

5. **Check dependencies**:
   ```bash
   # Backend
   cd backend
   npm list
   
   # Frontend
   cd frontend
   npm list
   ```

---

## Still Stuck?

Create a GitHub issue with:
- Error message (full stack trace)
- Steps to reproduce
- Environment (OS, Node version, MongoDB version)
- Logs from console

---

**Remember**: Most issues are related to:
1. ✅ MongoDB not running
2. ✅ Missing/incorrect environment variables
3. ✅ Invalid OpenAI API key
4. ✅ Port conflicts

Check these first! 🔍
