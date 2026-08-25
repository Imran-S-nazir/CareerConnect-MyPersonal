const express = require("express")
const router = express.Router()

const authControllers = require("../controllers/authController.js")
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register",authControllers.registerUser)
router.post("/login",authControllers.loginUser)
router.post("/logout",authControllers.logoutUser)
router.get("/me",authMiddleware,authControllers.getMe)

router.patch("/update-experience-level",authMiddleware,authControllers.updateExperienceLevel)


module.exports = router