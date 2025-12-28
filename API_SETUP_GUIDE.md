# 🚀 API Setup Guide - Multi-Provider Support

Your RAG Chatbot now supports **3 different LLM providers**! Choose the one that fits your needs.

---

## 📋 Quick Summary

| Provider | Cost | Speed | Quality | Best For |
|----------|------|-------|---------|----------|
| **OpenAI** | Paid | Fast | ⭐⭐⭐⭐⭐ | Production |
| **Groq** | FREE | ⚡ Super Fast | ⭐⭐⭐⭐ | Development/Testing |
| **Together AI** | Free Credits | Fast | ⭐⭐⭐⭐ | Trial/Testing |

---

## 🎯 Option 1: OpenAI (Recommended for Production)

### **Why Choose OpenAI:**
- ✅ Most reliable and stable
- ✅ Best answer quality
- ✅ Fast (2-5 seconds)
- ✅ Industry standard
- ✅ Best documentation

### **Cost:**
- Very affordable: ~$0.001 per question
- $5 credit = thousands of questions
- Pay only for what you use

### **Setup Steps:**

1. **Get API Key:**
   - Go to: https://platform.openai.com/signup
   - Sign up (email + password)
   - Add payment method ($5 minimum)
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)

2. **Update .env File:**
   ```env
   LLM_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-api-key-here
   EMBEDDING_MODEL=text-embedding-3-small
   CHAT_MODEL=gpt-3.5-turbo
   ```

3. **Done!** Restart the backend server.

---

## ⚡ Option 2: Groq (FREE & Fast)

### **Why Choose Groq:**
- ✅ **Completely FREE**
- ✅ **VERY fast** (under 1 second!)
- ✅ Good quality answers
- ✅ No credit card needed
- ✅ Perfect for testing

### **Limitations:**
- Rate limits on free tier (30 requests/minute)
- No embedding model (uses OpenAI for embeddings)

### **Setup Steps:**

1. **Get API Key:**
   - Go to: https://console.groq.com
   - Sign up with email
   - Go to: https://console.groq.com/keys
   - Click "Create API Key"
   - Copy the key (starts with `gsk_...`)

2. **Update .env File:**
   ```env
   LLM_PROVIDER=groq
   GROQ_API_KEY=gsk-your-actual-api-key-here
   OPENAI_API_KEY=sk-your-openai-key-for-embeddings
   CHAT_MODEL=llama3-8b-8192
   ```

   **Note:** Groq uses OpenAI for embeddings, so you need BOTH keys.

3. **Done!** Restart the backend server.

---

## 💎 Option 3: Together AI (Free Credits)

### **Why Choose Together AI:**
- ✅ $25 free credits (no credit card)
- ✅ Fast performance
- ✅ Good quality
- ✅ Many model options

### **Setup Steps:**

1. **Get API Key:**
   - Go to: https://together.ai
   - Sign up (email)
   - Go to: https://api.together.xyz/settings/api-keys
   - Create API key
   - Copy the key

2. **Update .env File:**
   ```env
   LLM_PROVIDER=together
   TOGETHER_API_KEY=your-together-api-key-here
   EMBEDDING_MODEL=togethercomputer/m2-bert-80M-8k-retrieval
   CHAT_MODEL=mistralai/Mixtral-8x7B-Instruct-v0.1
   ```

3. **Done!** Restart the backend server.

---

## 🔄 Switching Between Providers

To switch providers, just change the `.env` file:

```env
# Use OpenAI
LLM_PROVIDER=openai

# OR use Groq
LLM_PROVIDER=groq

# OR use Together AI
LLM_PROVIDER=together
```

Then restart your backend server!

---

## 📝 Complete .env Example

Here's a complete `.env` file with all three providers configured:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rag-chatbot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# LLM Provider Configuration
# Choose one: openai, groq, or together
LLM_PROVIDER=openai

# API Keys (add the ones you're using)
OPENAI_API_KEY=sk-your-openai-key-here
GROQ_API_KEY=gsk-your-groq-key-here
TOGETHER_API_KEY=your-together-key-here

# Model Configuration
EMBEDDING_MODEL=text-embedding-3-small
CHAT_MODEL=gpt-3.5-turbo
```

---

## 🧪 Testing Your Setup

After configuring your API key, test it:

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check Terminal:**
   You should see:
   ```
   📊 Using openai for embeddings (model: text-embedding-3-small)
   🤖 Using openai for chat (model: gpt-3.5-turbo)
   ```

3. **Upload a Document:**
   - Should work without errors
   - Check terminal for progress

4. **Ask a Question:**
   - Should get fast response
   - Answer based on your document

---

## ❌ Troubleshooting

### **"Missing API key" Error**
- Check your `.env` file
- Make sure the key is on the correct line
- No spaces around the `=`
- Restart the server after changes

### **"Unauthorized" Error**
- API key is invalid or expired
- Check you copied the full key
- Try creating a new key

### **"Rate limit" Error**
- **OpenAI:** Check your usage/billing
- **Groq:** Wait 1 minute (30 req/min limit)
- **Together AI:** Check your credits

### **Groq + Embeddings Error**
- Groq needs OpenAI for embeddings
- Make sure you set `OPENAI_API_KEY` too

---

## 💰 Cost Comparison

### **For 1000 Questions:**

| Provider | Upload Cost | Chat Cost | Total |
|----------|-------------|-----------|-------|
| **OpenAI** | ~$0.50 | ~$1.00 | ~$1.50 |
| **Groq** | $0 (uses OpenAI embeddings: ~$0.50) | $0 | ~$0.50 |
| **Together AI** | ~$0.30 | ~$0.50 | ~$0.80 |

**Recommendation:** Start with Groq (free), move to OpenAI for production.

---

## 🎯 My Recommendation

### **For Learning/Testing:**
Use **Groq**:
1. Free forever
2. Super fast (great for development)
3. No credit card needed

### **For Production:**
Use **OpenAI**:
1. Most reliable
2. Best quality
3. Worth the small cost

### **For Trial Run:**
Use **Together AI**:
1. $25 free credit
2. No credit card initially
3. Good middle ground

---

## 📌 Next Steps

1. **Choose your provider** (I recommend starting with Groq)
2. **Get the API key** (takes 2 minutes)
3. **Update `.env` file**
4. **Restart backend**
5. **Test upload and chat**
6. **It works!** 🎉

---

## 🆘 Need Help?

If you're stuck:

1. Share which provider you chose
2. Copy the error message from terminal
3. I'll help you fix it immediately!

---

**Ready to get started?** Pick a provider and let's get your API key! 🚀
