import pool from "../dbConnection.js";

const seeder = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        total_tickets_count INT NOT NULL,
        booked_tickets_count INT NOT NULL DEFAULT 0,

        CONSTRAINT chk_total_tickets 
          CHECK (total_tickets_count > 0),

        CONSTRAINT chk_booked_tickets 
          CHECK (booked_tickets_count >= 0),

        CONSTRAINT chk_booked_not_exceed_total 
          CHECK (booked_tickets_count <= total_tickets_count),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        fname VARCHAR(255) NOT NULL,
        lname VARCHAR(255) NOT NULL,
        email_id VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS event_bookings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        event_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        tickets_count INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_tickets_count 
          CHECK (tickets_count > 0),
        CONSTRAINT fk_booking_event 
          FOREIGN KEY (event_id) 
          REFERENCES events(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_booking_user 
          FOREIGN KEY (user_id) 
          REFERENCES users(id)
          ON DELETE CASCADE,

        INDEX idx_event_id (event_id),
        INDEX idx_user_id (user_id)
      );
    `);
    await connection.execute(
      `
        INSERT IGNORE INTO users (fname, lname, email_id) VALUES
('Amit', 'Sharma', 'amit.sharma@gmail.com'),
('Neha', 'Verma', 'neha.verma@gmail.com'),
('Rohit', 'Patel', 'rohit.patel@gmail.com'),
('Priya', 'Singh', 'priya.singh@gmail.com'),
('Karan', 'Mehta', 'karan.mehta@gmail.com'),
('Anjali', 'Gupta', 'anjali.gupta@gmail.com'),
('Rahul', 'Khanna', 'rahul.khanna@gmail.com'),
('Pooja', 'Joshi', 'pooja.joshi@gmail.com'),
('Vikram', 'Malhotra', 'vikram.malhotra@gmail.com'),
('Sneha', 'Iyer', 'sneha.iyer@gmail.com');`
    )
    await connection.commit();
    console.log("Database seeded successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Seeder failed:", error);
  } finally {
    connection.release();
  }
};

export default seeder;
