import { useState, useEffect } from 'react'
import {
  BUSINESS_PRESETS,
  ADMIN_WA,
  NAMA_USAHA
} from './config'
import OrderForm from './OrderForm'
import Calculator from './Calculator'
import PaymentFaq from './PaymentFaq'
import AdminDashboard from './AdminDashboard'
import {
  getContohNomor,
  findCustomer,
  normalisasiHp,
  rupiah,
  getSavedPhone,
  setSavedPhone,
  getRecentPhones,
  getActiveBusinessType,
  setActiveBusinessType,
  getShippingPreference,
  setShippingPreference
} from './data'
import { bagikanPdf } from './pdf'
import confetti from 'canvas-confetti'
import {
  Search,
  ShoppingBag,
  Calculator as CalcIcon,
  CreditCard,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  FileText,
  Share2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  BadgeCheck,
  Briefcase,
  ChevronDown,
  Wrench,
  Utensils,
  Printer,
  Plane,
  Store,
  Palette,
  Star,
  Link as LinkIcon,
  Settings2,
  PhoneCall,
  ShieldCheck,
  Lock
} from 'lucide-react'

const waLink = (text, nomor = '') => `https://wa.me/${nomor}?text=${encodeURIComponent(text)}`

function ringkasanWa(hp, c, currentPreset, hasShipping = true) {
  const baris = c.items.map(
    (i, idx) => `${idx + 1}. ${[i.barang, i.motif, i.ukuran].filter(Boolean).join(' - ')} (${i.brand || '-'}): ${i.harga ? rupiah(Number(i.harga) + Number(i.jastip || 0)) : 'Menunggu estimasi'}`
  )
  return [
    `*INVOICE RESMI ${currentPreset.defaultStoreName}*`,
    `Customer / Klien: ${c.nama} (${hp})`,
    `Tanggal: ${c.orderDate || 'Terbaru'}`,
    `Status: ${c.pending ? 'Menunggu Konfirmasi Biaya' : c.lunas ? 'LUNAS (PAID) ✅' : 'BELUM LUNAS'}`,
    '',
    '*Rincian Tagihan:*',
    ...baris,
    '',
    `Subtotal: ${rupiah(c.subtotal)}`,
    c.fee > 0 ? `${currentPreset.labels.feeLabel}: ${rupiah(c.fee)}` : null,
    hasShipping && c.ongkir > 0 ? `Ongkos Kirim: ${rupiah(c.ongkir)}` : null,
    c.diskon > 0 ? `Diskon Promo: -${rupiah(c.diskon)}` : null,
    `*TOTAL TAGIHAN: ${rupiah(c.total)}*`,
    c.dp > 0 ? `DP Masuk: -${rupiah(c.dp)}` : null,
    `*SISA PEMBAYARAN: ${rupiah(c.sisa)}*`,
    hasShipping && c.resi ? `\n*No. Resi Pengiriman:* ${c.resi} (${c.ekspedisi})` : null,
    '',
    `Cek invoice online & download struk PDF di: ${window.location.origin}?hp=${hp}`
  ].filter(Boolean).join('\n')
}

