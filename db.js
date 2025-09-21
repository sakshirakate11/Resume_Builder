// Load environment variables from .env file
require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create SQLite database connection
const dbPath = path.join(__dirname, 'resume_builder.db');
const db = new sqlite3.Database(dbPath);

// Promisify database operations
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Create users table
        await dbRun(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create resumes table
        await dbRun(`CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            personal_info TEXT,
            experience TEXT,
            education TEXT,
            skills TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Create resume_templates table
        await dbRun(`CREATE TABLE IF NOT EXISTS resume_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            template_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert sample templates if they don't exist
        const templates = await dbGet('SELECT COUNT(*) as count FROM resume_templates');
        if (templates.count === 0) {
            await dbRun(`INSERT INTO resume_templates (name, description, template_data) VALUES
                (?, ?, ?),
                (?, ?, ?),
                (?, ?, ?)`,
                [
                    'Classic Template', 'A traditional, professional resume template', '{"layout": "classic", "colors": {"primary": "#2c3e50", "secondary": "#34495e"}}',
                    'Modern Template', 'A contemporary, clean resume template', '{"layout": "modern", "colors": {"primary": "#3498db", "secondary": "#2980b9"}}',
                    'Creative Template', 'An artistic, eye-catching resume template', '{"layout": "creative", "colors": {"primary": "#e74c3c", "secondary": "#c0392b"}}'
                ]
            );
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Initialize database on startup
initializeDatabase();

// Export database functions
module.exports = {
    query: async (sql, params = []) => {
        return await dbAll(sql, params);
    },
    execute: async (sql, params = []) => {
        return await dbRun(sql, params);
    },
    get: async (sql, params = []) => {
        return await dbGet(sql, params);
    }
};
