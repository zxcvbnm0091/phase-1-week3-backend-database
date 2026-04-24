import express, { json } from "express";
const app = express();
const port = 3000;
import router from "./router/router.js";

app.use(json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(router);

app.listen(port, () => {
  console.log("Server is running in port: " + port);
});