// Stepper Timeline Component (Dinamis Sesuai Tipe Bisnis & Opsi Pengiriman)
function OrderStepper({ stage, pending, lunas, resi, stages, hasShipping }) {
  const activeStages = stages || [
    { key: 'received', label: 'Order Masuk' },
    { key: 'hunting', label: 'Proses Awal' },
    { key: 'packing', label: 'Pengerjaan' },
    { key: 'shipped', label: hasShipping ? 'Pengiriman' : 'Selesai Dikemas' },
    { key: 'completed', label: 'Selesai' }
  ]

  let currentIndex = 0
  if (stage === 'completed' || (lunas && (hasShipping ? resi : true))) currentIndex = 3
  else if (stage === 'shipped' || (hasShipping ? resi : false)) currentIndex = 3
  else if (stage === 'packing') currentIndex = 2
  else if (stage === 'hunting' || pending) currentIndex = 1
  else currentIndex = 0

  return (
    <div className="timeline-stepper">
      <div className="timeline-track">
        <div
          className="timeline-progress"
          style={{ width: `${(currentIndex / (activeStages.length - 1)) * 100}%` }}
        />
      </div>

      {activeStages.map((st, idx) => {
        const isDone = idx < currentIndex
        const isActive = idx === currentIndex

        return (
          <div
            key={st.key}
            className={`timeline-step ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="step-node">
              {isDone ? <CheckCircle2 size={14} /> : <Clock size={14} />}
            </div>
            <div className="step-label">{st.label}</div>
          </div>
        )
      })}
    </div>
  )
}

// Visual Barcode Component
function BarcodeVisual({ code }) {
  const bars = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3]
  return (
    <div className="receipt-barcode" title={`Barcode: ${code}`}>
      {bars.map((w, idx) => (
        <span
          key={idx}
          className="barcode-bar"
          style={{
            width: `${w}px`,
            marginRight: idx % 2 === 0 ? '1px' : '2px',
            opacity: idx % 3 === 0 ? 0.9 : 0.6
          }}
        />
      ))}
    </div>
  )
}

// Skeleton Shimmer Loading Component
function InvoiceSkeleton() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ width: '45%' }}>
          <div className="skeleton-box" style={{ height: '20px', width: '100%', marginBottom: '6px' }} />
          <div className="skeleton-box" style={{ height: '14px', width: '70%' }} />
        </div>
        <div className="skeleton-box" style={{ height: '24px', width: '28%', borderRadius: '99px' }} />
      </div>

      <div className="skeleton-box" style={{ height: '40px', width: '100%', margin: '18px 0' }} />

      <div style={{ margin: '14px 0' }}>
        <div className="skeleton-box" style={{ height: '18px', width: '90%', marginBottom: '10px' }} />
        <div className="skeleton-box" style={{ height: '18px', width: '75%', marginBottom: '10px' }} />
        <div className="skeleton-box" style={{ height: '18px', width: '85%' }} />
      </div>

      <div className="skeleton-box" style={{ height: '80px', width: '100%', marginTop: '16px' }} />
    </div>
  )
}

// Luxury E-Receipt Invoice Card Component
function InvoiceView({ hp, c, businessType, hasShipping, onShowToast, isAdminLoggedIn, onOpenAdmin }) {
  const [downloading, setDownloading] = useState(false)
  const [copiedResi, setCopiedResi] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop

  useEffect(() => {
    if (c.lunas) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.55 }
        })
      } catch {
        // ignore
      }
    }
  }, [c.lunas])

  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      await bagikanPdf({ ...c, hp }, rupiah, businessType, hasShipping)
      onShowToast?.('PDF Invoice berhasil dibuat!')
    } catch (e) {
      console.error(e)
      onShowToast?.('Gagal mengunduh PDF.')
    } finally {
      setDownloading(false)
    }
  }

  const copyResi = () => {
    if (!c.resi) return
    navigator.clipboard.writeText(c.resi)
    setCopiedResi(true)
    onShowToast?.('Nomor resi/referensi berhasil disalin!')
    setTimeout(() => setCopiedResi(false), 2000)
  }

  const copyDirectInvoiceLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?hp=${encodeURIComponent(hp)}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    onShowToast?.('Link invoice langsung berhasil disalin! Tinggal kirim ke customer.')
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const stampClass = c.lunas ? 'lunas' : c.dp > 0 ? 'dp' : c.pending ? 'pending' : 'belum'
  const stampLabel = c.lunas ? '✓ LUNAS / PAID' : c.dp > 0 ? 'DP TERBAYAR' : c.pending ? 'PENDING' : 'BELUM BAYAR'

  const invNumber = `INV-${new Date().getFullYear()}-${(hp || '0000').slice(-4)}`

  const waBayarLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
    `Halo admin ${currentPreset.defaultStoreName}, saya ${c.nama} (${hp}) mau konfirmasi transfer pembayaran sisa tagihan invoice sebesar ${rupiah(c.sisa)}.`
  )}`

  return (
    <div className="receipt-wrapper">
      {/* Top Header Row with Metadata and Authentic Stamp (Anti-Overlap Flex) */}
      <div className="receipt-header-row">
        <div className="receipt-buyer-meta">
          <div className="receipt-sub-badge">INVOICE & E-RECEIPT RESMI</div>
          <h2 className="receipt-buyer-name">{c.nama}</h2>
          <div className="receipt-meta-chips">
            <span className="receipt-meta-item">📱 <strong>{hp}</strong></span>
            <span>•</span>
            <span className="receipt-meta-item">📄 <strong>{invNumber}</strong></span>
            <span>•</span>
            <span className="receipt-meta-item">📅 {c.orderDate || '17 Okt 2026'}</span>
          </div>
        </div>

        {/* Authentic Stamp Seal */}
        <div className={`receipt-stamp ${stampClass}`}>
          {stampLabel}
        </div>
      </div>

      {/* Barcode Visual Box */}
      <div className="receipt-barcode-wrapper">
        <BarcodeVisual code={invNumber} />
        <div className="receipt-barcode-caption">{invNumber} • VERIFIED E-RECEIPT</div>
      </div>

      {/* Stepper Timeline (Disesuaikan apakah ada pengiriman atau ambil di tempat) */}
      <OrderStepper
        stage={c.stage}
        pending={c.pending}
        lunas={c.lunas}
        resi={c.resi}
        hasShipping={hasShipping}
        stages={hasShipping ? currentPreset.labels.stagesWithShipping : currentPreset.labels.stagesNoShipping}
      />

      {/* Resi Box HANYA MUNCUL jika opsi pengiriman aktif dan nomor resi ada */}
      {hasShipping && c.resi && (
        <div className="resi-card">
          <div className="resi-info">
            <span className="resi-expedition">🚚 {c.ekspedisi || 'Ekspedisi / Pengantaran'}</span>
            <span className="resi-number">{c.resi}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              onClick={copyResi}
            >
              {copiedResi ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              {copiedResi ? 'Disalin' : 'Salin'}
            </button>
            <a
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              href={`https://cekresi.com/?noresi=${c.resi}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} /> Lacak
            </a>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="invoice-items-table">
        <div className="invoice-items-th">
          <span>{currentPreset.labels.itemTitle || 'Barang / Layanan'}</span>
          <span>Harga / Subtotal</span>
        </div>
        {c.items.map((it, idx) => (
          <div key={idx} className="invoice-item-row">
            <div className="item-main-details">
              <div className="item-name">{it.barang}</div>
              <div className="item-meta">
                {it.brand && <span className="item-meta-tag">🏷️ {it.brand}</span>}
                {it.motif && <span className="item-meta-tag">🎨 {it.motif}</span>}
                {it.ukuran && <span className="item-meta-tag">📏 {it.ukuran}</span>}
                {it.catatan && <span className="item-note-text">"{it.catatan}"</span>}
              </div>
            </div>
            <div className="item-price-col">
              <div className="item-price-val">
                {it.harga ? rupiah(Number(it.harga) + Number(it.jastip || 0)) : 'Menunggu estimasi'}
              </div>
              {it.harga && it.jastip > 0 && (
                <div className="item-fee-val">
                  (Barang {rupiah(it.harga)} + Fee {rupiah(it.jastip)})
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="summary-table">
        <div className="summary-row">
          <span>Subtotal Tagihan</span>
          <span style={{ fontWeight: 700 }}>{rupiah(c.subtotal)}</span>
        </div>
        {c.fee > 0 && (
          <div className="summary-row">
            <span>{currentPreset.labels.feeLabel}</span>
            <span style={{ fontWeight: 700 }}>{rupiah(c.fee)}</span>
          </div>
        )}
        {/* Baris Ongkos Kirim HANYA TAMPIL jika hasShipping aktif dan ongkir > 0 */}
        {hasShipping && c.ongkir > 0 && (
          <div className="summary-row">
            <span>Ongkos Kirim / Antar</span>
            <span style={{ fontWeight: 700 }}>{rupiah(c.ongkir)}</span>
          </div>
        )}
        {c.diskon > 0 && (
          <div className="summary-row discount">
            <span>Diskon Promo</span>
            <span style={{ fontWeight: 700 }}>-{rupiah(c.diskon)}</span>
          </div>
        )}

        <div className="summary-row divider total-row">
          <span>TOTAL KESELURUHAN</span>
          <span style={{ color: 'var(--primary)' }}>{rupiah(c.total)}</span>
        </div>

        {c.dp > 0 && (
          <div className="summary-row" style={{ color: 'var(--success)' }}>
            <span>Uang Muka (DP) Sudah Masuk</span>
            <span style={{ fontWeight: 700 }}>-{rupiah(c.dp)}</span>
          </div>
        )}

        {c.sisa > 0 ? (
          <div className="summary-row sisa-row">
            <span>SISA TAGIHAN PEMBAYARAN</span>
            <span>{rupiah(c.sisa)}</span>
          </div>
        ) : (
          <div className="summary-row lunas-row">
            <span>TAGIHAN LUNAS PENUH</span>
            <span>Rp 0</span>
          </div>
        )}
      </div>

      {/* Quick Payment Info if Sisa > 0 */}
      {c.sisa > 0 && (
        <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
            💳 Pembayaran Sisa Tagihan
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Transfer ke <strong>BCA 8830192831 (AWANG PRATAMA)</strong> atau QRIS resmi, lalu kirimkan bukti transfer.
          </div>
          <a className="btn-primary btn-wa" href={waBayarLink} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            Konfirmasi Transfer Sisa ({rupiah(c.sisa)})
          </a>
        </div>
      )}

      {/* Main Action Buttons (Download PDF & Cetak Struk) */}
      <div className="receipt-actions-grid-2">
        <button
          className="btn-primary"
          onClick={handleDownloadPdf}
          disabled={downloading}
          title="Unduh file PDF resmi format A5"
        >
          <FileText size={16} />
          {downloading ? 'Membuat PDF...' : 'Download PDF A5'}
        </button>

        <button
          className="btn-secondary"
          onClick={() => window.print()}
          title="Cetak langsung struk ke printer kasir / thermal"
        >
          <Printer size={16} />
          Cetak Struk
        </button>
      </div>

      {/* Salin Link Invoice Langsung & Bagikan WA */}
      <div className="receipt-actions-grid-2" style={{ marginTop: '8px' }}>
        <button
          className="btn-secondary"
          onClick={copyDirectInvoiceLink}
          title="Salin link langsung untuk dikirim ke customer"
        >
          {copiedLink ? <Check size={16} color="var(--success)" /> : <LinkIcon size={16} />}
          {copiedLink ? 'Link Tersalin!' : 'Salin Link Invoice'}
        </button>

        <a
          className="btn-secondary"
          href={waLink(ringkasanWa(hp, c, currentPreset, hasShipping))}
          target="_blank"
          rel="noreferrer"
        >
          <Share2 size={16} />
          Bagikan ke WA
        </a>
      </div>

      <div style={{ marginTop: '8px' }}>
        <a
          className="btn-secondary"
          style={{ width: '100%' }}
          href={waLink(`Halo admin ${currentPreset.defaultStoreName}, saya mau tanya invoice nomor ${hp}`, ADMIN_WA)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} />
          Hubungi Admin Mengenai Invoice Ini
        </a>
      </div>

      {isAdminLoggedIn && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--primary)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Mode Kasir / Admin Aktif
          </div>
          <button
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.74rem' }}
            onClick={onOpenAdmin}
          >
            Buka di Dashboard Admin →
          </button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [businessType, setBusinessType] = useState('olshop')
  const [hasShipping, setHasShipping] = useState(true)
  const [colorTheme, setColorTheme] = useState('indigo') // 'indigo' | 'emerald' | 'ocean' | 'rose' | 'amber' | 'violet'
  const [showBizModal, setShowBizModal] = useState(false)
  const [showCustomizerModal, setShowCustomizerModal] = useState(false)
  const [tab, setTab] = useState('cek') // 'cek' | 'order' | 'calc' | 'pay' | 'admin'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [inputHp, setInputHp] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasil, setHasil] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [recentHps, setRecentHps] = useState([])
  const [theme, setTheme] = useState('light')
  const [selectedCalcItem, setSelectedCalcItem] = useState(null)
  const [showSellerGuide, setShowSellerGuide] = useState(false)

  // Customizer state untuk demo ke klien
  const [customStoreName, setCustomStoreName] = useState('')

  // Load preferences & auto-load sample invoice or URL parameter ?hp=...
  useEffect(() => {
    const savedTheme = localStorage.getItem('portal_theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    const savedColor = localStorage.getItem('portal_color_theme') || 'indigo'
    setColorTheme(savedColor)
    document.documentElement.setAttribute('data-color', savedColor)

    const savedBiz = getActiveBusinessType()
    const activeBiz = savedBiz && BUSINESS_PRESETS[savedBiz] ? savedBiz : 'olshop'
    setBusinessType(activeBiz)

    const savedShip = getShippingPreference(activeBiz)
    setHasShipping(savedShip)

    const savedCustomName = localStorage.getItem('portal_custom_store_name') || ''
    if (savedCustomName) setCustomStoreName(savedCustomName)

    setRecentHps(getRecentPhones())

    // 1. Cek parameter URL: ?hp=08123456789 atau ?order=08123456789 (DEEP-LINKING)
    const urlParams = new URLSearchParams(window.location.search)
    const urlHp = urlParams.get('hp') || urlParams.get('order') || urlParams.get('wa')
    
    const savedPhone = getSavedPhone()
    const targetHp = urlHp ? normalisasiHp(urlHp) : (savedPhone || '081200000001')

    setInputHp(targetHp)
    if (savedPhone || urlHp) setRememberMe(true)

    // Langsung ambil data invoice agar tombol cetak struk & PDF langsung tampil!
    findCustomer(targetHp, activeBiz, savedShip).then(data => {
      if (data) {
        setHasil({ hp: targetHp, data })
      }
    })
  }, [])

  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop
  const displayedStoreName = customStoreName.trim() || currentPreset.defaultStoreName

  const handleSwitchBiz = (newType) => {
    setBusinessType(newType)
    setActiveBusinessType(newType)
    const defaultShipping = BUSINESS_PRESETS[newType]?.hasShipping ?? true
    setHasShipping(defaultShipping)
    setShippingPreference(defaultShipping)
    setShowBizModal(false)

    const demoHp = '081200000001'
    setInputHp(demoHp)
    findCustomer(demoHp, newType, defaultShipping).then(data => {
      if (data) setHasil({ hp: demoHp, data })
    })

    showToast(`Bisnis: ${BUSINESS_PRESETS[newType]?.name} (${defaultShipping ? 'Pakai Ekspedisi' : 'Ambil di Tempat / Non-Fisik'})`)
  }

  const handleSwitchColor = (newColor) => {
    setColorTheme(newColor)
    localStorage.setItem('portal_color_theme', newColor)
    document.documentElement.setAttribute('data-color', newColor)
    showToast(`Warna Tema berhasil diubah!`)
  }

  const toggleShipping = () => {
    const next = !hasShipping
    setHasShipping(next)
    setShippingPreference(next)
    const curHp = inputHp || '081200000001'
    findCustomer(curHp, businessType, next).then(data => {
      if (data) setHasil({ hp: curHp, data })
    })
    showToast(next ? '🚚 Mode Pengiriman Diaktifkan (Pakai Kurir & Ekspedisi)' : '📍 Mode Ambil di Tempat / Non-Fisik (Tanpa Kurir)')
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('portal_theme', next)
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  async function cekInvoice(nomorToSearch = inputHp) {
    const hp = normalisasiHp(nomorToSearch)
    if (!hp) {
      return setHasil({ error: 'Silakan masukkan nomor WhatsApp Anda.' })
    }

    if (rememberMe) {
      setSavedPhone(hp)
    } else {
      setSavedPhone('')
    }

    setLoading(true)
    try {
      const data = await findCustomer(hp, businessType, hasShipping)
      if (data) {
        setHasil({ hp, data })
        setRecentHps(getRecentPhones())
      } else {
        setHasil({
          error: `Nomor ${hp} belum terdaftar di antrean pesanan. Pastikan nomor sudah benar saat pemesanan.`,
          tanya: true,
          hp
        })
      }
    } catch {
      setHasil({ error: 'Gagal mengambil data invoice. Periksa koneksi internet Anda.' })
    } finally {
      setLoading(false)
    }
  }

  const handleShareApp = async () => {
    const url = window.location.href
    const text = `Portal Cek Invoice & Status Pesanan ${displayedStoreName}: ${url}`
    if (navigator.share) {
      try {
        await navigator.share({ title: displayedStoreName, text, url })
        return
      } catch {
        // cancel
      }
    }
    window.open(waLink(text), '_blank')
  }

  const contohNomors = getContohNomor(businessType)

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. TOP STICKY NAVBAR (FULL WIDTH 100%) */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-brand" onClick={() => setTab('cek')} title="Kembali ke Beranda">
            <div className="header-brand-logo">
              {businessType === 'servis' ? <Wrench size={22} /> : businessType === 'kuliner' ? <Utensils size={22} /> : businessType === 'percetakan' ? <Printer size={22} /> : businessType === 'jasa' ? <Briefcase size={22} /> : businessType === 'jastip' ? <Plane size={22} /> : <ShoppingBag size={22} />}
            </div>
            <div className="header-brand-info">
              <h1 className="header-brand-title">
                {displayedStoreName}
                <BadgeCheck size={18} className="verified-icon" />
              </h1>
              <p className="header-brand-subtitle">{currentPreset.tagline}</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="header-actions-group">
            <button
              className="hdr-btn preset-btn"
              onClick={() => setShowBizModal(true)}
              title="Ganti Jenis Bisnis Demo"
            >
              <span className="preset-name-full">🏷️ {currentPreset.name}</span>
              <span className="preset-name-short">🏷️ Bisnis</span>
              <ChevronDown size={14} />
            </button>

            <button
              className="hdr-btn ship-btn"
              onClick={toggleShipping}
              title="Ubah Mode Pengiriman (Opsi A)"
            >
              <span className="ship-icon">{hasShipping ? '🚚' : '📍'}</span>
              <span className="ship-label">{hasShipping ? 'Kurir' : 'Non-Kurir'}</span>
            </button>

            <button
              className="hdr-btn icon-only"
              onClick={() => setShowCustomizerModal(true)}
              title="Kustomisasi Toko & Warna Brand"
            >
              <Palette size={18} />
            </button>

            <button
              className="hdr-btn icon-only"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <a
              className="hdr-btn cs-btn"
              href={waLink(`Halo admin ${displayedStoreName}, saya ingin bertanya tentang pesanan saya.`, ADMIN_WA)}
              target="_blank"
              rel="noreferrer"
              title="Hubungi Admin WhatsApp"
            >
              <MessageCircle size={16} />
              <span>Chat CS</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT (CLEAN, USER-FRIENDLY & CENTERED) */}
      <main className="site-main-container" style={{ flex: 1, padding: '24px 16px 48px', maxWidth: tab === 'admin' ? '1120px' : '760px', margin: '0 auto', width: '100%' }}>
        
        {/* Navigation Tabs (Single clean segmented bar, accessible everywhere) */}
        <nav className="segmented-tabs" role="tablist" style={{ marginBottom: '22px' }}>
          <button
            role="tab"
            aria-selected={tab === 'cek'}
            className={`tab-btn ${tab === 'cek' ? 'active' : ''}`}
            onClick={() => setTab('cek')}
          >
            <Search size={18} />
            <span>Cek Invoice</span>
          </button>

          <button
            role="tab"
            aria-selected={tab === 'order'}
            className={`tab-btn ${tab === 'order' ? 'active' : ''}`}
            onClick={() => setTab('order')}
          >
            <ShoppingBag size={18} />
            <span>{currentPreset.labels.orderTab}</span>
          </button>

          <button
            role="tab"
            aria-selected={tab === 'calc'}
            className={`tab-btn ${tab === 'calc' ? 'active' : ''}`}
            onClick={() => setTab('calc')}
          >
            <CalcIcon size={18} />
            <span>{currentPreset.labels.calcTab}</span>
          </button>

          <button
            role="tab"
            aria-selected={tab === 'pay'}
            className={`tab-btn ${tab === 'pay' ? 'active' : ''}`}
            onClick={() => setTab('pay')}
          >
            <CreditCard size={18} />
            <span>Cara Bayar</span>
          </button>

          <button
            role="tab"
            aria-selected={tab === 'admin'}
            className={`tab-btn ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => setTab('admin')}
            style={isAdminLoggedIn ? { color: '#f59e0b', fontWeight: 800 } : {}}
          >
            <ShieldCheck size={18} />
            <span>{isAdminLoggedIn ? '👑 Admin' : 'Admin'}</span>
          </button>
        </nav>

        {/* TAB 1: CEK INVOICE */}
        {tab === 'cek' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Clean, Focused Search Box */}
            <div className="pro-card" style={{ padding: '24px 20px', margin: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 850, margin: '0 0 6px', color: 'var(--text-main)' }}>
                  Lacak Pesanan & Cek Invoice Resmi
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                  Masukkan nomor WhatsApp yang Anda gunakan saat pemesanan.
                </p>
              </div>

              <form
                className="search-form-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  cekInvoice()
                }}
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <PhoneCall size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="input-field"
                    style={{ paddingLeft: '40px', fontSize: '0.92rem', height: '46px' }}
                    placeholder="Contoh: 08123456789 atau 628123456789"
                    value={inputHp}
                    onChange={(e) => setInputHp(e.target.value)}
                    autoComplete="tel"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary search-submit-btn"
                  disabled={loading}
                >
                  <Search size={16} />
                  <span>{loading ? 'Mencari...' : 'Cek Status'}</span>
                </button>
              </form>

              {/* Simulation Chips */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  💡 Coba Simulasi Cepat:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {contohNomors.map((item) => (
                    <button
                      key={item.no}
                      type="button"
                      className="demo-chip"
                      style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                      onClick={() => {
                        setInputHp(item.no)
                        cekInvoice(item.no)
                      }}
                    >
                      <span className="chip-badge" style={{ marginRight: '4px' }}>{item.badge}</span>
                      <span>{item.no}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hasil Output Area */}
            <div id="out" aria-live="polite">
              {loading && <InvoiceSkeleton />}

              {!loading && hasil?.data && (
                <div className="active-search-indicator">
                  <span>
                    📋 Menampilkan Invoice: <strong>{hasil.data.nama}</strong> ({hasil.hp})
                  </span>
                  <button
                    className="btn-clear-search"
                    onClick={() => {
                      setHasil(null)
                      setInputHp('')
                    }}
                  >
                    Cek Nomor Lain ✕
                  </button>
                </div>
              )}

              {!loading && hasil?.error && (
                  <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '0.84rem', fontWeight: 600 }}>
                    <div>⚠️ {hasil.error}</div>
                    {hasil.tanya && (
                      <div style={{ marginTop: '10px' }}>
                        <a
                          className="btn-secondary btn-wa"
                          style={{ display: 'inline-flex', padding: '8px 14px', fontSize: '0.8rem' }}
                          href={waLink(`Halo admin ${displayedStoreName}, saya ingin cek status pesanan nomor ${hasil.hp}`, ADMIN_WA)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle size={16} /> Hubungi Admin via WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {!loading && hasil?.data && (
                  <InvoiceView
                    hp={hasil.hp}
                    c={hasil.data}
                    businessType={businessType}
                    hasShipping={hasShipping}
                    onShowToast={showToast}
                    isAdminLoggedIn={isAdminLoggedIn}
                    onOpenAdmin={() => setTab('admin')}
                  />
                )}
              </div>
            </div>
          )}

          {tab === 'order' && (
            <OrderForm
              businessType={businessType}
              hasShipping={hasShipping}
              initialItem={selectedCalcItem}
              onShowToast={showToast}
              onSelesai={(hp) => {
                setInputHp(hp)
                setTab('cek')
                cekInvoice(hp)
              }}
            />
          )}

          {tab === 'calc' && (
            <Calculator
              businessType={businessType}
              hasShipping={hasShipping}
              onShowToast={showToast}
              adminWa={ADMIN_WA}
              onOrderClick={(item) => {
                setSelectedCalcItem(item)
                setTab('order')
              }}
            />
          )}

          {tab === 'pay' && (
            <PaymentFaq
              businessType={businessType}
              onShowToast={showToast}
            />
          )}

          {tab === 'admin' && (
            <AdminDashboard
              businessType={businessType}
              hasShipping={hasShipping}
              currentPreset={currentPreset}
              displayedStoreName={displayedStoreName}
              isAdminLoggedIn={isAdminLoggedIn}
              setIsAdminLoggedIn={setIsAdminLoggedIn}
              onOpenCustomerInvoice={(hp) => {
                setInputHp(hp)
                setTab('cek')
                cekInvoice(hp)
              }}
              onShowToast={showToast}
            />
          )}
        </main>

      {/* 4. FEATURES & VALUE PROPOSITION SECTION */}
      {tab !== 'admin' && (
        <section className="features-section">
          <div className="features-container">
            <div className="section-header-center">
              <span className="section-badge-center">KEUNGGULAN SISTEM</span>
              <h2 className="section-title-center">Mengapa Pelanggan & Klien Menyukai Portal Ini?</h2>
              <p className="section-subtitle-center">
                Solusi pelacakan pesanan dan invoice otomatis yang mempermudah pembeli dan menghemat waktu admin toko hingga 80%.
              </p>
            </div>

            <div className="features-cards-grid">
              <div className="feature-item-card">
                <div className="feature-icon-circle">
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Lacak Progres Real-Time</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Pelanggan cukup memasukkan nomor WhatsApp untuk mengetahui apakah pesanan sedang dikemas, dikerjakan teknisi, atau sedang dikirim kurir.
                </p>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-circle">
                  <FileText size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>E-Receipt & Dokumen PDF A5</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Dilengkapi nomor invoice resmi, stempel basah lunas otomatis, dan barcode autentik yang bisa langsung dicetak kasir atau disimpan sebagai PDF.
                </p>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-circle">
                  <CreditCard size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Pembayaran Cepat & Terverifikasi</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Fitur 1-klik salin nomor rekening bank BCA, Mandiri, SeaBank, serta scan QRIS Universal yang kompatibel dengan seluruh m-banking dan e-wallet.
                </p>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-circle">
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Transparan & Bergaransi</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Rincian biaya barang, fee, ongkos kirim, diskon promo, dan catatan garansi tertera secara gamblang tanpa biaya tersembunyi.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW IT WORKS SECTION */}
      {tab !== 'admin' && (
        <section className="how-it-works-section">
          <div className="features-container">
            <div className="section-header-center">
              <span className="section-badge-center">ALUR MUDAH</span>
              <h2 className="section-title-center">Cara Kerja Pesanan Anda</h2>
              <p className="section-subtitle-center">
                4 langkah mudah dari pemesanan hingga barang tiba di tangan Anda.
              </p>
            </div>

            <div className="how-steps-grid">
              <div className="step-card">
                <span className="step-number">01</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Buat Pesanan</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Kirimkan rincian kebutuhan melalui form pemesanan atau chat WhatsApp toko kami.
                </p>
              </div>

              <div className="step-card">
                <span className="step-number">02</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Cek Tagihan Invoice</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Buka link invoice resmi untuk melihat rincian harga, ongkir, dan nomor rekening pembayaran.
                </p>
              </div>

              <div className="step-card">
                <span className="step-number">03</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Pantau Pengerjaan</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Status akan otomatis ter-update di stepper tracking saat pesanan diproses atau dikemas.
                </p>
              </div>

              <div className="step-card">
                <span className="step-number">04</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Pengiriman / Selesai</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Dapatkan nomor resi kurir pengantaran atau ambil langsung unit di workshop kami.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. GRAND FULL-WIDTH FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div className="header-brand-logo" style={{ width: '36px', height: '36px' }}>
                {businessType === 'servis' ? <Wrench size={18} /> : businessType === 'kuliner' ? <Utensils size={18} /> : businessType === 'percetakan' ? <Printer size={18} /> : businessType === 'jasa' ? <Briefcase size={18} /> : businessType === 'jastip' ? <Plane size={18} /> : <ShoppingBag size={18} />}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{displayedStoreName}</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>
              {currentPreset.tagline}. Portal resmi untuk transaksi transparan, cek invoice, dan pelacakan progres pesanan.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
              🕒 <strong>Jam Operasional:</strong><br />
              Senin - Sabtu: 08.00 - 21.00 WIB<br />
              Minggu & Tanggal Merah: Tetap Buka (Respon Cepat)
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Navigasi Portal</h4>
            <ul className="footer-links-list">
              <li onClick={() => setTab('cek')}>🔍 Cek Status Pesanan</li>
              <li onClick={() => setTab('order')}>🛒 Formulir Order Baru</li>
              <li onClick={() => setTab('calc')}>🧮 Kalkulator Estimasi Biaya</li>
              <li onClick={() => setTab('pay')}>💳 Rekening Bank & QRIS</li>
              <li onClick={() => setTab('admin')}>👑 Portal Pemilik & Kasir (Admin)</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Solusi Multi-Bisnis</h4>
            <ul className="footer-links-list">
              <li onClick={() => handleSwitchBiz('olshop')}>🛍️ Toko Online & Butik Fashion</li>
              <li onClick={() => handleSwitchBiz('servis')}>🔧 Reparasi Servis HP & Laptop</li>
              <li onClick={() => handleSwitchBiz('kuliner')}>🍲 Katering Makanan & Bakery</li>
              <li onClick={() => handleSwitchBiz('percetakan')}>🖨️ Percetakan & Sablon Kaos</li>
              <li onClick={() => handleSwitchBiz('jasa')}>💼 Digital Agency & Freelancer</li>
              <li onClick={() => handleSwitchBiz('jastip')}>✈️ Jasa Titip Luar Negeri (Jastip)</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Keamanan & Ekspedisi</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
              Mendukung pembayaran transfer seluruh bank nasional, QRIS All Payment, serta pengiriman via SiCepat, J&T, JNE, dan GrabExpress.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>BCA</span>
              <span style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>Mandiri</span>
              <span style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>QRIS</span>
              <span style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>SiCepat</span>
              <span style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>J&T</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            © 2026 <strong>{displayedStoreName}</strong>. Hak Cipta Dilindungi. Sistem Pelacakan Invoice & Order UMKM.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowCustomizerModal(true)}>🎨 Kustomisasi Brand</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setTab('admin')}>🔒 Login Admin</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowSellerGuide(true)}>🚀 Panduan Jual ke Klien</span>
          </div>
        </div>
      </footer>

      {/* 7. FLOATING WHATSAPP BUTTON */}
      <a
        className="floating-wa-btn"
        href={waLink(`Halo admin ${displayedStoreName}, saya ingin bertanya tentang pesanan saya.`, ADMIN_WA)}
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin WhatsApp"
      >
        <MessageCircle size={20} />
        <span>Chat CS</span>
      </a>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={18} color="var(--success)" />
          {toastMessage}
        </div>
      )}

      {/* Live Brand & Color Customizer Modal (Fitur Pamungkas Jualan ke Klien!) */}
      {showCustomizerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowCustomizerModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={20} color="var(--primary)" />
                Kustomisasi Brand Klien
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                onClick={() => setShowCustomizerModal(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Ubah nama toko dan warna aksen secara live di depan klien untuk demonstrasi:
            </p>

            {/* Input Nama Toko Klien */}
            <div className="input-group">
              <label className="input-label">Nama Toko / Usaha Klien</label>
              <input
                className="input-field no-icon"
                value={customStoreName}
                placeholder={currentPreset.defaultStoreName}
                onChange={(e) => {
                  setCustomStoreName(e.target.value)
                  localStorage.setItem('portal_custom_store_name', e.target.value)
                }}
              />
            </div>

            {/* Pilihan Warna Tema Toko */}
            <div className="input-group">
              <label className="input-label">Warna Utama Brand (Theme Accent)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '6px' }}>
                {[
                  { id: 'indigo', name: 'Indigo', hex: '#4f46e5' },
                  { id: 'emerald', name: 'Emerald', hex: '#059669' },
                  { id: 'ocean', name: 'Ocean', hex: '#0284c7' },
                  { id: 'rose', name: 'Rose', hex: '#e11d48' },
                  { id: 'amber', name: 'Amber', hex: '#d97706' }
                ].map((col) => (
                  <button
                    key={col.id}
                    style={{
                      height: '42px',
                      borderRadius: '10px',
                      background: col.hex,
                      border: colorTheme === col.id ? '3px solid #fff' : '2px solid transparent',
                      boxShadow: colorTheme === col.id ? '0 0 0 2px var(--text-main)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}
                    title={col.name}
                    onClick={() => handleSwitchColor(col.id)}
                  >
                    {colorTheme === col.id && <Check size={18} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setCustomStoreName('')
                  localStorage.removeItem('portal_custom_store_name')
                  handleSwitchColor('indigo')
                  showToast('Pengaturan toko direset ke default.')
                }}
              >
                Reset Default
              </button>

              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => setShowCustomizerModal(false)}
              >
                Simpan & Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Type Switcher Modal */}
      {showBizModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowBizModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                Pilih Tipe Bisnis / Industri
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                onClick={() => setShowBizModal(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px' }}>
              Pilih jenis usaha untuk melihat tampilan, formulir, tahapan tracking, dan kalkulator yang disesuaikan:
            </p>

            <div style={{ display: 'grid', gap: '8px' }}>
              {Object.values(BUSINESS_PRESETS).map((b) => (
                <button
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: businessType === b.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: businessType === b.id ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}
                  onClick={() => handleSwitchBiz(b.id)}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: businessType === b.id ? 'var(--primary)' : 'var(--text-main)' }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Contoh: {b.defaultStoreName} • {b.hasShipping ? '🚚 Kurir Ekspedisi' : '📍 Ambil di Toko / Non-Fisik'}
                    </div>
                  </div>
                  {businessType === b.id && <Check size={18} color="var(--primary)" />}
                </button>
              ))}
            </div>

            {/* Sub-setting: Opsi Pengiriman Toggle di Modal */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Perlu Pengiriman Kurir?</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aktifkan jika butuh nomor resi & ongkir</div>
              </div>
              <button
                className="demo-chip"
                style={{
                  background: hasShipping ? 'var(--success-bg)' : 'var(--bg-input)',
                  color: hasShipping ? 'var(--success)' : 'var(--text-muted)',
                  fontWeight: 800
                }}
                onClick={toggleShipping}
              >
                {hasShipping ? '✓ Aktif' : '✕ Ambil di Toko'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Guide Modal */}
      {showSellerGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowSellerGuide(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                🚀 Cara Menjual ke Segala Jenis Bisnis
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                onClick={() => setShowSellerGuide(false)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Aplikasi ini adalah <strong>Universal Order & Invoice Tracking Portal</strong>. Anda bisa menjual aplikasi ini ke berbagai klien usaha di sekitar Anda:
            </p>

            <div style={{ display: 'grid', gap: '8px', margin: '14px 0', fontSize: '0.78rem' }}>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>🛍️ Toko Online / Butik Fashion</strong>: Lacak resi SiCepat/J&T, rincian produk, dan kalkulator diskon promo.
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>🔧 Servis HP / Laptop / Bengkel</strong>: Lacak progres diagnosa, pengerjaan teknisi, biaya sparepart & jasa (Non-Pengiriman / Ambil di Tempat).
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>🍲 Katering, Makanan & Bakery</strong>: Lacak pesanan nasi box, estimasi budget porsi, dan jadwal ambil/antar.
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>🖨️ Percetakan, Sablon & Konveksi</strong>: Lacak file masuk, ACC desain, produksi sablon, dan ekspedisi kargo.
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>💼 Digital Agency & Freelance</strong>: Invoice tagihan proyek, status revisi, dan serah terima file digital (100% Non-Fisik).
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>✈️ Jasa Titip (Jastip)</strong>: Kalkulator kurs luar negeri (Baht, Yen, Dollar) dan fee titip.
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowSellerGuide(false)}>
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
