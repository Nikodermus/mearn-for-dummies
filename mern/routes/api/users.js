import { check, validationResult } from "express-validator/check";
import express from "express";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

import User from "../../models/User";

const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Includ a valid email").isEmail(),
    check(
      "password",
      "Password needs to be at least 6 characters long"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json([{ msg: "User already exists" }]);

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const salt = await bcrypt.genSalt(10);

      user = new User({
        password: await bcrypt.hash(password, salt),
        email,
        name,
        avatar
      });

      await user.save();

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
      console.error(error.message);
      return res.status(500).send("We poo poo the app");
    }
  }
);

export default router;
