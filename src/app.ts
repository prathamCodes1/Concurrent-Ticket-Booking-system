import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import eventRouter from './routes/eventRoutes.js';
import eventBookingRouter from './routes/eventBookingRoutes.js';
import seeder from './seeder/seeder.js';
const app = express();
app.use(express.json());

app.use('/:eventId/booking', eventBookingRouter);
app.use('/event', eventRouter);

app.use((
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
    seeder();
});