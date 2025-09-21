-- Create the database
CREATE DATABASE IF NOT EXISTS resume_builder;
USE resume_builder;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    personal_info JSON,
    experience JSON,
    education JSON,
    skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create resume_templates table
CREATE TABLE IF NOT EXISTS resume_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample resume templates
INSERT INTO resume_templates (name, description, template_data) VALUES
('Classic Template', 'A traditional, professional resume template',
'{"layout": "classic", "colors": {"primary": "#2c3e50", "secondary": "#34495e"}}'),
('Modern Template', 'A contemporary, clean resume template',
'{"layout": "modern", "colors": {"primary": "#3498db", "secondary": "#2980b9"}}'),
('Creative Template', 'An artistic, eye-catching resume template',
'{"layout": "creative", "colors": {"primary": "#e74c3c", "secondary": "#c0392b"}}');
