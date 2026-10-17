// =========================================================================
// JASTIP PRO BACKEND (GOOGLE APPS SCRIPT)
// Pasang di Spreadsheet klien: Ekstensi > Apps Script > Tempel code ini
// =========================================================================
//
// Struktur Header Sheet "Order" (Urutan kolom BEBAS, otomatis terdeteksi):
// Nama Customer | No HP | Brand | Barang | Motif | Ukuran | Qty | Harga | Jastip | Status | Catatan | Resi | Ekspedisi | Ongkir | DP | Diskon | Tanggal
//
// CATATAN: Kolom-kolom baru bersifat opsional, jika tidak ada di sheet tidak akan error.

function norm(v) {
  var d = String(v || '').replace(/\D/g, '');
  if (d.indexOf('62') === 0) d = '0' + d.slice(2);
  else if (d && d.charAt(0) !== '0') d = '0' + d;
  return d;
}

// AMBIL INVOICE CUSTOMER (GET)
function doGet(e) {
  var hp = norm((e && e.parameter && e.parameter.hp) || '');
  var out = { ok: false };
  
  if (hp) {
    var sh = orderSheet_();
    var rows = sh.getDataRange().getValues();
    if (rows.length > 1) {
      var h = {};
      rows[0].forEach(function (name, i) { 
        h[String(name).trim()] = i; 
      });

      var items = [];
      var nama = '';
      var resi = '';
      var ekspedisi = '';
      var ongkir = 0;
      var dp = 0;
      var diskon = 0;
      var orderDate = '';

      for (var r = 1; r < rows.length; r++) {
        var row = rows[r];
        var rowHp = norm(row[h['No HP']]);
        if (rowHp !== hp) continue;

        if (!nama && h['Nama Customer'] !== undefined) nama = row[h['Nama Customer']];
        if (!resi && h['Resi'] !== undefined) resi = String(row[h['Resi']] || '').trim();
        if (!ekspedisi && h['Ekspedisi'] !== undefined) ekspedisi = String(row[h['Ekspedisi']] || '').trim();
        if (!ongkir && h['Ongkir'] !== undefined) ongkir = Number(row[h['Ongkir']]) || 0;
        if (!dp && h['DP'] !== undefined) dp = Number(row[h['DP']]) || 0;
        if (!diskon && h['Diskon'] !== undefined) diskon = Number(row[h['Diskon']]) || 0;
        if (!orderDate && h['Tanggal'] !== undefined && row[h['Tanggal']]) {
          orderDate = Utilities.formatDate(new Date(row[h['Tanggal']]), Session.getScriptTimeZone(), 'dd MMM yyyy');
        }

        items.push({
          brand: h['Brand'] !== undefined ? row[h['Brand']] : '',
          barang: h['Barang'] !== undefined ? row[h['Barang']] : '',
          motif: h['Motif'] !== undefined ? row[h['Motif']] : '',
          ukuran: h['Ukuran'] !== undefined ? row[h['Ukuran']] : '',
          qty: h['Qty'] !== undefined ? Number(row[h['Qty']]) || 1 : 1,
          harga: h['Harga'] !== undefined ? Number(row[h['Harga']]) || 0 : 0,
          jastip: h['Jastip'] !== undefined ? Number(row[h['Jastip']]) || 0 : 0,
          status: h['Status'] !== undefined ? (row[h['Status']] || 'Belum') : 'Belum',
          catatan: h['Catatan'] !== undefined ? row[h['Catatan']] : ''
        });
      }

      if (items.length) {
        out = {
          ok: true,
          nama: nama,
          items: items,
          resi: resi,
          ekspedisi: ekspedisi,
          ongkir: ongkir,
          dp: dp,
          diskon: diskon,
          orderDate: orderDate
        };
      }
    }
  }

  return json_(out);
}

// SIMPAN ORDER BARU DARI FORM TITIP (POST)
function doPost(e) {
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.website) return json_({ ok: true }); // Honeypot anti-spam
    
    var hp = norm(d.hp);
    var items = (d.items || []).slice(0, 50);
    var nama = String(d.nama || '').slice(0, 80).trim();
    var kota = String(d.kota || '').slice(0, 80).trim();

    if (hp.length < 9 || !nama || !items.length) return json_(out);

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    var sh = orderSheet_();
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (x) { 
      return String(x).trim(); 
    });

    var now = new Date();
    var rows = items.map(function (it) {
      var r = head.map(function () { return ''; });
      function put(k, v) { 
        var i = head.indexOf(k); 
        if (i > -1) r[i] = v; 
      }

      put('Nama Customer', nama);
      put('No HP', hp);
      put('Kota', kota);
      put('Brand', String(it.brand || '').slice(0, 60));
      put('Barang', String(it.barang || '').slice(0, 100));
      put('Motif', String(it.motif || '').slice(0, 60));
      put('Ukuran', String(it.ukuran || '').slice(0, 40));
      put('Qty', Number(it.qty || 1));
      put('Status', 'Belum');
      put('Catatan', String(it.catatan || '').slice(0, 200));
      put('Tanggal', now);
      return r;
    });

    var start = sh.getLastRow() + 1;
    var ci = head.indexOf('No HP') + 1;
    if (ci > 0) {
      sh.getRange(start, ci, rows.length, 1).setNumberFormat('@'); // Format string untuk nomor HP agar 0 di depan tidak hilang
    }
    sh.getRange(start, 1, rows.length, head.length).setValues(rows);

    lock.releaseLock();
    out = { ok: true };
  } catch (err) { 
    out = { ok: false, error: String(err) }; 
  }
  return json_(out);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function orderSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Order') || ss.getSheets()[0];
}

// FITUR BONUS: Setup otomatis header sheet dalam 1 klik
function setupSheetOtomatis() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Order');
  if (!sh) sh = ss.insertSheet('Order');

  var headers = [
    'Nama Customer', 'No HP', 'Brand', 'Barang', 'Motif', 'Ukuran', 'Qty', 
    'Harga', 'Jastip', 'Status', 'Catatan', 'Resi', 'Ekspedisi', 'Ongkir', 'DP', 'Diskon', 'Tanggal'
  ];

  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  SpreadsheetApp.flush();
}
