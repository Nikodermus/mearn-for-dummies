import express from "express";

const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  public
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("User route");
});

export default router;
