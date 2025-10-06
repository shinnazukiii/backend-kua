import { Router, Request, Response } from 'express';
import { db } from '../index';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM agenda_surat_keluar ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data surat keluar:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data surat keluar' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { tanggal_surat, nomor_surat, tujuan_surat, keterangan } = req.body;

  if (!tanggal_surat || !nomor_surat || !tujuan_surat) {
    return res.status(400).json({ message: 'Field wajib belum diisi' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO agenda_surat_keluar (tanggal_surat, nomor_surat, tujuan_surat, keterangan)
       VALUES (?, ?, ?, ?)`,
      [tanggal_surat, nomor_surat, tujuan_surat, keterangan]
    );

    res.status(201).json({
      message: 'Surat keluar berhasil ditambahkan',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error menambahkan surat keluar:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan surat keluar' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tanggal_surat, nomor_surat, tujuan_surat, keterangan } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE agenda_surat_keluar 
       SET tanggal_surat=?, nomor_surat=?, tujuan_surat=?, keterangan=? 
       WHERE id=?`,
      [tanggal_surat, nomor_surat, tujuan_surat, keterangan, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data surat keluar tidak ditemukan' });
    }

    res.json({ message: 'Surat keluar berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit surat keluar:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengedit surat keluar' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM agenda_surat_keluar WHERE id=?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data surat keluar tidak ditemukan' });
    }

    res.json({ message: 'Surat keluar berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus surat keluar:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus surat keluar' });
  }
});

export default router;