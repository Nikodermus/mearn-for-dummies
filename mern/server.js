import express from "express";

import connectDB from "./config/db";
import authRoute from "./routes/api/auth";
import postsRoute from "./routes/api/posts";
import profilesRoute from "./routes/api/profiles";
import usersRoute from "./routes/api/users";

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Running"));

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/profiles", profilesRoute);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
