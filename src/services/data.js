import { API_URL, BUSINESS_PRESETS } from '../config'

// Dataset Demo Terpadu untuk Setiap Jenis Bisnis (Sangat Kuat untuk Presentasi Jualan)
export const MULTI_BUSINESS_DEMO = {
  olshop: {
    '081200000001': {
      nama: 'Siti Rahmawati',
      stage: 'packing',
      stageLabel: 'Pesanan Sedang Dikemas & QC Gudang',
      orderDate: '16 Okt 2026',
      ongkir: 15000,
      diskon: 20000,
      dp: 150000,
      resi: '',
      ekspedisi: 'SiCepat Reguler',
      items: [
        { brand: 'Lumina', barang: 'Kemeja Linen Oversized', motif: 'Sage Green', ukuran: 'L', harga: 145000, jastip: 0, status: 'Belum', catatan: 'Minta plastik ziplock rapi' },
        { brand: 'Lumina', barang: 'Celana Kulot Highwaist', motif: 'Broken White', ukuran: 'All Size', harga: 160000, jastip: 0, status: 'Belum', catatan: '' }
      ]
    },
    '081200000002': {
      nama: 'Rian Pratama',
      stage: 'shipped',
      stageLabel: 'Paket Sedang Dalam Perjalanan Kurir',
      orderDate: '15 Okt 2026',
      ongkir: 0,
      diskon: 15000,
      dp: 380000,
      resi: '003928174912',
      ekspedisi: 'J&T Express',
      items: [
        { brand: 'Footwear Co', barang: 'Sneakers Canvas Low Vulcanized', motif: 'Black White', ukuran: '42', harga: 320000, jastip: 0, status: 'Lunas', catatan: 'Double box packing' },
        { brand: 'Basic Wear', barang: 'Kaos Polos Heavyweight 24s', motif: 'Navy Blue', ukuran: 'XL', harga: 75000, jastip: 0, status: 'Lunas', catatan: '' }
      ]
    },
    '081200000003': {
      nama: 'Dini Anggraini',
      stage: 'hunting',
      stageLabel: 'Menunggu Verifikasi Pembayaran & Cek Stok',
      orderDate: '17 Okt 2026',
      ongkir: 12000,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'JNE Reguler',
      items: [
        { brand: 'Lumina Bag', barang: 'Tas Selempang Kulit Sintetis Vintage', motif: 'Caramel Brown', ukuran: 'Medium', harga: 0, jastip: 0, status: 'Belum', catatan: 'Konfirmasi ketersediaan warna' }
      ]
    }
  },

  servis: {
    '081200000001': {
      nama: 'Mas Farhan Alamsyah',
      stage: 'packing',
      stageLabel: 'Sedang Dikerjakan Teknisi di Workshop',
      orderDate: '16 Okt 2026',
      ongkir: 0,
      diskon: 50000,
      dp: 500000,
      resi: '',
      ekspedisi: 'Ambil di Workshop',
      items: [
        { brand: 'Apple', barang: 'Ganti LCD OLED Original iPhone 13 Pro', motif: 'Layar Garis Hijau & Sentuh Error', ukuran: 'Unit iPhone Only', harga: 1250000, jastip: 100000, status: 'Belum', catatan: 'Garansi 60 hari LCD' },
        { brand: 'Apple', barang: 'Jasa Pemasangan & Water Resistance Seal', motif: 'Seal Baru', ukuran: 'Standard', harga: 50000, jastip: 0, status: 'Belum', catatan: 'Tes Face ID & TrueTone' }
      ]
    },
    '081200000002': {
      nama: 'Mbak Linda Wijaya',
      stage: 'shipped',
      stageLabel: 'Servis Selesai & Lolos Quality Control (QC)',
      orderDate: '15 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 900000,
      resi: 'PICKUP-SRV-049',
      ekspedisi: 'Siap Diambil di Workshop',
      items: [
        { brand: 'Apple', barang: 'Ganti Baterai Original MacBook Air M1', motif: 'Status Service Battery', ukuran: 'Unit + Charger', harga: 850000, jastip: 50000, status: 'Lunas', catatan: 'Battery Health 100% Baru' }
      ]
    },
    '081200000003': {
      nama: 'Pak Hendra Gunawan',
      stage: 'hunting',
      stageLabel: 'Diagnosa Kerusakan Motherboard / IC Power',
      orderDate: '17 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'Workshop iFixit',
      items: [
        { brand: 'Asus ROG', barang: 'Reparasi Laptop Asus ROG Strix G15', motif: 'Mati Total Kena Tumpahan Air', ukuran: 'Unit Lengkap Dus', harga: 0, jastip: 0, status: 'Belum', catatan: 'Periksa jalur short motherboard' }
      ]
    }
  },

  kuliner: {
    '081200000001': {
      nama: 'Ibu Maya Hartono (PT Graha Abadi)',
      stage: 'packing',
      stageLabel: 'Sedang Dimasak & Dikemas di Dapur',
      orderDate: '17 Okt 2026',
      ongkir: 0,
      diskon: 35000,
      dp: 500000,
      resi: '',
      ekspedisi: 'Ambil di Dapur Rasa',
      items: [
        { brand: 'Dapur Rasa', barang: 'Paket Nasi Liwet Ayam Bakar Madu (30 Box)', motif: 'Level Pedas Sedang', ukuran: '30 Box', harga: 750000, jastip: 0, status: 'Belum', catatan: 'Ambil jam 11:30 siang untuk meeting kantor' },
        { brand: 'Dapur Rasa', barang: 'Snack Box Pastel & Lemper Ayam (30 Box)', motif: 'Dus Kraft Eksklusif', ukuran: '30 Box', harga: 240000, jastip: 0, status: 'Belum', catatan: 'Sudah termasuk air mineral cup' }
      ]
    },
    '081200000002': {
      nama: 'Pak Dedi Kurniawan',
      stage: 'shipped',
      stageLabel: 'Pesanan Selesai Dikemas & Siap Diambil',
      orderDate: '17 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 525000,
      resi: 'PICKUP-DPR-892',
      ekspedisi: 'Siap Diambil di Toko',
      items: [
        { brand: 'Dapur Rasa', barang: 'Tumpeng Mini Nusantara Spesial (15 Porsi)', motif: 'Ayam Suwir & Telur Balado', ukuran: '15 Mika', harga: 525000, jastip: 0, status: 'Lunas', catatan: 'Pita ucapan selamat ulang tahun' }
      ]
    },
    '081200000003': {
      nama: 'Bunda Rara',
      stage: 'hunting',
      stageLabel: 'Menunggu Konfirmasi Desain Kue & Tanggal Acara',
      orderDate: '17 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'Ambil di Toko',
      items: [
        { brand: 'Cake Studio', barang: 'Korean Bento Cake Diameter 16cm', motif: 'Custom Lukis Foto & Lilin Angka', ukuran: '16cm', harga: 0, jastip: 0, status: 'Belum', catatan: 'Ambil tanggal 20 Oktober sore' }
      ]
    }
  },

  percetakan: {
    '081200000001': {
      nama: 'Komunitas Honda Bekasi (Bro Dimas)',
      stage: 'packing',
      stageLabel: 'Proses Sablon DTF & Heatpress di Bengkel',
      orderDate: '16 Okt 2026',
      ongkir: 45000,
      diskon: 100000,
      dp: 2000000,
      resi: '',
      ekspedisi: 'J&T Cargo',
      items: [
        { brand: 'Creative Print', barang: 'Kaos Cotton Combed 30s Sablon DTF (50 Pcs)', motif: 'Warna Hitam Solid', ukuran: 'M:15, L:20, XL:15', harga: 3250000, jastip: 0, status: 'Belum', catatan: 'Sablon depan dada A5 + belakang A3' },
        { brand: 'Creative Print', barang: 'Jasa Setting Vector & Mockup Desain', motif: 'Revisi ACC ke-2', ukuran: 'File AI/PDF', harga: 50000, jastip: 0, status: 'Belum', catatan: 'Free mockup sample' }
      ]
    },
    '081200000002': {
      nama: 'Toko Berkah Mandiri',
      stage: 'shipped',
      stageLabel: 'Pesanan Selesai Cetak & Dikirim via Cargo',
      orderDate: '15 Okt 2026',
      ongkir: 25000,
      diskon: 0,
      dp: 450000,
      resi: 'DKT-882910291',
      ekspedisi: 'Dakota Cargo',
      items: [
        { brand: 'Creative Print', barang: 'Banner Spanduk Flexi Korea 340gr (3x1m)', motif: 'Finishing Mata Ayam 4 Sudut', ukuran: '3x1 Meter', harga: 75000, jastip: 0, status: 'Lunas', catatan: 'Warna tajam outdoor' },
        { brand: 'Creative Print', barang: 'Cetak Brosur Full Color Art Paper 150gr', motif: 'Lipat 3 (Tri-Fold)', ukuran: '1 Rim (500 Lembar)', harga: 350000, jastip: 0, status: 'Lunas', catatan: 'Kemas box rapi' }
      ]
    },
    '081200000003': {
      nama: 'Wedding Organizer Harmony',
      stage: 'hunting',
      stageLabel: 'Menunggu Proofing Warna Sample Kertas Undangan',
      orderDate: '17 Okt 2026',
      ongkir: 50000,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'Kargo',
      items: [
        { brand: 'Creative Print', barang: 'Undangan Hardcover Foil Emas Emboss (300 Pcs)', motif: 'Jasmine Paper Cream', ukuran: 'Lipat 2 Hard', harga: 0, jastip: 0, status: 'Belum', catatan: 'Deadline cetak 28 Oktober' }
      ]
    }
  },

  jasa: {
    '081200000001': {
      nama: 'PT Maju Sinergi Abadi',
      stage: 'packing',
      stageLabel: 'Tahap Review & Sesi Revisi Draft Klien',
      orderDate: '15 Okt 2026',
      ongkir: 0,
      diskon: 250000,
      dp: 2000000,
      resi: '',
      ekspedisi: 'Serah Terima Digital (Cloud)',
      items: [
        { brand: 'PixelCraft', barang: 'Paket Pembuatan Website Company Profile Responsive', motif: 'Domain .COM + Hosting Cloud 1 Tahun', ukuran: '5 Halaman Utama', harga: 3500000, jastip: 0, status: 'Belum', catatan: 'Termasuk SEO on-page dasar' },
        { brand: 'PixelCraft', barang: 'Integrasi WhatsApp Auto-Reply & Form Leads', motif: 'API Direct Chat', ukuran: '1 Nomor WA', harga: 500000, jastip: 0, status: 'Belum', catatan: 'Koneksi ke spreadsheet' }
      ]
    },
    '081200000002': {
      nama: 'dr. Sarah Aesthetic Clinic',
      stage: 'shipped',
      stageLabel: 'File Final Master Desain Diserahkan 100%',
      orderDate: '14 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 1500000,
      resi: 'GDrive-SRH-771',
      ekspedisi: 'Google Drive Akses Penuh',
      items: [
        { brand: 'PixelCraft', barang: 'Branding Identity & Desain Logo Vector Premium', motif: 'Color Palette & Typography Guide', ukuran: 'File AI, EPS, SVG, PNG', harga: 1500000, jastip: 0, status: 'Lunas', catatan: 'Hak cipta penuh milik klien' }
      ]
    },
    '081200000003': {
      nama: 'Klinik Sehat Bersama',
      stage: 'hunting',
      stageLabel: 'Penyusunan Kontrak Kerja & Timeline Proyek',
      orderDate: '17 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'Online Service',
      items: [
        { brand: 'PixelCraft', barang: 'Jasa Kelola Feed & Reels Instagram Bisnis 1 Bulan', motif: '15 Post Feed + 8 Reels Video', ukuran: '30 Hari Kontrak', harga: 0, jastip: 0, status: 'Belum', catatan: 'Target publish awal bulan depan' }
      ]
    }
  },

  jastip: {
    '081200000001': {
      nama: 'Bunda Sari Melati',
      stage: 'packing',
      stageLabel: 'Barang Tiba di Gudang & Sedang Dipacking',
      orderDate: '15 Okt 2026',
      ongkir: 18000,
      diskon: 15000,
      dp: 400000,
      resi: '',
      ekspedisi: 'SiCepat Express',
      items: [
        { brand: 'Gentle Woman', barang: 'Canvas Tote Bag Original', motif: 'Cream White Limited', ukuran: 'Standard', harga: 385000, jastip: 35000, status: 'Belum', catatan: 'Minta paperbag toko ya kak' },
        { brand: 'ChaTraMue', barang: 'Thai Tea Gold Tin 400g', motif: 'Original Leaf', ukuran: '400g', harga: 85000, jastip: 15000, status: 'Belum', catatan: 'Expired masih lama' },
        { brand: 'Butterbear', barang: 'Plush Keychain Mascot', motif: 'Yellow Apron', ukuran: 'Mini', harga: 290000, jastip: 25000, status: 'Belum', catatan: 'Kalau kosong kabari via WA' }
      ]
    },
    '081200000002': {
      nama: 'Bunda Dewi Kartika',
      stage: 'shipped',
      stageLabel: 'Paket Sedang Dalam Pengiriman Ekspedisi',
      orderDate: '14 Okt 2026',
      ongkir: 0,
      diskon: 0,
      dp: 2170000,
      resi: '003928174912',
      ekspedisi: 'J&T Express',
      items: [
        { brand: 'Lululemon', barang: 'Align High-Rise Pant 25"', motif: 'Black', ukuran: 'Size 4', harga: 1450000, jastip: 120000, status: 'Lunas', catatan: 'Receipt store disertakan' },
        { brand: 'Pop Mart', barang: 'Labubu The Monsters Vinyl', motif: 'Random Blindbox', ukuran: 'Box', harga: 550000, jastip: 50000, status: 'Lunas', catatan: 'Box segel rapi' }
      ]
    },
    '081200000003': {
      nama: 'Kak Jessica Stephanie',
      stage: 'hunting',
      stageLabel: 'Tim Sedang Belanja / Cek Stok di Store Bangkok',
      orderDate: '16 Okt 2026',
      ongkir: 22000,
      diskon: 0,
      dp: 0,
      resi: '',
      ekspedisi: 'SiCepat Best',
      items: [
        { brand: 'Care Bears', barang: 'Bangkok Edition 25cm Plush', motif: 'Rainbow Heart', ukuran: '25cm', harga: 0, jastip: 40000, status: 'Belum', catatan: 'Kalau rainbow habis ganti lilac' },
        { brand: 'Holiday Pastry', barang: 'Signature Butter Cookies', motif: 'Gift Box 12pcs', ukuran: 'Box', harga: 0, jastip: 30000, status: 'Belum', catatan: 'Bungkus bubble wrap ekstra' }
      ]
    }
  }
}

