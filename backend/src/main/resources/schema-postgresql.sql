-- ============================================================================
-- HOTEL RESERVATION SYSTEM - POSTGRESQL PRODUCTION DDL SCHEMA
-- ============================================================================

-- Drop tables if exists in reverse dependency order
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'STAFF', 'ADMIN')),
    account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. HOTELS TABLE
CREATE TABLE hotels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
    check_in_time VARCHAR(10) NOT NULL DEFAULT '14:00',
    check_out_time VARCHAR(10) NOT NULL DEFAULT '11:00',
    image_url VARCHAR(500),
    amenities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_star_rating ON hotels(star_rating);
CREATE INDEX idx_hotels_name ON hotels(name);

-- 3. ROOMS TABLE
CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    hotel_id BIGINT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('SINGLE', 'DOUBLE', 'TWIN', 'SUITE', 'DELUXE', 'FAMILY')),
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night > 0),
    capacity INTEGER NOT NULL CHECK (capacity >= 1),
    floor INTEGER NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE')),
    image_url VARCHAR(500),
    amenities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_hotel_room_number UNIQUE (hotel_id, room_number)
);

CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);
CREATE INDEX idx_rooms_capacity ON rooms(capacity);
CREATE INDEX idx_rooms_status ON rooms(status);

-- 4. RESERVATIONS TABLE
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    reservation_code VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL CHECK (number_of_guests >= 1),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price > 0),
    reservation_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (reservation_status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_reservation_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_code ON reservations(reservation_code);
CREATE INDEX idx_reservations_dates ON reservations(room_id, check_in_date, check_out_date, reservation_status);
CREATE INDEX idx_reservations_status ON reservations(reservation_status);

-- 5. PAYMENTS TABLE
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('CASH', 'CARD', 'ONLINE')),
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction_ref ON payments(transaction_reference);
