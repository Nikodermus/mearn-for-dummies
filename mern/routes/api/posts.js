import express from "express";

const router = express.Router();

// @route   GET api/posts
// @desc    Get posts
// @access  public
router.get("/", (req, res) => res.send("posts route"));

export default router;
