import express from "express";

const router = express.Router();

// @route   GET api/profiles
// @desc    Get profiles
// @access  public
router.get("/", (req, res) => res.send("profiles route"));

export default router;
