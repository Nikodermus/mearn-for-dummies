import express from "express";

const router = express.Router();

// @route   GET api/auth
// @desc    Get auth
// @access  public
router.get("/", (req, res) => res.send("auth route"));

export default router;
