const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/incomeController");

router.use(auth);

router.post("/", c.createIncome);
router.get("/", c.getIncome);
router.put("/:id", c.updateIncome);
router.delete("/:id", c.deleteIncome);

module.exports = router;