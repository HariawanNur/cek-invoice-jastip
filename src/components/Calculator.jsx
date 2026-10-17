import { useState } from 'react'
import { BUSINESS_PRESETS, EXCHANGE_RATES } from '../config'
import { rupiah } from '../services/data'
import {
  Calculator as CalcIcon,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Truck,
  Wrench,
  Utensils,
  Printer,
  Briefcase,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  ShoppingCart,
  Info
} from 'lucide-react'

export default function Calculator({
  businessType = 'olshop',
  hasShipping = true,
  onOrderClick,
  onShowToast,
  adminWa = '6285117158205'
}) {
  const [copied, setCopied] = useState(false)
  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop

  // ==========================================
  // 1. STATE TOKO ONLINE / BUTIK (SIMULASI BELANJA)
  // ==========================================
  const OLSHOP_PRESETS = [
    { id: '1', name: 'Gamis Daily Syari Premium', price: 185000 },
    { id: '2', name: 'Kemeja Flannel Pria Casual', price: 145000 },
    { id: '3', name: 'Hijab Voal Segiempat Silk', price: 45000 },
    { id: '4', name: 'Celana Chino Slim Fit', price: 160000 },
    { id: '5', name: 'Kaos Cotton Combed 30s', price: 75000 },
    { id: 'custom', name: 'Ketik Produk Lainnya...', price: 120000 }
  ]

  const [olshopSelected, setOlshopSelected] = useState(OLSHOP_PRESETS[0].id)
  const [olshopCustomName, setOlshopCustomName] = useState('Dress Casual Katun')
  const [olshopPrice, setOlshopPrice] = useState(OLSHOP_PRESETS[0].price)
  const [olshopQty, setOlshopQty] = useState(1)
  const [olshopCourier, setOlshopCourier] = useState('reguler') // 'pickup' | 'reguler' | 'express' | 'cargo'
  const [olshopPromo, setOlshopPromo] = useState('none') // 'none' (Default: 0% / Normal!) | 'HEMAT10' | 'POTONG20' | 'FREEONGKIR'

  // Perhitungan Olshop
  const activeOlshopName = olshopSelected === 'custom'
    ? (olshopCustomName.trim() || 'Produk Belanja')
    : (OLSHOP_PRESETS.find(p => p.id === olshopSelected)?.name || 'Produk Belanja')

  const unitPrice = parseFloat(olshopPrice) || 0
  const qty = Math.max(1, parseInt(olshopQty) || 1)
  const subtotalOlshop = unitPrice * qty

  let ongkirOlshop = 0
  if (hasShipping) {
    if (olshopCourier === 'pickup') ongkirOlshop = 0
    else if (olshopCourier === 'reguler') ongkirOlshop = 12000
    else if (olshopCourier === 'express') ongkirOlshop = 22000
    else if (olshopCourier === 'cargo') ongkirOlshop = 35000
  }

  let diskonOlshop = 0
  let promoLabel = 'Tanpa Voucher (Harga Normal)'
  if (olshopPromo === 'HEMAT10') {
    diskonOlshop = Math.round(subtotalOlshop * 0.1)
    promoLabel = 'Diskon Kupon 10% (HEMAT10)'
  } else if (olshopPromo === 'POTONG20') {
    diskonOlshop = Math.min(subtotalOlshop, 20000)
    promoLabel = 'Potongan Voucher Rp 20.000'
  } else if (olshopPromo === 'FREEONGKIR') {
    diskonOlshop = ongkirOlshop
    promoLabel = 'Voucher Gratis Ongkir'
  }

  const totalOlshop = Math.max(0, subtotalOlshop + ongkirOlshop - diskonOlshop)

  // ==========================================
  // 2. STATE SERVIS HP & LAPTOP
  // ==========================================
  const SERVIS_SERVICES = [
    { id: 'lcd', name: 'Ganti Layar / LCD Pecah', sparepart: 650000, fee: 100000 },
    { id: 'battery', name: 'Ganti Baterai Drop', sparepart: 250000, fee: 50000 },
    { id: 'charging', name: 'Port Cas / Mic Tidak Berfungsi', sparepart: 120000, fee: 50000 },
    { id: 'dead', name: 'Mati Total / Servis Mesin IC Power', sparepart: 450000, fee: 200000 },
    { id: 'maintenance', name: 'Pembersihan Thermal Paste & Kipas Laptop', sparepart: 0, fee: 90000 },
    { id: 'software', name: 'Install Ulang & Recovery Data', sparepart: 0, fee: 80000 }
  ]

  const [servisDevice, setServisDevice] = useState('iPhone 13 / Samsung Galaxy')
  const [servisType, setServisType] = useState('lcd')
  const [servisGrade, setServisGrade] = useState('ori') // 'ori' | 'oem'

  const activeService = SERVIS_SERVICES.find(s => s.id === servisType) || SERVIS_SERVICES[0]
  const sparepartMultiplier = servisGrade === 'ori' ? 1 : 0.75
  const sparepartCost = Math.round(activeService.sparepart * sparepartMultiplier)
  const serviceFee = activeService.fee
  const totalServis = sparepartCost + serviceFee

  // ==========================================
  // 3. STATE KULINER & KATERING
  // ==========================================
  const KULINER_MENUS = [
    { id: '1', name: 'Nasi Box Ayam Bakar Madu Komplit', price: 25000 },
    { id: '2', name: 'Nasi Box Ayam Goreng Lengkuas', price: 22000 },
    { id: '3', name: 'Tumpeng Mini Nusantara Spesial', price: 35000 },
    { id: '4', name: 'Snack Box Acara (3 Kue + Air)', price: 12000 },
    { id: '5', name: 'Nasi Liwet Solo Daun Pisang', price: 28000 }
  ]

  const [kulinerMenuId, setKulinerMenuId] = useState(KULINER_MENUS[0].id)
  const [kulinerPorsi, setKulinerPorsi] = useState(30)
  const [kulinerKemasan, setKulinerKemasan] = useState('standar') // 'standar' (0) | 'spunbond' (3000) | 'besek' (5000)

  const activeMenu = KULINER_MENUS.find(m => m.id === kulinerMenuId) || KULINER_MENUS[0]
  const porsiCount = Math.max(1, parseInt(kulinerPorsi) || 1)
  const biayaKemasanPerPcs = kulinerKemasan === 'spunbond' ? 3000 : kulinerKemasan === 'besek' ? 5000 : 0
  const subtotalKuliner = (activeMenu.price + biayaKemasanPerPcs) * porsiCount
  const ongkirKuliner = hasShipping ? 25000 : 0
  const totalKuliner = subtotalKuliner + ongkirKuliner
  const dpKuliner = Math.round(totalKuliner * 0.5)

  // ==========================================
  // 4. STATE PERCETAKAN & SABLON (TIERING GROSIR)
  // ==========================================
  const PRINT_PRODUCTS = [
    { id: '1', name: 'Kaos Cotton Combed 30s + Sablon DTF', basePrice: 65000 },
    { id: '2', name: 'Banner Spanduk Flexi 280gr', basePrice: 25000 },
    { id: '3', name: 'Brosur Full Color A4 Art Paper', basePrice: 850 },
    { id: '4', name: 'Stiker Kromo Vinyl Kemasan (A3)', basePrice: 12000 }
  ]

  const [printProductId, setPrintProductId] = useState(PRINT_PRODUCTS[0].id)
  const [printQty, setPrintQty] = useState(24)
  const [printDesign, setPrintDesign] = useState('ready') // 'ready' (0) | 'setting' (30000) | 'custom' (100000)

  const activePrint = PRINT_PRODUCTS.find(p => p.id === printProductId) || PRINT_PRODUCTS[0]
  const qtyPcs = Math.max(1, parseInt(printQty) || 1)

  // Diskon Grosir Otomatis (Tiering kuantitas)
  let printDiscountPercent = 0
  if (qtyPcs >= 50) printDiscountPercent = 12
  else if (qtyPcs >= 24) printDiscountPercent = 7
  else if (qtyPcs >= 12) printDiscountPercent = 3

  const rawPrintSubtotal = activePrint.basePrice * qtyPcs
  const printDiscountNominal = Math.round((rawPrintSubtotal * printDiscountPercent) / 100)
  const biayaDesain = printDesign === 'setting' ? 30000 : printDesign === 'custom' ? 100000 : 0
  const totalPercetakan = rawPrintSubtotal - printDiscountNominal + biayaDesain

  // ==========================================
  // 5. STATE JASA & DIGITAL AGENCY
  // ==========================================
  const JASA_PACKAGES = [
    { id: '1', name: 'Landing Page Bisnis 1 Halaman', price: 1500000 },
    { id: '2', name: 'Website Company Profile Lengkap', price: 3500000 },
    { id: '3', name: 'Toko Online / Katalog WhatsApp', price: 4500000 },
    { id: '4', name: 'Desain Logo & Brand Guideline', price: 1200000 },
    { id: '5', name: 'Kelola Konten Instagram 1 Bulan', price: 1800000 }
  ]

  const [jasaId, setJasaId] = useState(JASA_PACKAGES[0].id)
  const [jasaAddon, setJasaAddon] = useState('0')

  const activeJasa = JASA_PACKAGES.find(j => j.id === jasaId) || JASA_PACKAGES[0]
  const totalJasa = activeJasa.price + (parseInt(jasaAddon) || 0)

  // ==========================================
  // 6. STATE JASTIP (KURS ASING & FEE TITIP)
  // ==========================================
  const [currencyCode, setCurrencyCode] = useState(EXCHANGE_RATES[0].code)
  const [foreignAmount, setForeignAmount] = useState('1200')
  const [jastipItemName, setJastipItemName] = useState('Gentle Woman Tote Bag')

  const activeCurrency = EXCHANGE_RATES.find(c => c.code === currencyCode) || EXCHANGE_RATES[0]
  const foreignNum = parseFloat(foreignAmount) || 0
  const idrBase = Math.round(foreignNum * activeCurrency.rate)
  const calcFee = Math.max(activeCurrency.minFee, Math.round(idrBase * (activeCurrency.feePercent / 100)))
  const totalJastip = idrBase > 0 ? idrBase + calcFee : 0

  // ==========================================
  // RANGKUMAN TEKS UNTUK WHATSAPP / SALIN
  // ==========================================
  let rincianText = ''
  let finalTotal = 0

  if (businessType === 'olshop') {
    finalTotal = totalOlshop
    rincianText = [
      `*Simulasi Belanja - ${currentPreset.defaultStoreName}*`,
      `Produk: ${activeOlshopName}`,
      `Harga: ${rupiah(unitPrice)} x ${qty} pcs = ${rupiah(subtotalOlshop)}`,
      hasShipping ? `Ongkir: ${rupiah(ongkirOlshop)} (${olshopCourier === 'pickup' ? 'Ambil di Toko' : 'Ekspedisi'})` : null,
      diskonOlshop > 0 ? `Voucher Promo: -${rupiah(diskonOlshop)} (${promoLabel})` : 'Diskon: Rp 0 (Harga Normal)',
      `*Total Bayar: ${rupiah(totalOlshop)}*`
    ].filter(Boolean).join('\n')
  } else if (businessType === 'servis') {
    finalTotal = totalServis
    rincianText = [
      `*Estimasi Servis - ${currentPreset.defaultStoreName}*`,
      `Perangkat: ${servisDevice}`,
      `Layanan: ${activeService.name}`,
      `Kualitas Sparepart: ${servisGrade === 'ori' ? 'Original Resmi (Garansi 90 Hari)' : 'Standar OEM (Garansi 30 Hari)'}`,
      `Estimasi Sparepart: ${rupiah(sparepartCost)}`,
      `Jasa Servis & Teknisi: ${rupiah(serviceFee)}`,
      `*Total Estimasi: ${rupiah(totalServis)}*`
    ].join('\n')
  } else if (businessType === 'kuliner') {
    finalTotal = totalKuliner
    rincianText = [
      `*Estimasi Katering - ${currentPreset.defaultStoreName}*`,
      `Menu: ${activeMenu.name}`,
      `Jumlah Porsi: ${porsiCount} Box`,
      `Harga Satuan: ${rupiah(activeMenu.price + biayaKemasanPerPcs)}`,
      `Subtotal: ${rupiah(subtotalKuliner)}`,
      hasShipping && ongkirKuliner > 0 ? `Ongkir Pengantaran: ${rupiah(ongkirKuliner)}` : null,
      `*Total Biaya: ${rupiah(totalKuliner)}*`,
      `Estimasi DP 50%: ${rupiah(dpKuliner)}`
    ].filter(Boolean).join('\n')
  } else if (businessType === 'percetakan') {
    finalTotal = totalPercetakan
    rincianText = [
      `*Estimasi Cetak - ${currentPreset.defaultStoreName}*`,
      `Produk: ${activePrint.name}`,
      `Jumlah: ${qtyPcs} pcs/meter`,
      `Subtotal: ${rupiah(rawPrintSubtotal)}`,
      printDiscountNominal > 0 ? `Diskon Grosir (${printDiscountPercent}%): -${rupiah(printDiscountNominal)}` : null,
      biayaDesain > 0 ? `Jasa Setting Desain: ${rupiah(biayaDesain)}` : `Desain: Gratis (File Siap Cetak)`,
      `*Total Estimasi: ${rupiah(totalPercetakan)}*`
    ].filter(Boolean).join('\n')
  } else if (businessType === 'jasa') {
    finalTotal = totalJasa
    rincianText = [
      `*Estimasi Proyek - ${currentPreset.defaultStoreName}*`,
      `Paket: ${activeJasa.name} (${rupiah(activeJasa.price)})`,
      parseInt(jasaAddon) > 0 ? `Fitur Add-on: ${rupiah(parseInt(jasaAddon))}` : null,
      `*Total Investasi: ${rupiah(totalJasa)}*`,
      `Skema Pembayaran: DP 50% Awal & 50% Serah Terima`
    ].filter(Boolean).join('\n')
  } else {
    // Jastip
    finalTotal = totalJastip
    rincianText = [
      `*Estimasi Jastip - ${currentPreset.defaultStoreName}*`,
      `Barang Titipan: ${jastipItemName}`,
      `Harga Toko: ${activeCurrency.symbol} ${foreignNum.toLocaleString()} (Kurs ${rupiah(activeCurrency.rate)})`,
      `Konversi IDR: ${rupiah(idrBase)}`,
      `Jasa Titip (Fee): ${rupiah(calcFee)}`,
      `*Total Bayar: ${rupiah(totalJastip)}*`
    ].join('\n')
  }

  const copyEstimasi = () => {
    if (!finalTotal) return
    navigator.clipboard.writeText(rincianText)
    setCopied(true)
    onShowToast?.('Rincian estimasi berhasil disalin!')
    setTimeout(() => setCopied(false), 2000)
  }

  const waLink = `https://wa.me/${adminWa}?text=${encodeURIComponent(
    `Halo admin ${currentPreset.defaultStoreName}, saya ingin konsultasi simulasi pesanan ini:\n\n${rincianText}`
  )}`

  // Handle pindah ke Form Order
  const handleLanjutOrder = () => {
    let orderItemPayload = null

    if (businessType === 'olshop') {
      orderItemPayload = {
        barang: activeOlshopName,
        brand: currentPreset.defaultStoreName,
        harga: unitPrice,
        qty,
        catatan: diskonOlshop > 0 ? `Pakai voucher: ${promoLabel}` : ''
      }
    } else if (businessType === 'servis') {
      orderItemPayload = {
        barang: `${servisDevice} - ${activeService.name}`,
        brand: currentPreset.defaultStoreName,
        harga: totalServis,
        qty: 1,
        catatan: `Sparepart: ${servisGrade === 'ori' ? 'Original Resmi' : 'OEM'}`
      }
    } else if (businessType === 'kuliner') {
      orderItemPayload = {
        barang: activeMenu.name,
        brand: currentPreset.defaultStoreName,
        harga: activeMenu.price + biayaKemasanPerPcs,
        qty: porsiCount,
        catatan: `Kemasan: ${kulinerKemasan}`
      }
    } else if (businessType === 'percetakan') {
      orderItemPayload = {
        barang: activePrint.name,
        brand: currentPreset.defaultStoreName,
        harga: totalPercetakan,
        qty: qtyPcs,
        catatan: `Desain: ${printDesign}`
      }
    } else if (businessType === 'jasa') {
      orderItemPayload = {
        barang: activeJasa.name,
        brand: currentPreset.defaultStoreName,
        harga: totalJasa,
        qty: 1,
        catatan: `Fitur add-on: ${jasaAddon !== '0' ? 'Ya' : 'Tidak'}`
      }
    } else {
      orderItemPayload = {
        barang: `${jastipItemName} (${activeCurrency.code})`,
        brand: currentPreset.defaultStoreName,
        harga: totalJastip,
        qty: 1,
        catatan: `Harga toko: ${activeCurrency.symbol} ${foreignNum}`
      }
    }

    onOrderClick?.(orderItemPayload)
    onShowToast?.('Rincian dimasukkan ke form pemesanan!')
  }

  return (
    <div className="pro-card">
      <div className="pro-card-header">
        <div>
          <h2 className="card-title">
            <CalcIcon size={20} style={{ color: 'var(--primary)' }} />
            {currentPreset.labels.calcTitle || 'Simulasi Belanja & Estimasi'}
          </h2>
          <p className="card-subtitle">
            Hitung perkiraan biaya, ongkos kirim, dan total bayar sebelum memesan
          </p>
        </div>
      </div>

      {/* ========================================================
          1. FORM SIMULASI: TOKO ONLINE & BUTIK FASHION
          ======================================================== */}
      {businessType === 'olshop' && (
        <div>
          {/* Pilih Produk Populer */}
          <div className="input-group">
            <label className="input-label">Pilih Produk atau Barang</label>
            <select
              className="input-field no-icon"
              value={olshopSelected}
              onChange={(e) => {
                const val = e.target.value
                setOlshopSelected(val)
                const found = OLSHOP_PRESETS.find(p => p.id === val)
                if (found && val !== 'custom') {
                  setOlshopPrice(found.price)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {OLSHOP_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.price > 0 ? `(${rupiah(p.price)})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Jika pilih custom produk */}
          {olshopSelected === 'custom' && (
            <div className="order-grid-2" style={{ marginBottom: '14px' }}>
              <div>
                <label className="input-label">Nama Produk Sendiri</label>
                <input
                  className="input-field no-icon"
                  value={olshopCustomName}
                  onChange={(e) => setOlshopCustomName(e.target.value)}
                  placeholder="Contoh: Outer Cardigan Rajut"
                />
              </div>
              <div>
                <label className="input-label">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  className="input-field no-icon"
                  value={olshopPrice}
                  onChange={(e) => setOlshopPrice(e.target.value)}
                  placeholder="120000"
                />
              </div>
            </div>
          )}

          {/* Jumlah Beli & Opsi Pengiriman */}
          <div className={hasShipping ? 'order-grid-2' : ''}>
            <div className="input-group">
              <label className="input-label">Jumlah Pembelian (Qty)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={() => setOlshopQty(Math.max(1, qty - 1))}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  className="input-field no-icon"
                  style={{ textAlign: 'center', fontWeight: 800, height: '42px' }}
                  value={olshopQty}
                  onChange={(e) => setOlshopQty(e.target.value)}
                  min="1"
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '42px', height: '42px', padding: 0 }}
                  onClick={() => setOlshopQty(qty + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {hasShipping && (
              <div className="input-group">
                <label className="input-label">Pilihan Pengiriman</label>
                <select
                  className="input-field no-icon"
                  value={olshopCourier}
                  onChange={(e) => setOlshopCourier(e.target.value)}
                  style={{ cursor: 'pointer', height: '42px' }}
                >
                  <option value="reguler">📦 Ekspedisi Reguler (Rp 12.000)</option>
                  <option value="express">⚡ Kilat / Same Day (Rp 22.000)</option>
                  <option value="cargo">🚛 Kargo Luar Pulau (Rp 35.000)</option>
                  <option value="pickup">📍 Ambil Sendiri di Toko (Rp 0)</option>
                </select>
              </div>
            )}
          </div>

          {/* Voucher Promo (OPSIONAL - Default: Tanpa Diskon / Rp 0) */}
          <div className="input-group" style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="input-label" style={{ margin: 0 }}>
                Punya Kupon Promo? (Opsional)
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Default: Tanpa Diskon
              </span>
            </div>
            <select
              className="input-field no-icon"
              value={olshopPromo}
              onChange={(e) => setOlshopPromo(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="none">✓ Tanpa Kupon Promo (Harga Normal - Diskon Rp 0)</option>
              <option value="HEMAT10">🎉 Kupon HEMAT10 (Diskon 10% Spesial Pembeli Baru)</option>
              <option value="POTONG20">🏷️ Kupon POTONG20 (Potongan Langsung Rp 20.000)</option>
              {hasShipping && <option value="FREEONGKIR">🚚 Kupon FREEONGKIR (Potongan Penuh Ongkos Kirim)</option>}
            </select>
          </div>
        </div>
      )}

      {/* ========================================================
          2. FORM SIMULASI: SERVIS GADGET & LAPTOP
          ======================================================== */}
      {businessType === 'servis' && (
        <div>
          <div className="input-group">
            <label className="input-label">Nama Perangkat / Gadget Anda</label>
            <input
              className="input-field no-icon"
              value={servisDevice}
              onChange={(e) => setServisDevice(e.target.value)}
              placeholder="Contoh: iPhone 13 Pro / Laptop Lenovo Thinkpad"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Keluhan atau Jenis Kerusakan</label>
            <select
              className="input-field no-icon"
              value={servisType}
              onChange={(e) => setServisType(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {SERVIS_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.sparepart > 0 ? `(Part ~${rupiah(s.sparepart)})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Pilihan Kualitas Suku Cadang</label>
            <select
              className="input-field no-icon"
              value={servisGrade}
              onChange={(e) => setServisGrade(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="ori">⭐ Grade Original Resmi (Garansi Panjang 90 Hari)</option>
              <option value="oem">🛡️ Grade OEM / High Quality (Garansi 30 Hari - Lebih Hemat)</option>
            </select>
          </div>
        </div>
      )}

      {/* ========================================================
          3. FORM SIMULASI: KULINER & KATERING
          ======================================================== */}
      {businessType === 'kuliner' && (
        <div>
          <div className="input-group">
            <label className="input-label">Pilih Paket Menu Makanan</label>
            <select
              className="input-field no-icon"
              value={kulinerMenuId}
              onChange={(e) => setKulinerMenuId(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {KULINER_MENUS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {rupiah(m.price)} / Box
                </option>
              ))}
            </select>
          </div>

          <div className="order-grid-2">
            <div className="input-group">
              <label className="input-label">Jumlah Porsi (Box/Pax)</label>
              <input
                type="number"
                className="input-field no-icon"
                value={kulinerPorsi}
                onChange={(e) => setKulinerPorsi(e.target.value)}
                min="5"
                placeholder="30"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Jenis Kemasan</label>
              <select
                className="input-field no-icon"
                value={kulinerKemasan}
                onChange={(e) => setKulinerKemasan(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="standar">Box Kardus Foodgrade (Termasuk)</option>
                <option value="spunbond">Tas Spunbond Eksklusif (+Rp 3.000)</option>
                <option value="besek">Besek Bambu Tradisional (+Rp 5.000)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. FORM SIMULASI: PERCETAKAN & SABLON
          ======================================================== */}
      {businessType === 'percetakan' && (
        <div>
          <div className="input-group">
            <label className="input-label">Pilih Jenis Cetakan / Sablon</label>
            <select
              className="input-field no-icon"
              value={printProductId}
              onChange={(e) => setPrintProductId(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {PRINT_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Mulai {rupiah(p.basePrice)})
                </option>
              ))}
            </select>
          </div>

          <div className="order-grid-2">
            <div className="input-group">
              <label className="input-label">Jumlah (Pcs/Meter)</label>
              <input
                type="number"
                className="input-field no-icon"
                value={printQty}
                onChange={(e) => setPrintQty(e.target.value)}
                min="1"
                placeholder="24"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Bantuan Desain</label>
              <select
                className="input-field no-icon"
                value={printDesign}
                onChange={(e) => setPrintDesign(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="ready">File Sudah Siap Cetak (Gratis)</option>
                <option value="setting">Setting Layout & Mockup (+Rp 30.000)</option>
                <option value="custom">Bikin Desain Baru (+Rp 100.000)</option>
              </select>
            </div>
          </div>

          {qtyPcs >= 24 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, marginBottom: '10px' }}>
              🎉 Anda mendapatkan Diskon Grosir {printDiscountPercent}% untuk pesanan &ge; {qtyPcs >= 50 ? '50' : '24'} pcs!
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. FORM SIMULASI: JASA & DIGITAL AGENCY
          ======================================================== */}
      {businessType === 'jasa' && (
        <div>
          <div className="input-group">
            <label className="input-label">Pilih Paket Layanan</label>
            <select
              className="input-field no-icon"
              value={jasaId}
              onChange={(e) => setJasaId(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {JASA_PACKAGES.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name} - {rupiah(j.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Fitur Tambahan (Add-on)</label>
            <select
              className="input-field no-icon"
              value={jasaAddon}
              onChange={(e) => setJasaAddon(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="0">Tanpa Tambahan (Paket Standar)</option>
              <option value="500000">Integrasi WhatsApp & Lead Form (+Rp 500.000)</option>
              <option value="650000">Domain .com + Cloud Hosting 1 Tahun (+Rp 650.000)</option>
            </select>
          </div>
        </div>
      )}

      {/* ========================================================
          6. FORM SIMULASI: JASTIP LUAR NEGERI
          ======================================================== */}
      {businessType === 'jastip' && (
        <div>
          <div className="input-group">
            <label className="input-label">Pilih Mata Uang Negara Asal</label>
            <div className="calc-currency-selector">
              {EXCHANGE_RATES.map((cur) => (
                <button
                  key={cur.code}
                  type="button"
                  className={`currency-chip-btn ${cur.code === currencyCode ? 'active' : ''}`}
                  onClick={() => setCurrencyCode(cur.code)}
                >
                  <div>{cur.symbol} {cur.code}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>{cur.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="order-grid-2">
            <div className="input-group">
              <label className="input-label">Nama Barang Titipan</label>
              <input
                className="input-field no-icon"
                value={jastipItemName}
                onChange={(e) => setJastipItemName(e.target.value)}
                placeholder="Gentle Woman / Labubu"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Harga di Toko ({activeCurrency.code})</label>
              <input
                type="number"
                className="input-field no-icon"
                value={foreignAmount}
                onChange={(e) => setForeignAmount(e.target.value)}
                placeholder="1200"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          KOTAK RINCIAN & HASIL ESTIMASI TRANSPARAN (UNTUK PEMBELI)
          ======================================================== */}
      <div className="calc-result-box" style={{ marginTop: '16px' }}>
        <div className="calc-result-label">
          {businessType === 'olshop' ? 'ESTIMASI TOTAL BELANJA' : 'TOTAL ESTIMASI BIAYA'}
        </div>
        <div className="calc-result-val">{rupiah(finalTotal)}</div>

        {/* Rincian Finansial Transparan */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px', display: 'grid', gap: '4px', textAlign: 'left' }}>
          {businessType === 'olshop' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({qty} pcs):</span>
                <strong>{rupiah(subtotalOlshop)}</strong>
              </div>
              {hasShipping && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ongkir ({olshopCourier === 'pickup' ? 'Ambil di Toko' : 'Kurir'}):</span>
                  <strong>{ongkirOlshop > 0 ? rupiah(ongkirOlshop) : 'Rp 0 (Gratis)'}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: diskonOlshop > 0 ? 'var(--success)' : 'inherit' }}>
                <span>Potongan Voucher Promo:</span>
                <strong>{diskonOlshop > 0 ? `-${rupiah(diskonOlshop)}` : 'Rp 0 (Harga Normal)'}</strong>
              </div>
            </>
          )}

          {businessType === 'servis' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimasi Suku Cadang:</span>
                <strong>{rupiah(sparepartCost)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Biaya Jasa & Pengerjaan Teknisi:</span>
                <strong>{rupiah(serviceFee)}</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '2px' }}>
                ✓ Sudah termasuk jaminan garansi perbaikan resmi toko
              </div>
            </>
          )}

          {businessType === 'kuliner' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal Makanan ({porsiCount} Box):</span>
                <strong>{rupiah(subtotalKuliner)}</strong>
              </div>
              {hasShipping && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ongkos Pengantaran:</span>
                  <strong>{rupiah(ongkirKuliner)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 700 }}>
                <span>Estimasi Uang Muka (DP 50%):</span>
                <strong>{rupiah(dpKuliner)}</strong>
              </div>
            </>
          )}

          {businessType === 'percetakan' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Biaya Produksi ({qtyPcs} pcs):</span>
                <strong>{rupiah(rawPrintSubtotal)}</strong>
              </div>
              {printDiscountNominal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Potongan Diskon Grosir:</span>
                  <strong>-{rupiah(printDiscountNominal)}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bantuan Jasa Desain:</span>
                <strong>{biayaDesain > 0 ? rupiah(biayaDesain) : 'Rp 0 (Gratis)'}</strong>
              </div>
            </>
          )}

          {businessType === 'jasa' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Paket Layanan:</span>
                <strong>{rupiah(activeJasa.price)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Fitur Tambahan:</span>
                <strong>{rupiah(parseInt(jasaAddon))}</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '2px' }}>
                ✓ Sistem termin: 50% DP Awal & 50% Pelunasan setelah Serah Terima
              </div>
            </>
          )}

          {businessType === 'jastip' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Konversi Rupiah (Kurs {rupiah(activeCurrency.rate)}):</span>
                <strong>{rupiah(idrBase)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Jasa Titip (Fee):</span>
                <strong>{rupiah(calcFee)}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tombol Aksi Pembeli */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
        <button
          className="btn-secondary"
          onClick={copyEstimasi}
          title="Salin rincian hitungan ke clipboard"
        >
          {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
          {copied ? 'Tersalin!' : 'Salin Hitungan'}
        </button>

        <a
          className="btn-secondary btn-wa"
          href={waLink}
          target="_blank"
          rel="noreferrer"
          title="Konsultasi langsung ke WhatsApp admin"
        >
          <MessageCircle size={16} />
          Konsultasi Admin
        </a>
      </div>

      {/* Tombol Utama: Lanjut ke Form Pemesanan */}
      <button
        className="btn-primary"
        style={{ marginTop: '10px' }}
        onClick={handleLanjutOrder}
      >
        <ShoppingCart size={18} />
        {businessType === 'servis' ? 'Lanjut Booking Servis Ini' : businessType === 'jasa' ? 'Lanjut Mulai Proyek Ini' : 'Lanjut Pesan Barang Ini'}
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
