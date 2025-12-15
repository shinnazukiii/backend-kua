import { Router, Request, Response } from 'express';
import db from '../db';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { nama, nomor_legalisir, tanggal_legalisir } = req.body;

  if (!nama || !nomor_legalisir || !tanggal_legalisir) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO legalisir (nama, nomor_legalisir, tanggal_legalisir) VALUES (?, ?, ?)`,
      [nama, nomor_legalisir, tanggal_legalisir]
    );

    res.status(201).json({
      message: 'Data legalisir berhasil ditambahkan',
      id: (result as any).insertId
    });
  } catch (err) {
    console.error('Error menambahkan data legalisir:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM legalisir ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data legalisir:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.get('/bulan/:tahun/:bulan', async (req: Request, res: Response) => {
  const { tahun, bulan } = req.params;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM legalisir WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? ORDER BY created_at DESC`,
      [tahun, bulan]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data per bulan:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM legalisir WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error mengambil data berdasarkan ID:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, nomor_legalisir, tanggal_legalisir } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE legalisir SET nama = ?, nomor_legalisir = ?, tanggal_legalisir = ? WHERE id = ?`,
      [nama, nomor_legalisir, tanggal_legalisir, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error('Error mengupdate data:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM legalisir WHERE id = ?`, [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus data:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

export default router;