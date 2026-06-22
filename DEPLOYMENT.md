# BudgetWise Deployment Guide

Complete guide for deploying BudgetWise to production.

## Prerequisites
- GitHub account
- Render account (free tier available at render.com)
- Vercel account (free tier available at vercel.com)
- MongoDB Atlas account (free tier available at mongodb.com/cloud/atlas)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Cluster
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project named "BudgetWise"
4. Create a new cluster (select M0 free tier)
5. Choose cloud provider and region (recommend closest to your users)
6. Wait for cluster to be deployed (5-10 minutes)

### 1.2 Create Database User
1. Go to "Database Access" section
2. Click "Add New Database User"
3. Enter username: `budgetwise_user`
4. Enter password: Generate strong password (save this!)
5. Set permissions to "Atlas Admin"
6. Click "Add User"

### 1.3 Get Connection String
1. Go to "Clusters" and click "Connect"
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<database>` with `budgetwise`

Example: `mongodb+srv://budgetwise_user:PASSWORD@cluster0.xxxxx.mongodb.net/budgetwise?retryWrites=true&w=majority`

### 1.4 Whitelist IP Addresses
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Add your machine IP
4. For production: Add `0.0.0.0/0` (accept all IPs)

---

## Step 2: Backend Deployment (Render)

### 2.1 Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2.2 Create Render Service
1. Go to [render.com](https://render.com)
2. Sign up using GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `budgetwise-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render dashboard, go to "Environment" and add:

```
MONGO_URI=mongodb+srv://budgetwise_user:PASSWORD@cluster.xxxxx.mongodb.net/budgetwise?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=production
CLIENT_URL=https://budgetwise.vercel.app
```

For `JWT_SECRET`, generate a random string:
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your service URL (e.g., `https://budgetwise-server.render.com`)

### 2.5 Test Backend
```bash
curl https://budgetwise-server.render.com/
# Should return: {"message":"BudgetWise API running"}
```

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Update Frontend Configuration
Before deploying, update `client/.env.production`:

```
VITE_API_URL=https://budgetwise-server.render.com
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up using GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Set Environment Variables
In Vercel, go to "Settings" → "Environment Variables":

```
VITE_API_URL=https://budgetwise-server.render.com
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment
3. Your app will be at `https://budgetwise.vercel.app` (or custom domain)

---

## Step 4: Configure Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Render Custom Domain
1. Go to Render service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

---

## Step 5: Post-Deployment Testing

### 5.1 Test API Connection
```bash
# Should return API running message
curl https://budgetwise-server.render.com/

# Test auth endpoint
curl -X POST https://budgetwise-server.render.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Register a new account
3. Add some test expenses
4. Verify all features work

### 5.3 Test Deployment
- [ ] Can register and login
- [ ] Can add expenses
- [ ] Can add income
- [ ] Can create budgets
- [ ] Can create goals
- [ ] Dashboard loads correctly
- [ ] Charts display properly
- [ ] Category filters work

---

## Troubleshooting Deployments

### Backend not starting on Render
**Issue**: Build fails with "npm: command not found"
**Solution**: 
- Set Node version in render.yaml or Render dashboard
- Check that `package.json` exists in server directory

### API connection failing
**Issue**: CORS errors or 404 on API calls
**Solution**:
- Verify `CLIENT_URL` is correct in Render environment
- Check CORS is enabled in `server.js`
- Verify API endpoint paths match

### MongoDB connection failing
**Issue**: Connection timeout or authentication error
**Solution**:
- Verify IP whitelist in MongoDB Atlas (should include 0.0.0.0/0 for production)
- Check MONGO_URI format is correct
- Verify database user exists and has correct password

### Frontend not loading API
**Issue**: Network errors or infinite loading
**Solution**:
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend is running on Render
- Test API directly: `curl https://budgetwise-server.render.com/`

### MongoDB Atlas connection issues
```javascript
// Test connection in Node REPL
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error:', err));
```

---

## Monitoring & Maintenance

### Render Monitoring
- Logs: View in Render dashboard under "Logs"
- Metrics: Check CPU, memory, and request rates
- Health: Monitor service status

### Vercel Monitoring  
- Analytics: View in Vercel dashboard
- Deployments: Track deployment history
- Functions: Monitor API routes if using serverless

### MongoDB Monitoring
- Atlas Dashboard: Monitor queries and storage
- Performance Advisor: Get optimization suggestions
- Alerts: Set up automated alerts for issues

---

## Scaling Considerations

### For Higher Traffic
1. **Backend**: Upgrade from free to paid Render instance
2. **Frontend**: Vercel handles scaling automatically
3. **Database**: Upgrade MongoDB Atlas plan
4. **CDN**: Enable Vercel automatic CDN

### Optimization Tips
- Enable compression on Render
- Use database indexes (already configured)
- Implement caching strategies
- Monitor and optimize slow queries

---

## Updating Production

### Deploy Backend Changes
```bash
cd server
git add .
git commit -m "Update message"
git push origin main

# Render auto-deploys from main branch
```

### Deploy Frontend Changes
```bash
cd client
git add .
git commit -m "Update message"
git push origin main

# Vercel auto-deploys from main branch
```

---

## Rolling Back

### If something breaks:

**Backend**:
1. Go to Render dashboard
2. Click "Deployments"
3. Select previous working deployment
4. Click "Redeploy"

**Frontend**:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Select previous working deployment
4. Click "Promote to Production"

---

## Security Checklist

- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] Database password is strong
- [ ] `NODE_ENV` is set to "production"
- [ ] CORS is properly configured
- [ ] Sensitive data is in environment variables, not code
- [ ] HTTPS is enabled (automatic on Render/Vercel)
- [ ] MongoDB IP whitelist is configured
- [ ] Database has regular backups enabled
- [ ] No debug logs in production
- [ ] API keys are rotated regularly

---

## Production Environment Variables

**Render (Server)**:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/budgetwise
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.vercel.app
```

**Vercel (Client)**:
```
VITE_API_URL=https://your-domain.render.com
```

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Express.js Guide](https://expressjs.com/guide/routing.html)
- [React Documentation](https://react.dev)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails | Check build command matches setup |
| No logs visible | Use `tail -f logs` or check Render logs |
| Can't connect to DB | Whitelist IP, check credentials |
| CORS errors | Verify origin in server.js |
| Frontend blank | Check for JS console errors |
| Login always fails | Check JWT_SECRET matches both apps |
| Slow API | Enable query optimization, check indexes |

---

**Your BudgetWise app is now live!**

