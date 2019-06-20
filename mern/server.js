const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Running"));

const PORT = process.env.PORT || 9000;
console.error(PORT);

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
