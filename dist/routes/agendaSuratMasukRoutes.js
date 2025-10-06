"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const [rows] = await index_1.db.query('SELECT * FROM agenda_surat_masuk ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (err) {
        console.error('Error mengambil data surat masuk:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data surat masuk' });
    }
});
router.post('/', async (req, res) => {
    const { nama_pengirim, nomor_surat, tanggal_surat, hal } = req.body;
    if (!nama_pengirim || !nomor_surat || !tanggal_surat || !hal) {
        return res.status(400).json({ message: 'Field wajib belum diisi' });
    }
    try {
        const [result] = await index_1.db.query(`INSERT INTO agenda_surat_masuk (nama_pengirim, nomor_surat, tanggal_surat, hal) 
       VALUES (?, ?, ?, ?)`, [nama_pengirim, nomor_surat, tanggal_surat, hal]);
        res.status(201).json({
            message: 'Surat masuk berhasil ditambahkan',
            id: result.insertId,
        });
    }
    catch (err) {
        console.error('Error menambahkan surat masuk:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan surat masuk' });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_pengirim, nomor_surat, tanggal_surat, hal } = req.body;
    try {
        const [result] = await index_1.db.query(`UPDATE agenda_surat_masuk 
       SET nama_pengirim=?, nomor_surat=?, tanggal_surat=?, hal=? 
       WHERE id=?`, [nama_pengirim, nomor_surat, tanggal_surat, hal, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data surat masuk tidak ditemukan' });
        }
        res.json({ message: 'Surat masuk berhasil diperbarui' });
    }
    catch (err) {
        console.error('Error mengedit surat masuk:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengedit surat masuk' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await index_1.db.query('DELETE FROM agenda_surat_masuk WHERE id=?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data surat masuk tidak ditemukan' });
        }
        res.json({ message: 'Surat masuk berhasil dihapus' });
    }
    catch (err) {
        console.error('Error menghapus surat masuk:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus surat masuk' });
    }
});
exports.default = router;
