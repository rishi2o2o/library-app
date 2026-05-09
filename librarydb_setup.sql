-- Create database
DROP DATABASE IF EXISTS library_db;
CREATE DATABASE library_db;
USE library_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash CHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    description TEXT,
    publication_year INT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'returned') DEFAULT 'active',
    returned_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insert sample users
INSERT INTO users (email, name, password_hash) VALUES
('mel@example.com', 'Mel', '$2b$12$EL1ds7ikAQB0lTD/9e5jo.8devMdCjVmKYNV5yZdt0N20dohaJDM6'),
('rob@example.com', 'Rob', '$2b$12$X5Ji3WzvMUlaIKONnSYRYOW66mLNhVgAxfyHZ7sOvVWUre72PBRhC');

-- Insert sample books
INSERT INTO books (isbn, title, author, genre, description, publication_year) VALUES
('9780451524935', '1984', 'George Orwell', 'Dystopian Fiction', 'A novel about surveillance, authoritarianism, and manipulation of truth.', 1949),
('9780061120084', 'To Kill a Mockingbird', 'Harper Lee', 'Classic Fiction', 'A story exploring morality, empathy, and justice in the American South.', 1960),
('9780374528379', 'The Brothers Karamazov', 'Fyodor Dostoevsky', 'Philosophical Fiction', 'A philosophical novel about faith, doubt, ethics, and family.', 1880),
('9780618640157', 'The Lord of the Rings', 'J. R. R. Tolkien', 'Fantasy', 'An epic fantasy adventure centered on courage, friendship, and sacrifice.', 1954),
('9780374533557', 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 'An exploration of cognitive biases and human decision-making.', 2011),
('9780061241895', 'Influence', 'Robert B. Cialdini', 'Psychology', 'A classic book about persuasion and social behavior.', 1984),
('9780812968255', 'Meditations', 'Marcus Aurelius', 'Philosophy', 'Stoic reflections on emotional control, discipline, and life.', 180),
('9780062316097', 'Sapiens', 'Yuval Noah Harari', 'History', 'A systems-level history of human civilization and evolution.', 2011),
('9781439149959', 'The Lessons of History', 'Will Durant and Ariel Durant', 'History', 'A concise summary of recurring patterns throughout civilization.', 1968),
('9781400063512', 'The Black Swan', 'Nassim Nicholas Taleb', 'Economics', 'A book about uncertainty, randomness, and rare impactful events.', 2007),
('9780735211292', 'Atomic Habits', 'James Clear', 'Self-Help', 'A guide to behavior design and building consistent habits.', 2018),
('9780132350884', 'Clean Code', 'Robert C. Martin', 'Software Engineering', 'Principles and practices for writing maintainable software.', 2008),
('9780201633610', 'Design Patterns', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Software Engineering', 'Foundational software architecture and reusable design solutions.', 1994),
('9780135957059', 'The Pragmatic Programmer', 'Andrew Hunt and David Thomas', 'Software Engineering', 'Practical advice on software craftsmanship and engineering judgment.', 1999),
('9780807014271', 'Man''s Search for Meaning', 'Viktor E. Frankl', 'Psychology', 'A memoir and psychological exploration of meaning and resilience.', 1946);

-- Verify setup
SELECT 'Users:' as '';
SELECT * FROM users;

SELECT 'Books:' as '';
SELECT title FROM books;

SELECT 'Setup complete!' as '';