export const MODE_DEMO = !API_URL

// Helper nomor contoh berdasarkan tipe bisnis aktif
export function getContohNomor(businessType = 'olshop') {
  return [
    { no: '081200000001', label: 'Belum Lunas (Ada DP)', badge: 'DP Terbayar' },
    { no: '081200000002', label: 'Lunas Penuh', badge: 'Lunas (Paid)' },
    { no: '081200000003', label: 'Menunggu Estimasi Biaya', badge: 'Tahap Review' }
  ]
}

export function normalisasiHp(input) {
  let d = String(input || '').replace(/\D/g, '')
  if (d.startsWith('62')) d = '0' + d.slice(2)
  else if (d && !d.startsWith('0')) d = '0' + d
  return d
}

export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

const STORAGE_KEY_SAVED = 'portal_saved_phone'
const STORAGE_KEY_RECENT = 'portal_recent_phones'
const STORAGE_KEY_BIZ = 'portal_business_type'
const STORAGE_KEY_SHIPPING = 'portal_has_shipping'

export function getActiveBusinessType() {
  try {
    return localStorage.getItem(STORAGE_KEY_BIZ) || 'olshop'
  } catch {
    return 'olshop'
  }
}

export function setActiveBusinessType(type) {
  try {
    localStorage.setItem(STORAGE_KEY_BIZ, type)
  } catch {
    // ignore
  }
}

