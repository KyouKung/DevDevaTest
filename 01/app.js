import express from "express";
import cors from "cors";
import { client } from "./utils/db.js";
import userRouter from "./apps/user.js";

const init = async () => {
  await client.connect();
  const app = express();
  const port = 4000;

  app.use(express.json());
  app.use(cors());

  app.use("/users", userRouter);

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
};

init();
