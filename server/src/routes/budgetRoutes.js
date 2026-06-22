const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/budgetController");

router.use(auth);

router.post("/", c.upsertBudget);
router.get("/", c.getBudgets);
router.get("/usage", c.getBudgetUsage);
router.delete("/:id", c.deleteBudget);

module.exports = router;