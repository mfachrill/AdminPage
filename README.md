🛒 Admin Toko - Express.js + MySQL

Sistem admin toko sederhana untuk mengelola pembelian dan stok produk.

 ✨ Fitur

- Tampilkan daftar produk dan stok
- Input pembelian produk (otomatis kurangi stok)
- Cancel pembelian (otomatis tambah stok)
- Status pembelian: berhasil atau dibatalkan
- Tampilan clean dengan Bootstrap 5 (responsive)
- Template menggunakan `EJS + express-ejs-layouts`

 🧰 Teknologi

- Node.js + Express.js
- MySQL (dengan `mysql2`)
- EJS + Bootstrap 5
- Express EJS Layouts

---

🚀 Instalasi

1. Clone Rep

bash
git clone https://github.com/username/admin-toko.git
cd admin-toko

2. Install Depedencies
npm install

3. Setup Database
   
CREATE DATABASE toko;

USE toko;

CREATE TABLE produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  harga INT
);

CREATE TABLE stok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produk_id INT,
  jumlah INT,
  FOREIGN KEY (produk_id) REFERENCES produk(id)
);

CREATE TABLE pembelian (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produk_id INT,
  jumlah INT,
  total INT,
  status ENUM('berhasil', 'dibatalkan') DEFAULT 'berhasil',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produk_id) REFERENCES produk(id)
);

4. Konfigurasi Database
  edit di file db.js

const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko'
});
conn.connect(err => {
    if (err) throw err;
    console.log('Connected to DB');
});
module.exports = conn;

5. jalankan Aplikasinya
  node app.js
