import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mysql from 'mysql2/promise'

import userRoutes from './routes/userRoutes'
import rekomendasiRoutes from './routes/rekomendasiRoutes'
import legalisirRoutes from './routes/legalisirRoutes'
import agendaSuratMasukRoutes from './routes/agendaSuratMasukRoutes'
import agendaSuratKeluarRoutes from './routes/agendaSuratKeluarRoutes'
import pendaftaranNikahRoutes from './routes/pendaftaranNikahRoutes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kua_system',
  port: Number(process.env.DB_PORT) || 3306,
})

;(async () => {
  try {
    const conn = await db.getConnection()
    console.log('Terhubung ke MySQL Database')
    console.log('Database yang digunakan:', process.env.DB_NAME)
    conn.release()
  } catch (err) {
    console.error('Gagal terhubung ke Database:', err)
    process.exit(1) // stop server jika DB gagal
  }
})()

// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('KUA Backend berjalan dengan baik')
})

app.use('/api/users', userRoutes)
app.use('/api/rekomendasi', rekomendasiRoutes)
app.use('/api/legalisir', legalisirRoutes)
app.use('/api/agenda-surat-masuk', agendaSuratMasukRoutes)
app.use('/api/agenda-surat-keluar', agendaSuratKeluarRoutes)
app.use('/api/pendaftaran-nikah', pendaftaranNikahRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})