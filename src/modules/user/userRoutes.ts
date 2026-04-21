import { Router } from "express";
import { Request, Response } from "express";
import pool from "../../database/dbConfig";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, password],
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
