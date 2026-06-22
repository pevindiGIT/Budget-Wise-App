# BudgetWise - Smart Expense & Budget Tracker

A modern, full-stack web application for tracking expenses, managing budgets, and achieving savings goals with analytics and insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

## Features

### Dashboard
- Real-time financial overview
- Total income, expenses, and balance display
- Category-based spending breakdown with pie charts
- Monthly summary views
- Color-coded financial indicators

### Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Education, Entertainment, Bills, Health, Shopping, Other)
- Search and filter by category or month
- Detailed expense history with notes
- Real-time total calculations

### Income Tracking
- Record multiple income sources
- Track salary, freelance work, investments, etc.
- Monthly income summaries
- Search and filter capabilities
- Full CRUD operations

### Budget Planning
- Set monthly budgets per category
- Visual progress bars showing spending vs. budget
- Real-time usage tracking
- Color-coded alerts (safe, warning, exceeded)
- Flexible budget updates

### Savings Goals
- Create multiple savings goals
- Track progress toward targets
- Set deadline dates
- Visual progress indicators
- Quick goal updates with Enter key

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcryptjs
- Protected routes and endpoints
- Session persistence

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **Vite** - Development server & bundler
- **Tailwind CSS 3** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **JavaScript (ES6+)**

### Backend
- **Node.js** - Runtime
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Tools & Services
- **MongoDB Compass** - Local database (development)
- **Vite** - Build tool
- **Nodemon** - Development auto-reload

---

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB (Community Edition)
- MongoDB Compass (GUI)

### Backend Setup

1. Navigate to server directory
```bash
cd server
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```
MONGO_URI=mongodb://127.0.0.1:27017/budgetwise
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Start development server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory
```bash
cd client
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Usage

### 1. Register Account
- Visit the registration page
- Enter username, email, and password
- Click "Create account"
- You'll be logged in automatically

### 2. Dashboard
- View your financial overview
- Select different months to see historical data
- Check spending by category

### 3. Add Expenses
- Go to Expenses page
- Fill in description, amount, category, and date
- Add optional notes
- Click "Add expense"
- View all expenses in the table below

### 4. Track Income
- Go to Income page
- Add income sources with amounts
- Track different income streams
- Monitor monthly income trends

### 5. Set Budgets
- Go to Budgets page
- Select category and set monthly limit
- Click "Save budget"
- Monitor spending against budget limits
- Color indicators show status (green=safe, orange=warning, red=exceeded)

### 6. Create Savings Goals
- Go to Goals page
- Enter goal name, target amount, current savings
- Set optional deadline
- Click "Create goal"
- Update saved amount as you progress
- Track progress with visual indicators

---

## Project Structure

```
BudgetWise/
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout with navigation
│   │   │   ├── ProtectedRoute.jsx  # Auth-protected routes
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   └── charts/
│   │   │       └── CategoryPie.jsx  # Pie chart component
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public landing page
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── Dashboard.jsx       # Financial overview
│   │   │   ├── Expenses.jsx        # Expense management
│   │   │   ├── Income.jsx          # Income tracking
│   │   │   ├── Budgets.jsx         # Budget planning
│   │   │   └── Goals.jsx           # Savings goals
│   │   ├── services/
│   │   │   ├── api.js              # Axios configuration
│   │   │   ├── auth.js             # Auth APIs
│   │   │   ├── expenses.js         # Expense APIs
│   │   │   ├── income.js           # Income APIs
│   │   │   ├── budgets.js          # Budget APIs
│   │   │   ├── goals.js            # Goal APIs
│   │   │   ├── dashboard.js        # Dashboard APIs
│   │   │   └── categories.js       # Category definitions
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                          # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   ├── Expense.js          # Expense schema
│   │   │   ├── Income.js           # Income schema
│   │   │   ├── Budget.js           # Budget schema
│   │   │   └── Goal.js             # Goal schema
│   │   ├── controllers/
│   │   │   ├── authController.js   # Auth logic
│   │   │   ├── expenseController.js # Expense logic
│   │   │   ├── incomeController.js  # Income logic
│   │   │   ├── budgetController.js  # Budget logic
│   │   │   ├── goalController.js    # Goal logic
│   │   │   └── dashboardController.js # Dashboard logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Auth endpoints
│   │   │   ├── expenseRoutes.js    # Expense endpoints
│   │   │   ├── incomeRoutes.js     # Income endpoints
│   │   │   ├── budgetRoutes.js     # Budget endpoints
│   │   │   ├── goalRoutes.js       # Goal endpoints
│   │   │   └── dashboardRoutes.js  # Dashboard endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   └── errorHandler.js     # Error handling
│   │   └── utils/
│   │       └── month.js            # Date utilities
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env.example
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income records
- `POST /api/income` - Create income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Budgets
- `GET /api/budgets` - Get budgets
- `POST /api/budgets` - Create/update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/usage` - Get budget usage

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Frontend and backend route protection
- **CORS**: Configured for safe cross-origin requests
- **Environment Variables**: Sensitive data kept in .env files
- **MongoDB Indexes**: Optimized queries with proper indexing
- **User Isolation**: Each user can only access their own data

---

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create Render account
3. Connect GitHub repository
4. Set environment variables in Render
5. Deploy from Render dashboard

**Render Environment Variables:**
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT
- `CLIENT_URL` - Frontend URL (e.g., https://budgetwise.vercel.app)
- `NODE_ENV` - Set to "production"

### Frontend (Vercel)

1. Push code to GitHub
2. Create Vercel account
3. Import project from GitHub
4. Set environment variables
5. Deploy

**Vercel Environment Variables:**
- `VITE_API_URL` - Backend API URL (e.g., https://budgetwise-server.render.com)

---

## Database Schema

### User
```javascript
{
  username: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```javascript
{
  userId: ObjectId (ref: User, indexed),
  title: String (required, trimmed),
  amount: Number (required, min: 0),
  category: String (required),
  date: Date (required),
  notes: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}
```

### Income
```javascript
{
  userId: ObjectId (ref: User, indexed),
  source: String (required, trimmed),
  amount: Number (required, min: 0),
  date: Date (required),
  notes: String (default: ""),
  createdAt: Date,
  updatedAt: Date
}
```

### Budget
```javascript
{
  userId: ObjectId (ref: User, indexed),
  category: String (required),
  month: String (required, format: "YYYY-MM"),
  monthlyLimit: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
  // Unique index: userId + category + month
}
```

### Goal
```javascript
{
  userId: ObjectId (ref: User, indexed),
  goalName: String (required, trimmed),
  targetAmount: Number (required, min: 0),
  currentAmount: Number (required, min: 0, default: 0),
  deadline: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Troubleshooting

### Backend not connecting to MongoDB
- Verify MongoDB service is running: `net start MongoDB` (Windows)
- Check MONGO_URI format is correct
- Ensure database user has proper permissions

### Frontend API calls failing
- Confirm backend is running on port 5000
- The Vite proxy forwards `/api/*` automatically — no CORS issues in dev
- Check browser console for errors (F12)

### Authentication issues
- Clear localStorage and try logging in again
- Check JWT_SECRET is set in server `.env`
- Verify token is not expired

### Data not persisting
- Check MongoDB connection status in server logs
- Verify user ID is properly stored in requests
- Check database indexes are created

---

## Future Enhancements

- [ ] PDF report export
- [ ] Recurring expense automation
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and forecasting
- [ ] Budget notifications
- [ ] Data import/export
- [ ] Collaborative budgeting

---

**BudgetWise v1.0.0**
