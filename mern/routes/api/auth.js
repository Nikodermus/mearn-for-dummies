import express from "express";
import auth from "../../middleware/auth";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { check, validationResult } from "express-validator/check";

const router = express.Router();

// @route   GET api/auth
// @desc    Get auth
// @access  public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Poo poo auth");
  }
});

// @route   POST api/auth
// @desc    Authenticate User
// @access  public
router.post(
  "/",
  [
    check("email", "Includ a valid email").isEmail(),
    check(
      "password",
      "Password needs to be at least 6 characters long"
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json([{ msg: "Invalid Credentials" }]);

      console.log(user);
      console.log("---------------------------");

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json([{ msg: "Invalid Credentials" }]);
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtKey"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("We poo poo the app");
    }
  }
);

export default router;
