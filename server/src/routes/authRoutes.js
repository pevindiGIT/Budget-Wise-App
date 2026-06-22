const router = require("express").Router();
const auth = require("../middleware/auth");
const { register, login, profile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;