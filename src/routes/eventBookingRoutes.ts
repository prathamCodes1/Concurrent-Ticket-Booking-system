import express, { type Request, type Response } from 'express';
import pool from '../dbConnection.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        const eventId = req.params.eventId;
        const { userId, ticketsCount } = req.body;
        await connection.beginTransaction();
        const [response] = await connection.execute(
            'SELECT CAST(SUM(tickets_count) AS SIGNED) AS ticketsBought FROM event_bookings WHERE event_id = ? AND user_id = ? FOR UPDATE;',
            [eventId, userId]
        );
        const ticketsBought = (response as { ticketsBought: number }[])?.[0]?.ticketsBought;
        if (ticketsCount > 2 || (ticketsBought + ticketsCount > 2)) {
            throw new Error(`Same user can't buy more than 2 tickets`);
        }
        // checking ticket availability 
        const [eventData] = await connection.execute(
            `SELECT CAST(total_tickets_count AS SIGNED) as eventTotalTickets, CAST(booked_tickets_count AS SIGNED) as eventBookedTickets FROM events WHERE id = ? FOR UPDATE`,
            [eventId]
        ) as unknown as Array<{ eventTotalTickets: number, eventBookedTickets: number }>[];
        const availableTickets = (eventData?.[0]?.eventTotalTickets ?? 0) - (eventData?.[0]?.eventBookedTickets ?? 0);
        if (availableTickets === 0) {
            throw new Error('All tickets are booked, better luck next time!');
        }
        if (availableTickets < ticketsCount) {
            throw new Error(`You can't book ${ticketsCount} as only ${availableTickets} are left`);
        }
        await connection.execute(
            `UPDATE events SET booked_tickets_count = booked_tickets_count+? WHERE id = ?;`,
            [ticketsCount, eventId]
        );

        const [resp] = await connection.execute(
            `INSERT INTO event_bookings(event_id,user_id,tickets_count) VALUES(?,?,?);`,
            [eventId, userId, ticketsCount]
        );
        await connection.commit();
        return res.status(200).json({ status: true, bookingId: (resp as any).insertId });
    } catch (err) {
        await connection.rollback();
        console.log('Database operation failed', err);
        throw err;
    } finally {
        await connection.release();
    }

});

router.delete('/:id/', async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        const bookingId = req.params.id;
        const eventId = req.params.eventId;
        await connection.beginTransaction();
        await connection.execute(
            `UPDATE events SET booked_tickets_count = booked_tickets_count-1 WHERE id = ? AND booked_tickets_count > 0;`,
            [eventId]
        ) as unknown as { affectedRows: number }[];
        const [deleteResp] = await connection.execute(
            `DELETE FROM event_bookings WHERE id = ?`,
            [bookingId]
        )
        await connection.commit();
        return res.json({ status: true });
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        await connection.release();
    }
});
export default router;