"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const promise_1 = __importDefault(require("mysql2/promise"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const rekomendasiRoutes_1 = __importDefault(require("./routes/rekomendasiRoutes"));
const legalisirRoutes_1 = __importDefault(require("./routes/legalisirRoutes"));
const agendaSuratMasukRoutes_1 = __importDefault(require("./routes/agendaSuratMasukRoutes"));
const agendaSuratKeluarRoutes_1 = __importDefault(require("./routes/agendaSuratKeluarRoutes"));
const pendaftaranNikahRoutes_1 = __importDefault(require("./routes/pendaftaranNikahRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
exports.db = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kua_system',
    port: Number(process.env.DB_PORT) || 3306,
});
(async () => {
    try {
        const conn = await exports.db.getConnection();
        console.log('Terhubung ke MySQL Database');
        console.log('Database yang digunakan:', process.env.DB_NAME);
        conn.release();
    }
    catch (err) {
        console.error('Gagal terhubung ke Database:', err);
        process.exit(1); // stop server jika DB gagal
    }
})();
// Base route
app.get('/', (req, res) => {
    res.send('KUA Backend berjalan dengan baik');
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/rekomendasi', rekomendasiRoutes_1.default);
app.use('/api/legalisir', legalisirRoutes_1.default);
app.use('/api/agenda-surat-masuk', agendaSuratMasukRoutes_1.default);
app.use('/api/agenda-surat-keluar', agendaSuratKeluarRoutes_1.default);
app.use('/api/pendaftaran-nikah', pendaftaranNikahRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
