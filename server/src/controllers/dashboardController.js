const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { monthRange } = require("../utils/month");

exports.getSummary = async (req, res, next) => {
  try {
    const { month } = req.query; // optional: "YYYY-MM"
    const userObjectId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const match = { userId: userObjectId };
    let dateMatch = {};

    if (month) {
      const range = monthRange(month);
      dateMatch = { date: { $gte: range.start, $lt: range.end } };
    }

    const [expenseTotalAgg, incomeTotalAgg, byCategoryAgg] = await Promise.all([
      Expense.aggregate([{ $match: { ...match, ...dateMatch } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Income.aggregate([{ $match: { ...match, ...dateMatch } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([
        { $match: { ...match, ...dateMatch } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
      ])
    ]);

    const totalExpenses = expenseTotalAgg[0]?.total || 0;
    const totalIncome = incomeTotalAgg[0]?.total || 0;
    const balance = totalIncome - totalExpenses;

    res.json({
      month: month || null,
      totalIncome,
      totalExpenses,
      balance,
      byCategory: byCategoryAgg.map((x) => ({ category: x._id, total: x.total }))
    });
  } catch (err) {
    next(err);
  }
};