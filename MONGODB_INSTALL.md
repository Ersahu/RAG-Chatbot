# MongoDB Installation Guide for Windows

## Option 1: Manual Installation (Recommended)

### Step 1: Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 8.0.4 (Current)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. Keep default settings
5. Uncheck "Install MongoDB Compass" (optional GUI tool)
6. Click "Install"

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see MongoDB version information.

### Step 4: Start MongoDB Service
```powershell
# Start MongoDB
net start MongoDB

# Verify it's running
Get-Service MongoDB
```

---

## Option 2: Using Chocolatey (If Installed)

If you have Chocolatey package manager:
```powershell
choco install mongodb
```

---

## Option 3: MongoDB Atlas (Cloud - No Installation)

**Easiest and fastest option:**

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create FREE M0 cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rag-chatbot?retryWrites=true&w=majority
   ```

---

## After Installation

### Test Connection
1. Make sure MongoDB is running
2. Navigate to backend:
   ```powershell
   cd c:\Users\royal\OneDrive\Desktop\guigghfyfy\backend
   ```
3. Start the server:
   ```powershell
   npm run dev
   ```

### Expected Output
```
MongoDB Connected: localhost:27017
Server running in development mode on port 5000
```

---

## Troubleshooting

### MongoDB Service Not Starting
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

### Can't Find MongoDB Command
- Add MongoDB to PATH:
  - Search "Environment Variables" in Windows
  - Edit System PATH
  - Add: `C:\Program Files\MongoDB\Server\8.0\bin`
  - Restart PowerShell

---

## Quick Status Check

Check if MongoDB is installed:
```powershell
Get-Service MongoDB
```

Check if it's running:
```powershell
Get-Process mongod
```

Start MongoDB:
```powershell
net start MongoDB
```
