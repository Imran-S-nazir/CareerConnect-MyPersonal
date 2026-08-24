const express = require("express")
const router = express.Router()

const authControllers = require("../controllers/authController.js")
const protect = require("../middleware/authMiddleware");

router.post("/register",authControllers.registerUser)
router.post("/login",authControllers.loginUser)
router.post("/logout",authControllers.logoutUser)
router.get("/me",protect,authControllers.getMe)


module.exports = router