-- HOD Table
CREATE TABLE hods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    department VARCHAR(100) NOT NULL,
    total_teachers_managed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- HOD-Teacher Relationship (Many-to-Many)
CREATE TABLE hod_teachers (
    hod_id INT,
    teacher_id INT,
    PRIMARY KEY (hod_id, teacher_id),
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- Insert sample HOD data (optional)
-- INSERT INTO hods (user_id, department) VALUES (1, 'Computer Science');



