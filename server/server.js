const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");
const incomeRoutes = require("./src/routes/incomeRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

// Allow localhost origins in development; restrict to CLIENT_URL in production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "BudgetWise API running ✓" }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`Server running → http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    console.error(
      "Make sure MongoDB is running. Open MongoDB Compass and check the connection."
    );
    process.exit(1);
  });
