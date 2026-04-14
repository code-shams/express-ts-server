import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express(); //?Initialize the server
app.use(express.json()); //?Parse JSON bodies so that the req.body is of type object and readable

//======================================================================================================
//* Datebase setup
//======================================================================================================
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_O9APVtHpXS3a@ep-little-snow-a1ro1pwn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log("Database initialized successfully")
  } catch (error) {
    console.log(error)
  }
}

initDB();

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