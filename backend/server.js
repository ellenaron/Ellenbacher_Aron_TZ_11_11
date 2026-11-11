import express from 'express';
import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || '3306',
});

app.get('/', (req, res) => {
    return res.status(200).json({ Hello: 'World!' });
});

app.get('/szolgaltatasok', (req, res) => {
    let sql =
        'SELECT s.*, k.nev as kategoria_nev FROM szolgaltatasok s INNER JOIN kategoriak k ON s.kategoria_id = k.id';
    pool.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ hiba: 'Hiba lépett fel a lekérdezéskor' });
            console.log(err);
            return;
        }

        return res.status(200).json(rows);
    });
});

app.get('/szolgaltatasok/elerheto', (req, res) => {
    let sql =
        'SELECT * FROM szolgaltatasok WHERE aktiv = 1 AND munkaido_perc <= 60';
    pool.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ hiba: 'Hiba lépett fel a lekérdezéskor' });
            console.log(err);
            return;
        }

        return res.status(200).json(rows);
    });
});

app.get('/szolgaltatasok/kereses/:szoveg', (req, res) => {
    const szoveg = req.params.szoveg;

    let sql =
        'SELECT * FROM szolgaltatasok WHERE megnevezes LIKE ?';
    pool.query(sql, [`%${szoveg}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ hiba: 'Hiba lépett fel a lekérdezéskor' });
            console.log(err);
            return;
        }

        return res.status(200).json(rows);
    });
});

app.get('/kategoriak/statisztika', (req, res) => {
    let sql =
        'SELECT k.nev AS kategoria_nev, COUNT(s.id) AS szolgaltatasok_szama, AVG(s.alapar) AS atlagos_alapat FROM kategoriak k INNER JOIN szolgaltatasok s ON k.id = s.kategoria_id GROUP BY k.nev';
    pool.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ hiba: 'Hiba lépett fel a lekérdezéskor' });
            console.log(err);
            return;
        }

        return res.status(200).json(rows);
    });
});

app.get('/szolgaltatasok/dragak', (req, res) => {
    let sql =
        'SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE alapar > 25000 ORDER BY munkaido_perc DESC';
    pool.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ hiba: 'Hiba lépett fel a lekérdezéskor' });
            console.log(err);
            return;
        }

        return res.status(200).json(rows);
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`);
});
