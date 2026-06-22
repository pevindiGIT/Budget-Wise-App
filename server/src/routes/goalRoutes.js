const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/goalController");

router.use(auth);

router.post("/", c.createGoal);
router.get("/", c.getGoals);
router.put("/:id", c.updateGoal);
router.delete("/:id", c.deleteGoal);

module.exports = router;