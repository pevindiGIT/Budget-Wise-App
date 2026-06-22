const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const { monthRange } = require("../utils/month");

exports.upsertBudget = async (req, res, next) => {
  try {
    const { category, month, monthlyLimit } = req.body;
    if (!category || !month || monthlyLimit == null) {
      res.status(400);
      throw new Error("category, month (YYYY-MM), monthlyLimit are required");
    }

    const doc = await Budget.findOneAndUpdate(
      { userId: req.user.id, category, month },
      { $set: { monthlyLimit } },
      { new: true, upsert: true }
    );

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    const filter = { userId: req.user.id };
    if (month) filter.month = month;

    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      res.status(404);
      throw new Error("Budget not found");
    }
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

// Budget usage for a month: spent per category vs limit
exports.getBudgetUsage = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) {
      res.status(400);
      throw new Error("month query param is required (YYYY-MM)");
    }

    const range = monthRange(month);

    const budgets = await Budget.find({ userId: req.user.id, month });

    const spent = await Expense.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(req.user.id),
          date: { $gte: range.start, $lt: range.end }
        }
      },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
    ]);

    const spentMap = new Map(spent.map((s) => [s._id, s.totalSpent]));

    const usage = budgets.map((b) => {
      const totalSpent = spentMap.get(b.category) || 0;
      const remaining = Math.max(b.monthlyLimit - totalSpent, 0);
      const percent = b.monthlyLimit > 0 ? Math.round((totalSpent / b.monthlyLimit) * 100) : 0;
      return {
        _id: b._id,
        category: b.category,
        month: b.month,
        monthlyLimit: b.monthlyLimit,
        totalSpent,
        remaining,
        percent
      };
    });

    res.json(usage);
  } catch (err) {
    next(err);
  }
};