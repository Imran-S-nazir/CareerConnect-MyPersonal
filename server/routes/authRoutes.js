const express = require("express")
const router = express.Router()

const authControllers = require("../controllers/authController.js")
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register",authControllers.registerUser)
router.post("/login",authControllers.loginUser)
router.post("/logout",authControllers.logoutUser)
router.get("/me",authMiddleware,authControllers.getMe)

router.patch("/update-experience-level",authMiddleware,authControllers.updateExperienceLevel)
router.post("/check-email", authControllers.checkEmail);

router.post("/send-otp",authControllers.sendOTP);
router.post("/verify-otp",authControllers.verifyOTP);

module.exports = router