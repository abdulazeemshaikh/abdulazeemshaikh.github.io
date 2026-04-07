import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/submit', (req, res) => {
    const { type, data } = req.body;
    
    if (!type || !data) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    try {
        let submissions = [];
        if (fs.existsSync(DATA_FILE)) {
            const rawData = fs.readFileSync(DATA_FILE);
            submissions = JSON.parse(rawData);
        }

        const newEntry = {
            id: Date.now(),
            type, // 'invest' or 'waitlist'
            ...data,
            submittedAt: new Date().toISOString()
        };

        submissions.push(newEntry);
        fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));

        console.log(`New submission received: ${type}`);
        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error saving submission:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Responses will be saved to: ${DATA_FILE}`);
});
