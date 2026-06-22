const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/expenseController");

router.use(auth);

router.post("/", c.createExpense);
router.get("/", c.getExpenses);
router.put("/:id", c.updateExpense);
router.delete("/:id", c.deleteExpense);

module.exports = router;