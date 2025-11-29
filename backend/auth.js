import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from "./models/user-services.js";
import User from "./models/user.js";

function generateAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { email: payload.email, id: payload.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res
      .status(401)
      .json({ error: "Authentication required. No token provided." });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      console.log("JWT error:", error);
      return res
        .status(401)
        .json({ error: "Invalid or expired token. Please log in again." });
    }
  });
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are both required." });
    }

    const retrievedUser = await userServices.findUserForLogin(email);

    if (!retrievedUser) {
      // no such email
      return res
        .status(401)
        .json({ error: "No account found with that email address." });
    }

    const matched = await bcrypt.compare(password, retrievedUser.passwordHash);

    if (!matched) {
      // incorrect password
      return res
        .status(401)
        .json({ error: "Incorrect password. Please try again." });
    }

    const payload = {
      id: retrievedUser._id.toString(),
      email: retrievedUser.email,
    };

    const token = await generateAccessToken(payload);

    return res
      .status(200)
      .json({ token, message: "Login successful. Welcome back!" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      error:
        "Something went wrong while logging you in. Please try again in a moment.",
    });
  }
}

export async function signupUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      passwordHash,
    });

    const savedUser = await newUser.save();
    const { passwordHash: _ignored, ...userSafe } = savedUser.toObject();

    return res.status(201).json({
      message: "User created successfully.",
      user: userSafe,
    });
  } catch (err) {
    console.error("Signup error:", err);

    if (err.code === 11000 && err.keyPattern?.email) {
      return res
        .status(409)
        .json({ error: "This email is already registered." });
    }

    if (err.name === "ValidationError") {
      const details = Object.values(err.errors)
        .map((e) => e.message)
        .join(" ");
      return res
        .status(400)
        .json({ error: `Invalid user data. ${details}` });
    }

    return res.status(500).json({
      error:
        "Something went wrong while creating your account. Please try again.",
    });
  }
}
