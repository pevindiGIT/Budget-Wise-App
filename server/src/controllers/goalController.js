const Goal = require("../models/Goal");

exports.createGoal = async (req, res, next) => {
  try {
    const { goalName, targetAmount, currentAmount, deadline } = req.body;
    if (!goalName || targetAmount == null) {
      res.status(400);
      throw new Error("goalName and targetAmount are required");
    }

    const goal = await Goal.create({
      userId: req.user.id,
      goalName,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline: deadline || null
    });

    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Goal not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const deleted = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      res.status(404);
      throw new Error("Goal not found");
    }
    res.json({ message: "Goal deleted" });
  } catch (err) {
    next(err);
  }
};