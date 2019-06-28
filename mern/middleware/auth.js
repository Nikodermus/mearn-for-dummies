import jwt from "jsonwebtoken";
import config from "config";

const authMid = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json([{ msg: "Unauth" }]);
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtKey"));
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json([{ msg: "Invalid token" }]);
  }
};

export default authMid;
