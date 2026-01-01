// Vercel Serverless Function Entry Point
import app from '../src/app.js';
import connectDB from '../src/db/index.js';

// Global connection cache for serverless
let cachedDb = null;

async function ensureDbConnection() {
    if (cachedDb) {
        return cachedDb;
    }

    await connectDB();
    cachedDb = true;
    return cachedDb;
}

// Handler for Vercel
export default async function handler(req, res) {
    try {
        // Ensure database connection
        await ensureDbConnection();

        // Pass request to Express app
        return app(req, res);
    } catch (error) {
        console.error('Serverless handler error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server initialization error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}
