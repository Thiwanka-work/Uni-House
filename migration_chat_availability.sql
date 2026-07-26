-- ============================================================
-- Migration: Add is_available to boardings + Create messages table
-- Run this in your MySQL/phpMyAdmin
-- ============================================================

-- Part 1: Availability Status
ALTER TABLE boardings 
ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT TRUE AFTER is_approved;

-- Part 2: Chat / Messages
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  boarding_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (boarding_id) REFERENCES boardings(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for fast lookup by boarding conversation
CREATE INDEX idx_messages_boarding ON messages(boarding_id);
CREATE INDEX idx_messages_receiver  ON messages(receiver_id, is_read);
