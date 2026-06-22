const Expense = require("../models/Expense");
const { monthRange } = require("../utils/month");

exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || amount == null || !category || !date) {
      res.status(400);
      throw new Error("title, amount, category, date are required");
    }

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date,
      notes: notes || ""
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const { category, month, search } = req.query;

    const filter = { userId: req.user.id };

    if (category) filter.category = category;

    if (month) {
      const range = monthRange(month);
      if (!range) {
        res.status(400);
        throw new Error("Invalid month format. Use YYYY-MM");
      }
      filter.date = { $gte: range.start, $lt: range.end };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Expense not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      res.status(404);
      throw new Error("Expense not found");
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
};