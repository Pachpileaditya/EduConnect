-- Add HOD role to existing users table
ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN', 'TEACHER', 'STUDENT', 'HOD') NOT NULL;

-- Create HODs Table
CREATE TABLE hods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    department VARCHAR(255) NOT NULL,
    total_teachers_managed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create HOD-Teacher Relationship Table
CREATE TABLE hod_teachers (
    hod_id INT,
    teacher_id INT,
    PRIMARY KEY (hod_id, teacher_id),
    FOREIGN KEY (hod_id) REFERENCES hods(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);



