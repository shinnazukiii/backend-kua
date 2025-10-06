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
        const [rows] = await db_1.default.query('SELECT * FROM rekomendasi_nikah');
        res.json(rows);
    }
    catch (err) {
        console.error('Error mengambil data rekomendasi:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data rekomendasi' });
    }
});
router.post('/', async (req, res) => {
    const { nama_pemohon, asal_kelurahan, nomor_surat_lurah, tempat_lahir, tanggal_lahir, pekerjaan, alamat, nama_pasangan, kua_tujuan, provinsi_tujuan } = req.body;
    if (!nama_pemohon || !asal_kelurahan || !nomor_surat_lurah || !tempat_lahir || !tanggal_lahir) {
        return res.status(400).json({ message: 'Field wajib belum diisi' });
    }
    try {
        const [result] = await db_1.default.query(`INSERT INTO rekomendasi_nikah 
      (nama_pemohon, asal_kelurahan, nomor_surat_lurah, tempat_lahir, tanggal_lahir, pekerjaan, alamat, nama_pasangan, kua_tujuan, provinsi_tujuan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nama_pemohon, asal_kelurahan, nomor_surat_lurah, tempat_lahir, tanggal_lahir, pekerjaan, alamat, nama_pasangan, kua_tujuan, provinsi_tujuan]);
        res.status(201).json({ message: 'Rekomendasi nikah berhasil ditambahkan', id: result.insertId });
    }
    catch (err) {
        console.error('Error menambahkan rekomendasi:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan rekomendasi' });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const [result] = await db_1.default.query(`UPDATE rekomendasi_nikah SET ? WHERE id = ?`, [data, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data rekomendasi tidak ditemukan' });
        }
        res.json({ message: 'Rekomendasi nikah berhasil diupdate' });
    }
    catch (err) {
        console.error('Error mengupdate rekomendasi:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate rekomendasi' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db_1.default.query(`DELETE FROM rekomendasi_nikah WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data rekomendasi tidak ditemukan' });
        }
        res.json({ message: 'Rekomendasi nikah berhasil dihapus' });
    }
    catch (err) {
        console.error('Error menghapus rekomendasi:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus rekomendasi' });
    }
});
exports.default = router;
