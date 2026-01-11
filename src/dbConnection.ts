import { type Pool } from 'mysql2/promise';
import mysql, { type Connection } from 'mysql2/promise';
let connection: Connection | null = null;

console.log('My processen');
console.log('My processen2', process.env.DB_USER, process.env.DB_HOST, process.env.DB_PASSWORD, process.env.DB_NAME);

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

export default pool;

