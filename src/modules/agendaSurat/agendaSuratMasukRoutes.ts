import { Router, Request, Response } from 'express';
import { db } from '../index';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM agenda_surat_masuk ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data surat masuk:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data surat masuk' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { nama_pengirim, nomor_surat, tanggal_surat, hal } = req.body;

  if (!nama_pengirim || !nomor_surat || !tanggal_surat || !hal) {
    return res.status(400).json({ message: 'Field wajib belum diisi' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO agenda_surat_masuk (nama_pengirim, nomor_surat, tanggal_surat, hal) 
       VALUES (?, ?, ?, ?)`,
      [nama_pengirim, nomor_surat, tanggal_surat, hal]
    );

    res.status(201).json({
      message: 'Surat masuk berhasil ditambahkan',
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error('Error menambahkan surat masuk:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan surat masuk' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama_pengirim, nomor_surat, tanggal_surat, hal } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE agenda_surat_masuk 
       SET nama_pengirim=?, nomor_surat=?, tanggal_surat=?, hal=? 
       WHERE id=?`,
      [nama_pengirim, nomor_surat, tanggal_surat, hal, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data surat masuk tidak ditemukan' });
    }

    res.json({ message: 'Surat masuk berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit surat masuk:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengedit surat masuk' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM agenda_surat_masuk WHERE id=?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Data surat masuk tidak ditemukan' });
    }

    res.json({ message: 'Surat masuk berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus surat masuk:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus surat masuk' });
  }
});

export default router;