import express from "express";
import { readFile } from "fs/promises";
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(`Welcome to server: ${port}`);

  res.send(await readFile("./index.html", "utf-8"));
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
