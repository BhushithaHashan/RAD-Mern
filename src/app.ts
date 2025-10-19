import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("SwiftLink alive 🚀");
});

app.listen(3000, () => {
  console.log("Server running");
});
