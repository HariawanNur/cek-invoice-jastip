# Cek Invoice Jastip (React + Vite)

Jalankan: `npm install` lalu `npm run dev`. Build: `npm run build` (hasil di dist/).

## Cara kerja
1. Klien input order di Google Sheet miliknya, tab "Order". Satu baris = satu barang.
   Kolom: Nama Customer | No HP | Brand | Barang | Motif | Harga | Jastip | Status | Catatan | Tanggal
   Status diisi "Lunas" atau "Belum". Customer A dan B dibedakan dari kolom No HP.
2. Apps Script (apps-script/Code.gs) membaca sheet itu dan hanya mengembalikan baris milik nomor yang diketik.
   Sheet tetap privat, tidak perlu dipublish.
3. Halaman ini memanggil Apps Script lewat API_URL di src/config.js.

## Alur order
Customer buka satu link, tab Pesan: isi nama, nomor HP, dan barang. Order masuk ke sheet sebagai baris baru (Status "Belum").
Klien cukup mengisi kolom Harga dan Jastip. Setelah terisi, customer cek invoice dengan nomor HP, atau tekan tombol Cek invoice setelah kirim order.
Sebelum harga terisi, invoice menampilkan "Menunggu harga".

## Pasang
1. Buka Google Sheet klien, Extensions > Apps Script, tempel isi apps-script/Code.gs.
2. Deploy > New deployment (setiap ubah Code.gs, deploy ulang sebagai versi baru) > Web app. Execute as: Me. Who has access: Anyone. Salin URL-nya.
3. Isi API_URL dan ADMIN_WA di src/config.js. Kosongkan API_URL untuk mode demo.
4. npm run build, lalu upload isi dist/ ke hosting.

## Fitur share
- "Bagikan link halaman ini": share satu link ke semua customer (WA / share sheet HP).
- "Bagikan invoice ke WA": kirim ringkasan invoice satu customer lewat WA.
- "Tanya admin": buka chat WA ke ADMIN_WA.
