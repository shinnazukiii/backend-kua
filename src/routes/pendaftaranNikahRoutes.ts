import { Router, Request, Response } from 'express';
import db from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM pendaftaran_nikah ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data pendaftaran nikah:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pendaftaran nikah' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const {
    nomor_pendaftaran,
    nama_calon_suami,
    nama_calon_istri,
    tanggal_mendaftar,
    hari_pernikahan,
    tanggal_pernikahan,
    alamat_akad_nikah,
    tanggal_pemeriksaan
  } = req.body;

  if (
    !nomor_pendaftaran ||
    !nama_calon_suami ||
    !nama_calon_istri ||
    !tanggal_mendaftar ||
    !hari_pernikahan ||
    !tanggal_pernikahan ||
    !alamat_akad_nikah ||
    !tanggal_pemeriksaan
  ) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const [result] = await db.query<OkPacket>(
      `INSERT INTO pendaftaran_nikah 
      (nomor_pendaftaran, nama_calon_suami, nama_calon_istri, tanggal_mendaftar, hari_pernikahan, tanggal_pernikahan, alamat_akad_nikah, tanggal_pemeriksaan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor_pendaftaran,
        nama_calon_suami,
        nama_calon_istri,
        tanggal_mendaftar,
        hari_pernikahan,
        tanggal_pernikahan,
        alamat_akad_nikah,
        tanggal_pemeriksaan
      ]
    );

    res.status(201).json({ message: 'Pendaftaran nikah berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('Error menambahkan pendaftaran nikah:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan pendaftaran nikah' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nomor_pendaftaran,
    nama_calon_suami,
    nama_calon_istri,
    tanggal_mendaftar,
    hari_pernikahan,
    tanggal_pernikahan,
    alamat_akad_nikah,
    tanggal_pemeriksaan
  } = req.body;

  try {
    const [result] = await db.query<OkPacket>(
      `UPDATE pendaftaran_nikah 
       SET nomor_pendaftaran=?, nama_calon_suami=?, nama_calon_istri=?, tanggal_mendaftar=?, hari_pernikahan=?, tanggal_pernikahan=?, alamat_akad_nikah=?, tanggal_pemeriksaan=? 
       WHERE id = ?`,
      [
        nomor_pendaftaran,
        nama_calon_suami,
        nama_calon_istri,
        tanggal_mendaftar,
        hari_pernikahan,
        tanggal_pernikahan,
        alamat_akad_nikah,
        tanggal_pemeriksaan,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data pendaftaran nikah tidak ditemukan' });
    }

    res.json({ message: 'Pendaftaran nikah berhasil diupdate' });
  } catch (err) {
    console.error('Error mengupdate pendaftaran nikah:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate pendaftaran nikah' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query<OkPacket>(
      `DELETE FROM pendaftaran_nikah WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data pendaftaran nikah tidak ditemukan' });
    }

    res.json({ message: 'Pendaftaran nikah berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus pendaftaran nikah:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus pendaftaran nikah' });
  }
});

export default router;