export function getShippingPreference(businessType = 'olshop') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHIPPING)
    if (raw !== null) return raw === 'true'
  } catch {
    // ignore
  }
  return BUSINESS_PRESETS[businessType]?.hasShipping ?? true
}

export function setShippingPreference(val) {
  try {
    localStorage.setItem(STORAGE_KEY_SHIPPING, String(val))
  } catch {
    // ignore
  }
}

export function getSavedPhone() {
  try {
    return localStorage.getItem(STORAGE_KEY_SAVED) || ''
  } catch {
    return ''
  }
}

export function setSavedPhone(hp) {
  try {
    if (hp) localStorage.setItem(STORAGE_KEY_SAVED, hp)
    else localStorage.removeItem(STORAGE_KEY_SAVED)
  } catch {
    // ignore
  }
}

export function getRecentPhones() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecentPhone(hp) {
  if (!hp || hp.length < 9) return
  try {
    const list = getRecentPhones().filter(n => n !== hp)
    list.unshift(hp)
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(list.slice(0, 5)))
  } catch {
    // ignore
  }
}

const ORDERS_STORAGE_PREFIX = 'portal_orders_'
const ADMIN_PIN_KEY = 'portal_admin_pin'

export function getAdminPin() {
  try {
    return localStorage.getItem(ADMIN_PIN_KEY) || '1234'
  } catch {
    return '1234'
  }
}

