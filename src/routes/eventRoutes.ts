import express, { type Request, type Response } from 'express';
import pool from '../dbConnection.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const [response] = await pool.execute(
            `INSERT INTO events (title, total_tickets_count, booked_tickets_count)
     VALUES (?, ?, ?)`,
            [payload.title, payload.totalTicketsCount, 0]
        );
        return res.status(200).json({ status: true, eventId: (response as any).insertId });
    } catch (err) {
        throw err;
    }
});

export default router;