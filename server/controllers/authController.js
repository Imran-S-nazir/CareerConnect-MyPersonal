const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};



// ==========================================
// REGISTER
// ==========================================
const registerUser = async (req, res, next) => {
  try {
    const { fullName, username, email, phone, password, confirmPassword } = req.body;

    // Required fields
    if (!fullName?.trim())
      return res.status(400).json({
        success: false,
        field: "fullName",
        message: "Full name is required",
      });

    if (!username?.trim())
      return res.status(400).json({
        success: false,
        field: "username",
        message: "Username is required",
      });

    if (!email?.trim())
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email is required",
      });

    if (!phone?.trim())
      return res.status(400).json({
        success: false,
        field: "phone",
        message: "Phone number is required",
      });

    if (!password)
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password is required",
      });

    if (password.length < 6)
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password must contain at least 6 characters",
      });

    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        field: "confirmPassword",
        message: "Passwords do not match",
      });

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      const field =
        existingUser.username === normalizedUsername ? "username" : "email";

      return res.status(409).json({
        success: false,
        field,
        message:
          field === "username"
            ? "Username is already taken"
            : "Email is already registered",
      });
    }

    // Split name
    const [firstName, ...lastName] = fullName.trim().split(/\s+/);

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      fullName: {
        firstName,
        lastName: lastName.join(" "),
      },
      email: normalizedEmail,
      phone: phone.trim(),
      password,
    });


    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
}
};

// ==========================================
// LOGIN
// ==========================================
const loginUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });
    }

    const loginValue = (email || username).trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LOGOUT
// ==========================================
const logoutUser = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};


const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      profileImage: req.user.profileImage,
      role: req.user.role,
    },
  });
};



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe
};
