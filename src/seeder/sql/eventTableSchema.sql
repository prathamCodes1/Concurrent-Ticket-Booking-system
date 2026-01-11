CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    total_tickets_count INT NOT NULL,
    booked_tickets_count INT NOT NULL DEFAULT 0,

    -- Prevent negative or invalid values
    CONSTRAINT chk_total_tickets CHECK (total_tickets_count > 0),
    CONSTRAINT chk_booked_tickets CHECK (booked_tickets_count >= 0),
    CONSTRAINT chk_booked_not_exceed_total 
        CHECK (booked_tickets_count <= total_tickets_count),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