export function setAdminPin(newPin) {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, String(newPin || '1234').trim())
    return true
  } catch {
    return false
  }
}

export function getStoredOrders(businessType = 'olshop') {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_PREFIX + businessType)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error reading stored orders:', err)
  }
  const defaultOrders = MULTI_BUSINESS_DEMO[businessType] || MULTI_BUSINESS_DEMO.olshop
  return JSON.parse(JSON.stringify(defaultOrders))
}

export function saveStoredOrders(businessType, orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_PREFIX + businessType, JSON.stringify(orders))
  } catch (err) {
    console.warn('Error saving orders:', err)
  }
}

export function resetStoredOrders(businessType = 'olshop') {
  try {
    localStorage.removeItem(ORDERS_STORAGE_PREFIX + businessType)
  } catch {}
  return JSON.parse(JSON.stringify(MULTI_BUSINESS_DEMO[businessType] || MULTI_BUSINESS_DEMO.olshop))
}

// Ambil semua daftar pesanan untuk Admin Dashboard
export function getAllOrders(businessType = 'olshop', hasShipping = true) {
  const ordersMap = getStoredOrders(businessType)
  const list = []

  for (const [hp, rawData] of Object.entries(ordersMap)) {
    if (!rawData || !rawData.items) continue
    const items = rawData.items || []
    const subtotal = items.reduce((s, i) => s + Number(i.harga || 0), 0)
    const fee = items.reduce((s, i) => s + Number(i.jastip || 0), 0)
    const ongkir = hasShipping ? Number(rawData.ongkir || 0) : 0
    const diskon = Number(rawData.diskon || 0)
    const total = Math.max(0, subtotal + fee + ongkir - diskon)
    const dp = Number(rawData.dp || 0)
    const sisa = Math.max(0, total - dp)
    const pending = items.some((i) => !Number(i.harga))
    const allStatusLunas = items.every((i) => String(i.status || '').trim().toLowerCase() === 'lunas')
    const lunas = !pending && (sisa === 0 || allStatusLunas)
    const resi = rawData.resi || ''
    const ekspedisi = rawData.ekspedisi || 'Kurir Ekspedisi'
    const orderDate = rawData.orderDate || '17 Okt 2026'
    let stage = rawData.stage || (lunas && resi ? 'shipped' : lunas ? 'packing' : dp > 0 ? 'packing' : 'received')

    list.push({
      hp,
      nama: rawData.nama || 'Customer',
      items,
      subtotal,
      fee,
      ongkir,
      diskon,
      total,
      dp,
      sisa,
      lunas,
      pending,
      stage,
      stageLabel: rawData.stageLabel || '',
      resi,
      ekspedisi,
      orderDate
    })
  }

  // Urutkan yang terbaru di atas
  return list.reverse()
}

