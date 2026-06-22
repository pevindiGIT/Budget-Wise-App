# BudgetWise — Quick Start (MongoDB Compass)

Get the app running locally in under 5 minutes.

---

## Prerequisites
- **Node.js 16+** — [nodejs.org](https://nodejs.org)
- **MongoDB** (Community Edition) — [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (GUI) — [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

---

## Step 1 — Start MongoDB (one-time setup)

1. Install **MongoDB Community Edition** if you haven't already.
2. Start the MongoDB service:
   - **Windows**: Open Services → find `MongoDB` → Start
   - **Or run in terminal**: `net start MongoDB`
3. Open **MongoDB Compass** and connect to:
   ```
   mongodb://127.0.0.1:27017
   ```
4. The `budgetwise` database will be **created automatically** when the app first runs — you don't need to create it manually.

---

## Step 2 — Backend setup

```bash
cd server
```

Create your `.env` file (copy the example):
```bash
# Copy manually or create a new file named .env with this content:
MONGO_URI=mongodb://127.0.0.1:27017/budgetwise
JWT_SECRET=budgetwise_super_secret_key_change_in_production_2026
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Install dependencies and start:
```bash
npm install
npm run dev
```

You should see:
```
MongoDB connected → mongodb://127.0.0.1:27017/budgetwise
Server running → http://localhost:5000
```

---

## Step 3 — Frontend setup

Open a **second terminal**:
```bash
cd client
npm install
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms
  Local: http://localhost:5173/
```

> **Note:** The Vite proxy is already configured — no `.env` file needed for the frontend in development.

---

## Step 4 — Open the app

Visit **http://localhost:5173** in your browser.

1. **Register** a new account (username + email + password)
2. **Login** with your credentials
3. Start tracking your finances!

---

## Verify in MongoDB Compass

After registering and adding some data:
1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. You'll see the **budgetwise** database with these collections:
   - `users`
   - `expenses`
   - `incomes`
   - `budgets`
   - `goals`

---

## Useful commands

**Backend**
```bash
npm run dev    # development (auto-reload on save)
npm start      # production mode
```

**Frontend**
```bash
npm run dev    # development server with hot reload
npm run build  # production build → dist/
npm run lint   # check for code issues
```

---

## Troubleshooting

### "MongoDB connection failed"
- Check MongoDB service is running: `net start MongoDB` (Windows)
- Or start via MongoDB Compass — connect to `127.0.0.1:27017`
- The connection string should be exactly: `mongodb://127.0.0.1:27017/budgetwise`

### "Port 5000 already in use"
```bash
# Windows — find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### API calls returning 404 / network error
- Confirm the backend is running on port 5000
- The Vite proxy forwards `/api/*` → `http://localhost:5000` automatically

### Blank page or styles not loading
- Run `npm install` in the `client` folder
- Check browser console (F12) for errors

---

**Happy budgeting!**
