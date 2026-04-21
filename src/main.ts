import express, { Request, Response } from "express";
import userRoutes from "./modules/user/userRoutes";

const app = express(); //?Initialize the server
app.use(express.json()); //?Parse JSON bodies so that the req.body is of type object and readable

app.use("/users", userRoutes);

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