// Update order oleh admin
export function updateOrderAdmin(businessType, hp, updates) {
  const orders = getStoredOrders(businessType)
  if (!orders[hp]) return false

  orders[hp] = {
    ...orders[hp],
    ...updates
  }

  saveStoredOrders(businessType, orders)
  return orders[hp]
}

// Tambah order manual oleh admin
export function createOrderAdmin(businessType, hp, orderData) {
  const orders = getStoredOrders(businessType)
  const cleanHp = normalisasiHp(hp)
  if (!cleanHp) return false

  orders[cleanHp] = {
    nama: orderData.nama || 'Customer Baru',
    stage: orderData.stage || 'received',
    stageLabel: orderData.stageLabel || 'Pesanan Diterima',
    orderDate: orderData.orderDate || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    ongkir: Number(orderData.ongkir || 0),
    diskon: Number(orderData.diskon || 0),
    dp: Number(orderData.dp || 0),
    resi: orderData.resi || '',
    ekspedisi: orderData.ekspedisi || 'Kurir Ekspedisi',
    items: orderData.items || []
  }

  saveStoredOrders(businessType, orders)
  saveRecentPhone(cleanHp)
  return orders[cleanHp]
}

// Hapus order oleh admin
export function deleteOrderAdmin(businessType, hp) {
  const orders = getStoredOrders(businessType)
  if (!orders[hp]) return false
  delete orders[hp]
  saveStoredOrders(businessType, orders)
  return true
}

