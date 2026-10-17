import { useState, useEffect } from 'react'
import { normalisasiHp, submitOrder } from '../services/data'
import { BUSINESS_PRESETS, ADMIN_WA } from '../config'
import confetti from 'canvas-confetti'
import {
  ShoppingBag,
  Plus,
  Trash2,
  Send,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Search,
  Wrench,
  Utensils,
  Printer,
  Briefcase
} from 'lucide-react'

const emptyItem = () => ({
  barang: '',
  brand: '',
  motif: '',
  ukuran: '',
  qty: 1,
  catatan: ''
})

export default function OrderForm({ businessType = 'olshop', hasShipping = true, onSelesai, initialItem, onShowToast }) {
  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop
  const labels = currentPreset.labels

  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [kota, setKota] = useState('')
  const [items, setItems] = useState([
    initialItem ? { ...emptyItem(), ...initialItem } : emptyItem()
  ])
  const [website, setWebsite] = useState('') // honeypot anti-spam
  const [state, setState] = useState({ status: 'isi', pesan: '' })

  useEffect(() => {
    if (initialItem && initialItem.barang) {
      setItems([{ ...emptyItem(), ...initialItem }])
    }
  }, [initialItem])

  const updateItem = (idx, field, val) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, [field]: val } : it)))
  }

  const changeQty = (idx, delta) => {
    setItems(
      items.map((it, i) => {
        if (i !== idx) return it
        const newQty = Math.max(1, (Number(it.qty) || 1) + delta)
        return { ...it, qty: newQty }
      })
    )
  }

  const addItem = () => {
    setItems([...items, emptyItem()])
  }

  const removeItem = (idx) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  async function kirim() {
    const nomor = normalisasiHp(hp)
    const validItems = items.filter((i) => i.barang.trim())

    if (!nama.trim()) {
      return setState({ status: 'isi', pesan: 'Mohon isi nama lengkap Anda.' })
    }
    if (nomor.length < 9) {
      return setState({ status: 'isi', pesan: 'Nomor WhatsApp belum valid (minimal 9 digit).' })
    }
    if (!validItems.length) {
      return setState({ status: 'isi', pesan: 'Mohon isi minimal satu rincian pesanan.' })
    }

    setState({ status: 'kirim', pesan: '' })

    try {
      const orderPayload = {
        nama: nama.trim(),
        hp: nomor,
        kota: kota.trim(),
        items: validItems,
        website
      }

      const res = await submitOrder(orderPayload, businessType)
      if (!res.ok) throw new Error()

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch {
        // ignore
      }

      // Format template WhatsApp lengkap dan rapi
      const itemsListText = validItems.map((i, idx) => {
        const parts = [
          `${idx + 1}. *${i.barang}*`,
          i.brand && i.brand !== '-' ? `[${i.brand}]` : '',
          i.motif && i.motif !== '-' ? `(${i.motif})` : '',
          i.ukuran && i.ukuran !== '-' ? `[Size: ${i.ukuran}]` : '',
          `x${i.qty || 1} pcs`,
          i.catatan ? `(Catatan: ${i.catatan})` : ''
        ].filter(Boolean)
        return parts.join(' ')
      }).join('\n')

      const invoiceOnlineUrl = `${window.location.origin}${window.location.pathname}?hp=${nomor}`

      const waOrderMessage = [
        `*PESANAN BARU - ${currentPreset.defaultStoreName}*`,
        '================================',
        `👤 *Nama Pemesan:* ${nama.trim()}`,
        `📱 *No. WhatsApp:* ${nomor}`,
        kota.trim() ? `📍 *Kota / Alamat:* ${kota.trim()}` : null,
        '',
        '*📋 Rincian Barang yang Dipesan:*',
        itemsListText,
        '',
        `🔗 *Cek Invoice & Tracking Online:*`,
        invoiceOnlineUrl,
        '================================',
        'Halo Admin, saya baru saja membuat pesanan di atas melalui website. Mohon segera dicek & dihitung totalannya ya kak. Terima kasih! 🙏'
      ].filter(Boolean).join('\n')

      const waDirectUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waOrderMessage)}`

      // Buka otomatis WhatsApp di tab baru saat pesanan terkirim
      try {
        window.open(waDirectUrl, '_blank')
      } catch {
        // diblokir browser popup blocker, tombol tetap tampil di UI
      }

      onShowToast?.('Pesanan berhasil dicatat di sistem antrean!')
      setState({ status: 'sukses', pesan: nomor, waUrl: waDirectUrl })
    } catch {
      setState({ status: 'isi', pesan: 'Gagal mengirim pesanan. Periksa koneksi dan coba lagi.' })
    }
  }

  if (state.status === 'sukses') {
    return (
      <div className="pro-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
        <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 14px' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
          Pesanan Berhasil Dicatat di Sistem!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: '0 auto 20px', lineHeight: 1.5, maxWidth: '520px' }}>
          Pesanan atas nama <strong>{nama}</strong> ({state.pesan}) sudah tersimpan di antrean toko. Klik tombol hijau di bawah untuk mengirimkan rincian pesanan langsung ke WhatsApp toko kami agar segera diproses oleh admin.
        </p>

        <div style={{ display: 'grid', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
          <a
            className="btn-primary btn-wa"
            style={{ padding: '14px 18px', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' }}
            href={state.waUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} />
            Kirim Rincian ke WhatsApp Toko Sekarang
          </a>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '12px 18px', fontSize: '0.88rem' }}
            onClick={() => onSelesai(state.pesan)}
          >
            <Search size={16} />
            Lihat Status Pesanan & Invoice di Portal
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'left', lineHeight: 1.5 }}>
          💡 <strong>Tips Pembeli:</strong> Anda dapat kembali ke halaman web ini kapan saja dan memasukkan nomor WhatsApp <strong>{state.pesan}</strong> di menu "Cek Invoice" untuk melacak progres, melihat total tagihan, dan mengunduh struk PDF resmi.
        </div>
      </div>
    )
  }

  return (
    <div className="pro-card">
      <div className="pro-card-header">
        <div>
          <h2 className="card-title">
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            {labels.orderTitle}
          </h2>
          <p className="card-subtitle">{labels.orderSubtitle}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="input-group">
        <label className="input-label" htmlFor="order-nama">Nama Lengkap / Instansi</label>
        <div className="input-field-wrapper">
          <span className="input-field-icon"><User size={18} /></span>
          <input
            id="order-nama"
            className="input-field"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Siti Rahmawati / PT Maju"
          />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="order-hp">Nomor WhatsApp Aktif</label>
        <div className="input-field-wrapper">
          <span className="input-field-icon"><Phone size={18} /></span>
          <input
            id="order-hp"
            type="tel"
            inputMode="numeric"
            className="input-field"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="081234567890"
          />
        </div>
      </div>

      {hasShipping && (
        <div className="input-group">
          <label className="input-label" htmlFor="order-kota">Kota / Alamat Pengiriman (Opsional)</label>
          <div className="input-field-wrapper">
            <span className="input-field-icon"><MapPin size={18} /></span>
            <input
              id="order-kota"
              className="input-field"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              placeholder="Contoh: Jakarta Barat / Bandung"
            />
          </div>
        </div>
      )}

      <input
        className="hp-trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      {/* Dynamic Item Cards */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label className="input-label" style={{ margin: 0 }}>
            Daftar {labels.itemTitle} ({items.length} Item)
          </label>
        </div>

        {items.map((it, idx) => (
          <div key={idx} className="order-item-box">
            <div className="order-item-header">
              <span>{labels.itemTitle} #{idx + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  className="delete-item-btn"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 size={14} /> Hapus
                </button>
              )}
            </div>

            <div className="input-group" style={{ marginBottom: '8px' }}>
              <input
                className="input-field no-icon"
                value={it.barang}
                onChange={(e) => updateItem(idx, 'barang', e.target.value)}
                placeholder={`* ${labels.itemColName}`}
              />
            </div>

            <div className="order-grid-3" style={{ marginBottom: '8px' }}>
              <input
                className="input-field no-icon"
                value={it.brand}
                onChange={(e) => updateItem(idx, 'brand', e.target.value)}
                placeholder={labels.itemColBrand}
              />
              <input
                className="input-field no-icon"
                value={it.motif}
                onChange={(e) => updateItem(idx, 'motif', e.target.value)}
                placeholder={labels.itemColVariant}
              />
              <input
                className="input-field no-icon"
                value={it.ukuran}
                onChange={(e) => updateItem(idx, 'ukuran', e.target.value)}
                placeholder={labels.itemColSize}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Jumlah:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '4px 8px', minWidth: '28px' }}
                  onClick={() => changeQty(idx, -1)}
                >
                  -
                </button>
                <span style={{ fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                  {it.qty || 1}
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '4px 8px', minWidth: '28px' }}
                  onClick={() => changeQty(idx, 1)}
                >
                  +
                </button>
              </div>
            </div>

            <input
              className="input-field no-icon"
              value={it.catatan}
              onChange={(e) => updateItem(idx, 'catatan', e.target.value)}
              placeholder="Catatan tambahan / instruksi khusus (opsional)"
            />
          </div>
        ))}

        <button
          type="button"
          className="demo-chip"
          style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '4px' }}
          onClick={addItem}
        >
          <Plus size={16} /> + Tambah {labels.itemTitle} Lain
        </button>
      </div>

      {state.pesan && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, marginTop: '14px' }}>
          ⚠️ {state.pesan}
        </div>
      )}

      <button
        className="btn-primary"
        style={{ marginTop: '16px' }}
        disabled={state.status === 'kirim'}
        onClick={kirim}
      >
        {state.status === 'kirim' ? (
          'Mengirim Pesanan...'
        ) : (
          <>
            <Send size={18} /> Kirim Pesanan Sekarang
          </>
        )}
      </button>
    </div>
  )
}
