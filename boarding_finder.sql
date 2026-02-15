CREATE DATABASE IF NOT EXISTS boarding_finder;
USE boarding_finder;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'owner', 'service', 'admin') NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Boardings table
CREATE TABLE boardings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('room', 'house', 'shared') NOT NULL,
    university VARCHAR(100) NOT NULL,
    town VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    facilities JSON,
    contact_phone VARCHAR(20) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Boarding images table
CREATE TABLE boarding_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    boarding_id INT NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boarding_id) REFERENCES boardings(id) ON DELETE CASCADE
);

-- Favorites table
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    boarding_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (boarding_id) REFERENCES boardings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, boarding_id)
);

-- Services table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@boardingfinder.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample data
INSERT INTO users (name, email, password, role, phone) VALUES 
('John Student', 'student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', '0771234567'),
('Sarah Owner', 'owner@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner', '0777654321'),
('Mike Service', 'service@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'service', '0771122334');