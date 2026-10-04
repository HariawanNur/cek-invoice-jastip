// Tempel di Google Sheet milik klien: Extensions > Apps Script.
// Sheet bernama "Order" dengan baris 1 sebagai header (urutan bebas, kolom Catatan & Tanggal opsional):
// Nama Customer | No HP | Brand | Barang | Motif | Harga | Jastip | Status | Catatan | Tanggal
// Setiap BARIS = satu barang. Nama + No HP diisi di setiap barisnya.

function norm(v) {
  var d = String(v).replace(/\D/g, '');
  if (d.indexOf('62') === 0) d = '0' + d.slice(2);
  else if (d && d.charAt(0) !== '0') d = '0' + d;
  return d;
}

function doGet(e) {
  var hp = norm((e && e.parameter && e.parameter.hp) || '');
  var out = { ok: false };
  if (hp) {
    var rows = orderSheet_().getDataRange().getValues();
    var h = {};
    rows[0].forEach(function (name, i) { h[String(name).trim()] = i; });
    var items = [], nama = '';
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      if (norm(row[h['No HP']]) !== hp) continue;
      nama = row[h['Nama Customer']];
      items.push({
        brand: row[h['Brand']], barang: row[h['Barang']], motif: row[h['Motif']],
        harga: Number(row[h['Harga']]) || 0, jastip: Number(row[h['Jastip']]) || 0,
        status: row[h['Status']] || 'Belum'
      });
    }
    if (items.length) out = { ok: true, nama: nama, items: items };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

// Terima order dari form customer. Tiap barang jadi satu baris baru.
// Harga & Jastip dikosongkan (klien yang isi), Status otomatis "Belum".
function doPost(e) {
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.website) return json_({ ok: true }); // honeypot: bot diam-diam diabaikan
    var hp = norm(d.hp);
    var items = (d.items || []).slice(0, 30);
    var nama = String(d.nama || '').slice(0, 80).trim();
    if (hp.length < 9 || !nama || !items.length) return json_(out);

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    var sh = orderSheet_();
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (x) { return String(x).trim(); });
    var rows = items.map(function (it) {
      var r = head.map(function () { return ''; });
      function put(k, v) { var i = head.indexOf(k); if (i > -1) r[i] = v; }
      put('Nama Customer', nama); put('No HP', hp);
      put('Brand', String(it.brand || '').slice(0, 60)); put('Barang', String(it.barang || '').slice(0, 100));
      put('Motif', String(it.motif || '').slice(0, 60)); put('Status', 'Belum');
      put('Catatan', String(it.catatan || '').slice(0, 200)); put('Tanggal', new Date());
      return r;
    });
    var start = sh.getLastRow() + 1;
    var ci = head.indexOf('No HP') + 1;
    sh.getRange(start, ci, rows.length, 1).setNumberFormat('@'); // jaga angka 0 di depan nomor HP
    sh.getRange(start, 1, rows.length, head.length).setValues(rows);
    lock.releaseLock();
    out = { ok: true };
  } catch (err) { out = { ok: false }; }
  return json_(out);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Pakai tab bernama "Order"; kalau tidak ada, pakai tab pertama.
function orderSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Order') || ss.getSheets()[0];
}
