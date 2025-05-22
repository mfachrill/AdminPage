const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./db');
const bodyParser = require('body-parser');

app.use(expressLayouts);
app.set('layout', 'layout'); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    db.query(
        'SELECT produk.id, produk.nama, produk.harga, stok.jumlah AS stok FROM produk JOIN stok ON produk.id = stok.produk_id',
        (err, produk) => {
            if (err) throw err;
            res.render('index', { produk });
        }
    );
});


app.get('/pembelian', (req, res) => {
    db.query(
        'SELECT pembelian.*, produk.nama FROM pembelian JOIN produk ON pembelian.produk_id = produk.id',
        (err, pembelian) => {
            if (err) throw err;
            res.render('pembelian', { pembelian });
        }
    );
});


app.post('/beli', (req, res) => {
    const { produk_id, jumlah } = req.body;
    db.query('SELECT harga FROM produk WHERE id = ?', [produk_id], (err, results) => {
        if (err) throw err;
        const harga = results[0].harga;
        const total = harga * jumlah;

        db.query('INSERT INTO pembelian (produk_id, jumlah, total, status) VALUES (?, ?, ?, "berhasil")', [produk_id, jumlah, total], (err) => {
            if (err) throw err;
            db.query('UPDATE stok SET jumlah = jumlah - ? WHERE produk_id = ?', [jumlah, produk_id], (err) => {
                if (err) throw err;
                res.redirect('/');
            });
        });
    });
});


app.post('/cancel/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM pembelian WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        const pembelian = results[0];
        db.query('UPDATE pembelian SET status = "dibatalkan" WHERE id = ?', [id], (err) => {
            if (err) throw err;
            db.query('UPDATE stok SET jumlah = jumlah + ? WHERE produk_id = ?', [pembelian.jumlah, pembelian.produk_id], (err) => {
                if (err) throw err;
                res.redirect('/pembelian');
            });
        });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
