"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM user');
        res.json(rows);
    }
    catch (err) {
        console.error('Error mengambil data user:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data user' });
    }
});
router.post('/login', async (req, res) => {
    console.log('Body yang diterima login:', req.body);
    let { username, password } = req.body;
    username = typeof username === 'string' ? username.trim() : '';
    password = typeof password === 'string' ? password.trim() : '';
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }
    try {
        const [rows] = await db_1.default.query('SELECT * FROM user WHERE BINARY username = ? AND BINARY password = ?', [username, password]);
        console.log('Hasil query rows:', rows);
        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
        const user = rows[0];
        res.json({
            message: 'Login berhasil',
            user: {
                id: user.id,
                username: user.username,
            },
        });
    }
    catch (err) {
        console.error('Error saat login:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});
exports.default = router;
