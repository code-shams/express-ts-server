import express, { Request, Response } from "express";

const app = express(); //?Initialize the server
app.use(express.json()); //?Parse JSON bodies so that the req.body is of type object and readable

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello World!",
    status: 200,
    path: req.path
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});