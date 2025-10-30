CREATE TYPE TransactionStatus AS ENUM('PENDING', 'COMPLETED');
CREATE SEQUENCE LuckyDrawCodeSeq MAXVALUE 999999;

CREATE TABLE Users(
    uid CHAR(36) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_booth BOOLEAN NOT NULL DEFAULT FALSE,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE Transactions(
    transaction_id CHAR(36) PRIMARY KEY,
    start_timestamp TIMESTAMP NOT NULL,
    completed_timestamp TIMESTAMP,
    sender_uid CHAR(36) NOT NULL,
    receiver_uid CHAR(36),
    status TransactionStatus DEFAULT 'PENDING' NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Topup(
    topup_id CHAR(36) PRIMARY KEY,
    student_uid CHAR(36) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    admin_uid CHAR(36),
    admin_name VARCHAR(255),
    amount DECIMAL(10, 2),
    completed_timestamp TIMESTAMP,
    lucky_draw_code CHAR(13) DEFAULT 'EXCITE-' || LPAD(NEXTVAL('LuckyDrawCodeSeq')::TEXT, 6, '0') NOT NULL
);

CREATE TABLE Announcements(
    announcement_id CHAR(36) PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    visible BOOLEAN NOT NULL DEFAULT TRUE
)