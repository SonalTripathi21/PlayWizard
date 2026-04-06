const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const AUTH_LOG_PATH = path.join(__dirname, '../data/authHistory.json');

const initAuthLogs = async () => {
    try {
        const dir = path.dirname(AUTH_LOG_PATH);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(AUTH_LOG_PATH);
        } catch {
            await fs.writeFile(AUTH_LOG_PATH, JSON.stringify([]));
        }
    } catch (err) {
        console.error('Failed to init auth logs:', err);
    }
};

initAuthLogs();

exports.logEvent = async (req, res) => {
    try {
        const { identifier, type } = req.body; // type: 'signin' or 'signout'
        if (!identifier || !type) {
            return res.status(400).json({ error: 'Identifier and event type are required' });
        }

        const data = await fs.readFile(AUTH_LOG_PATH, 'utf8');
        const logs = JSON.parse(data);

        const newLog = {
            id: uuidv4(),
            identifier,
            type,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent']
        };

        logs.unshift(newLog);
        await fs.writeFile(AUTH_LOG_PATH, JSON.stringify(logs, null, 2));

        res.status(201).json({ message: 'Auth event logged' });
    } catch (error) {
        console.error('Error logging auth event:', error.message);
        res.status(500).json({ error: 'Failed to log auth event' });
    }
};

exports.getAuthHistory = async (req, res) => {
    try {
        const data = await fs.readFile(AUTH_LOG_PATH, 'utf8');
        const logs = JSON.parse(data);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching auth history:', error.message);
        res.status(500).json({ error: 'Failed to fetch auth history' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: 'Credential is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({
                googleId,
                email,
                name,
                picture,
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        });
    } catch (error) {
        console.error('Google login error:', error.message);
        res.status(500).json({ error: 'Google login failed' });
    }
};
