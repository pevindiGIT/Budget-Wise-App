const Income = require("../models/Income");
const { monthRange } = require("../utils/month");

exports.createIncome = async (req, res, next) => {
  try {
    const { source, amount, date, notes } = req.body;
    if (!source || amount == null || !date) {
      res.status(400);
      throw new Error("source, amount, date are required");
    }

    const income = await Income.create({
      userId: req.user.id,
      source,
      amount,
      date,
      notes: notes || ""
    });

    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
};

exports.getIncome = async (req, res, next) => {
  try {
    const { month, search } = req.query;
    const filter = { userId: req.user.id };

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
        { source: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    const income = await Income.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(income);
  } catch (err) {
    next(err);
  }
};

exports.updateIncome = async (req, res, next) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Income not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteIncome = async (req, res, next) => {
  try {
    const deleted = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      res.status(404);
      throw new Error("Income not found");
    }
    res.json({ message: "Income deleted" });
  } catch (err) {
    next(err);
  }
};