// Ambil data invoice customer (dari Google Sheets API atau Local/Demo Database)
export async function findCustomer(hp, businessType = 'olshop', hasShipping = true) {
  let rawData = null
  const currentOrders = getStoredOrders(businessType)

  if (MODE_DEMO) {
    rawData = currentOrders[hp] ? JSON.parse(JSON.stringify(currentOrders[hp])) : null
  } else {
    try {
      const res = await fetch(`${API_URL}?hp=${encodeURIComponent(hp)}`)
      const json = await res.json()
      rawData = json.ok ? json : null
    } catch (err) {
      console.warn('API fetch failed, falling back to current demo dataset:', err)
      if (currentOrders[hp]) rawData = JSON.parse(JSON.stringify(currentOrders[hp]))
    }
  }

  if (!rawData || !rawData.items?.length) return null

  saveRecentPhone(hp)

  const items = rawData.items
  const subtotal = items.reduce((s, i) => s + Number(i.harga || 0), 0)
  const fee = items.reduce((s, i) => s + Number(i.jastip || 0), 0)
  
  // Jika pengiriman non-aktif, ongkir selalu 0
  const ongkir = hasShipping ? Number(rawData.ongkir || items.find(i => i.ongkir)?.ongkir || 0) : 0
  const diskon = Number(rawData.diskon || items.find(i => i.diskon)?.diskon || 0)
  const total = Math.max(0, subtotal + fee + ongkir - diskon)
  const dp = Number(rawData.dp || items.find(i => i.dp)?.dp || 0)
  const sisa = Math.max(0, total - dp)
  const pending = items.some((i) => !Number(i.harga))
  const allStatusLunas = items.every((i) => String(i.status || '').trim().toLowerCase() === 'lunas')
  const lunas = !pending && (sisa === 0 || allStatusLunas)

  const resi = rawData.resi || items.find(i => i.resi)?.resi || ''
  const ekspedisi = rawData.ekspedisi || items.find(i => i.ekspedisi)?.ekspedisi || 'Kurir Ekspedisi'
  const orderDate = rawData.orderDate || items.find(i => i.tanggal)?.tanggal || '17 Oktober 2026'

  let stage = rawData.stage || 'received'
  if (!rawData.stage) {
    if (lunas && resi) stage = 'shipped'
    else if (lunas && !resi) stage = 'packing'
    else if (pending) stage = 'hunting'
    else if (dp > 0) stage = 'packing'
    else stage = 'received'
  }

  return {
    nama: rawData.nama || 'Customer',
    items,
    subtotal,
    fee,
    ongkir,
    diskon,
    total,
    dp,
    sisa,
    lunas,
    pending,
    stage,
    stageLabel: rawData.stageLabel || '',
    resi,
    ekspedisi,
    orderDate
  }
}

// Kirim pesanan baru dari formulir
export async function submitOrder(order, businessType = 'olshop') {
  // Selalu simpan ke antrean lokal agar langsung bisa dicek di Invoice & Admin Dashboard
  try {
    const orders = getStoredOrders(businessType)
    orders[order.hp] = {
      nama: order.nama,
      stage: 'received',
      stageLabel: 'Pesanan Diterima & Masuk Antrean Sistem',
      orderDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      ongkir: Number(order.ongkir || 0),
      diskon: Number(order.diskon || 0),
      dp: Number(order.dp || 0),
      resi: '',
      ekspedisi: 'Kurir Ekspedisi',
      items: order.items.map(it => ({
        brand: it.brand || '-',
        barang: it.barang || '-',
        motif: it.motif || '-',
        ukuran: it.ukuran || '-',
        catatan: it.catatan || '',
        harga: Number(it.harga || 0),
        jastip: 0,
        status: 'Belum'
      }))
    }
    saveStoredOrders(businessType, orders)
    saveRecentPhone(order.hp)
  } catch (err) {
    console.warn('Error saving order locally:', err)
  }

  // Jika ada API_URL Google Sheets, kirim juga ke server
  if (API_URL) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(order)
      })
      const json = await res.json()
      return json
    } catch (err) {
      console.warn('Sync to Google Sheets API failed, order saved locally:', err)
      return { ok: true, localOnly: true }
    }
  }

  return { ok: true, demo: true }
}
