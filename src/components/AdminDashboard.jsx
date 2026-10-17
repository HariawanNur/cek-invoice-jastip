import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Lock,
  Search,
  Plus,
  Download,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Eye,
  Edit3,
  Trash2,
  Share2,
  MessageCircle,
  ExternalLink,
  DollarSign,
  Package,
  TrendingUp,
  RefreshCw,
  X,
  Check
} from 'lucide-react'
import {
  rupiah,
  getAllOrders,
  updateOrderAdmin,
  createOrderAdmin,
  deleteOrderAdmin,
  getAdminPin,
  setAdminPin,
  resetStoredOrders
} from '../services/data'

export default function AdminDashboard({
  businessType,
  hasShipping,
  currentPreset,
  displayedStoreName,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onOpenCustomerInvoice,
  onShowToast
}) {
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'unpaid' | 'dp' | 'lunas' | 'no_resi'
  
  // Modals
  const [editingOrder, setEditingOrder] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [newPinInput, setNewPinInput] = useState('')

  // Form Buat Invoice Baru
  const [newOrderForm, setNewOrderForm] = useState({
    nama: '',
    hp: '',
    ongkir: 0,
    diskon: 0,
    dp: 0,
    ekspedisi: 'SiCepat Reguler',
    resi: '',
    items: [{ barang: '', motif: '', ukuran: '', harga: '', catatan: '' }]
  })

  // Load orders when component mounts or businessType/shipping changes
  const refreshOrders = () => {
    const list = getAllOrders(businessType, hasShipping)
    setOrders(list)
  }

  useEffect(() => {
    refreshOrders()
  }, [businessType, hasShipping])

  // Handle Login PIN
  const handleLogin = (e) => {
    e.preventDefault()
    const validPin = getAdminPin()
    if (pinInput.trim() === validPin) {
      setIsAdminLoggedIn(true)
      setPinError('')
      setPinInput('')
      onShowToast?.('Selamat datang, Admin! Mode Kasir & Dashboard Aktif.')
    } else {
      setPinError('PIN salah! Coba gunakan PIN default: 1234')
    }
  }

  // Handle Logout
  const handleLogout = () => {
    setIsAdminLoggedIn(false)
    onShowToast?.('Keluar dari Mode Admin.')
  }

  // Handle Ganti PIN
  const handleSavePin = (e) => {
    e.preventDefault()
    if (newPinInput.length < 4) {
      alert('PIN minimal 4 digit!')
      return
    }
    setAdminPin(newPinInput)
    setShowPinModal(false)
    setNewPinInput('')
    onShowToast?.('PIN Admin berhasil diperbarui!')
  }

  // Hitung Metrik Keuangan & Penjualan
  const totalOmset = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalPiutang = orders.reduce((sum, o) => sum + (o.sisa || 0), 0)
  const countLunas = orders.filter(o => o.lunas).length
  const countPerluKirim = orders.filter(o => hasShipping && !o.resi && (o.lunas || o.dp > 0)).length

  // Filter Orders
  const filteredOrders = orders.filter(o => {
    const matchSearch = (
      o.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.hp.includes(searchQuery) ||
      o.items.some(i => (i.barang || '').toLowerCase().includes(searchQuery.toLowerCase()))
    )
    if (!matchSearch) return false

    if (filterStatus === 'unpaid') return !o.lunas && o.dp === 0
    if (filterStatus === 'dp') return o.dp > 0 && !o.lunas
    if (filterStatus === 'lunas') return o.lunas
    if (filterStatus === 'no_resi') return hasShipping && !o.resi
    return true
  })

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['No. Invoice', 'Tanggal', 'Nama Pelanggan', 'WhatsApp', 'Barang', 'Subtotal', 'Ongkir', 'Diskon', 'Total', 'DP', 'Sisa', 'Status', 'Ekspedisi', 'Resi']
    const rows = orders.map(o => [
      `INV-2026-${o.hp.slice(-4)}`,
      `"${o.orderDate || ''}"`,
      `"${o.nama}"`,
      `"${o.hp}"`,
      `"${o.items.map(i => `${i.barang} (${rupiah(i.harga)})`).join('; ')}"`,
      o.subtotal,
      o.ongkir,
      o.diskon,
      o.total,
      o.dp,
      o.sisa,
      o.lunas ? 'LUNAS' : o.dp > 0 ? 'DP' : 'BELUM',
      `"${o.ekspedisi || ''}"`,
      `"${o.resi || ''}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Laporan-Penjualan-${businessType}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onShowToast?.('Laporan Penjualan CSV berhasil diunduh!')
  }

  // Handle Edit Simpan
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingOrder) return

    updateOrderAdmin(businessType, editingOrder.hp, {
      dp: Number(editingOrder.dp || 0),
      ongkir: Number(editingOrder.ongkir || 0),
      diskon: Number(editingOrder.diskon || 0),
      ekspedisi: editingOrder.ekspedisi,
      resi: editingOrder.resi,
      stage: editingOrder.stage,
      items: editingOrder.items
    })

    setEditingOrder(null)
    refreshOrders()
    onShowToast?.(`Invoice ${editingOrder.nama} berhasil diperbarui!`)
  }

  // Quick Toggle Lunas
  const handleToggleLunas = (order) => {
    const newItems = order.items.map(i => ({ ...i, status: order.lunas ? 'Belum' : 'Lunas' }))
    const newDp = order.lunas ? 0 : order.total
    updateOrderAdmin(businessType, order.hp, {
      dp: newDp,
      stage: order.lunas ? 'received' : order.resi ? 'shipped' : 'packing',
      items: newItems
    })
    refreshOrders()
    onShowToast?.(order.lunas ? `Status diubah ke Belum Lunas` : `Tagihan ${order.nama} ditandai LUNAS! ✅`)
  }

  // Hapus Order
  const handleDelete = (order) => {
    if (confirm(`Yakin ingin menghapus invoice milik ${order.nama} (${order.hp})?`)) {
      deleteOrderAdmin(businessType, order.hp)
      refreshOrders()
      onShowToast?.('Invoice berhasil dihapus.')
    }
  }

  // Handle Buat Order Baru
  const handleCreateOrder = (e) => {
    e.preventDefault()
    if (!newOrderForm.nama.trim() || !newOrderForm.hp.trim()) {
      alert('Nama dan Nomor WhatsApp wajib diisi!')
      return
    }

    const validItems = newOrderForm.items.filter(i => i.barang.trim()).map(i => ({
      barang: i.barang.trim(),
      motif: i.motif || '-',
      ukuran: i.ukuran || '-',
      harga: Number(i.harga || 0),
      jastip: 0,
      catatan: i.catatan || '',
      status: Number(newOrderForm.dp) >= Number(i.harga) ? 'Lunas' : 'Belum'
    }))

    if (!validItems.length) {
      alert('Minimal isi 1 nama barang/jasa!')
      return
    }

    createOrderAdmin(businessType, newOrderForm.hp, {
      nama: newOrderForm.nama.trim(),
      ongkir: Number(newOrderForm.ongkir || 0),
      diskon: Number(newOrderForm.diskon || 0),
      dp: Number(newOrderForm.dp || 0),
      ekspedisi: newOrderForm.ekspedisi,
      resi: newOrderForm.resi,
      items: validItems
    })

    setShowCreateModal(false)
    refreshOrders()
    onShowToast?.(`Invoice baru untuk ${newOrderForm.nama} berhasil dibuat!`)

    // Buka langsung ke customer invoice
    onOpenCustomerInvoice?.(newOrderForm.hp)
  }

  // WA Helper
  const sendWaNotif = (order, type) => {
    const origin = window.location.origin + window.location.pathname
    const invoiceLink = `${origin}?hp=${encodeURIComponent(order.hp)}`
    let message = ''

    if (type === 'invoice') {
      message = `Halo Kak *${order.nama}*, terima kasih telah bertransaksi di *${displayedStoreName}*.\n\nBerikut link rincian invoice & status pesanan Anda:\n👉 ${invoiceLink}\n\n*Total Tagihan:* ${rupiah(order.total)}\n*Sisa Pembayaran:* ${rupiah(order.sisa)}\n\nTerima kasih! 🙏`
    } else if (type === 'resi') {
      message = `Halo Kak *${order.nama}*! 📦\nPesanan Anda dari *${displayedStoreName}* sudah dikirim via *${order.ekspedisi || 'Kurir'}*.\n\n*No. Resi Pengiriman:* ${order.resi}\nLacak paket Anda di sini: 👉 ${invoiceLink}\n\nTerima kasih! ✨`
    } else if (type === 'lunas') {
      message = `Halo Kak *${order.nama}*! ✅\nPembayaran invoice Anda di *${displayedStoreName}* sudah *LUNAS PENUH*.\n\nLihat struk lunas resmi: 👉 ${invoiceLink}\n\nTerima kasih atas kepercayaannya! 🙏`
    }

    window.open(`https://wa.me/${order.hp.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  // 1. TAMPILAN LOGIN JIKA BELUM LOGGED IN
  if (!isAdminLoggedIn) {
    return (
      <div className="pro-card" style={{ maxWidth: '440px', margin: '20px auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '14px' }}>
          <ShieldCheck size={36} />
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 800 }}>Portal Pemilik Toko & Kasir</h2>
        <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Akses khusus admin untuk kelola semua order, ubah status LUNAS, input nomor resi, dan buat invoice manual.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textAlign: 'left', marginBottom: '6px' }}>
              Masukkan 4-Digit PIN Admin:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                maxLength={8}
                className="input-field"
                placeholder="PIN Keamanan (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3em', fontWeight: 800 }}
                autoFocus
              />
            </div>
            {pinError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '6px', fontWeight: 600 }}>
                {pinError}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
            <Lock size={16} /> Buka Dashboard Admin
          </button>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
            💡 <strong>Demo Mode:</strong> Gunakan PIN bawaan <code style={{ fontWeight: 800, color: 'var(--primary)' }}>1234</code> untuk membuka portal admin demo ini.
          </div>
        </form>
      </div>
    )
  }

  // 2. TAMPILAN DASHBOARD UTAMA JIKA SUDAH LOGGED IN
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      {/* Top Banner Control */}
      <div className="pro-card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)', borderColor: 'var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-status lunas" style={{ fontSize: '0.7rem' }}>👑 MODE ADMIN AKTIF</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kategori: {currentPreset.name}</span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Panel Kelola Pesanan & Kasir
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={15} /> Buat Invoice Baru
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={handleExportCsv}
              title="Unduh file Excel / CSV rekap penjualan"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => setShowPinModal(true)}
              title="Ganti PIN Keamanan Admin"
            >
              <Key size={15} /> PIN
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--danger)' }}
              onClick={handleLogout}
              title="Keluar dari mode admin"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <div className="pro-card" style={{ padding: '14px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TOTAL OMSET</span>
            <DollarSign size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px', color: 'var(--text-main)' }}>
            {rupiah(totalOmset)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{orders.length} Transaksi Tercatat</div>
        </div>

        <div className="pro-card" style={{ padding: '14px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>BELUM LUNAS / PIUTANG</span>
            <AlertCircle size={16} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px', color: 'var(--danger)' }}>
            {rupiah(totalPiutang)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tagihan yang belum dibayar</div>
        </div>

        <div className="pro-card" style={{ padding: '14px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TRANSAKSI LUNAS</span>
            <CheckCircle2 size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px', color: 'var(--success)' }}>
            {countLunas} Order
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Pembayaran 100% selesai</div>
        </div>

        {hasShipping ? (
          <div className="pro-card" style={{ padding: '14px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
              <span>PERLU DIKIRIM (RESI)</span>
              <Truck size={16} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px', color: '#f59e0b' }}>
              {countPerluKirim} Paket
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Menunggu nomor resi kurir</div>
          </div>
        ) : (
          <div className="pro-card" style={{ padding: '14px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
              <span>AMBIL DI WORKSHOP</span>
              <Package size={16} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 2px', color: '#3b82f6' }}>
              {orders.length - countLunas} Aktif
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Non-kurir / Pick-up</div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="pro-card" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px', fontSize: '0.84rem' }}
              placeholder="Cari nama pelanggan, no. WhatsApp, atau nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              className={`demo-chip ${filterStatus === 'all' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'all' ? 'var(--primary)' : 'var(--bg-input)',
                color: filterStatus === 'all' ? '#fff' : 'var(--text-main)',
                fontSize: '0.74rem'
              }}
              onClick={() => setFilterStatus('all')}
            >
              Semua ({orders.length})
            </button>
            <button
              className={`demo-chip ${filterStatus === 'unpaid' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'unpaid' ? 'var(--danger)' : 'var(--bg-input)',
                color: filterStatus === 'unpaid' ? '#fff' : 'var(--text-main)',
                fontSize: '0.74rem'
              }}
              onClick={() => setFilterStatus('unpaid')}
            >
              🔴 Belum Bayar
            </button>
            <button
              className={`demo-chip ${filterStatus === 'dp' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'dp' ? 'var(--warning)' : 'var(--bg-input)',
                color: filterStatus === 'dp' ? '#fff' : 'var(--text-main)',
                fontSize: '0.74rem'
              }}
              onClick={() => setFilterStatus('dp')}
            >
              🟡 DP Terbayar
            </button>
            <button
              className={`demo-chip ${filterStatus === 'lunas' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'lunas' ? 'var(--success)' : 'var(--bg-input)',
                color: filterStatus === 'lunas' ? '#fff' : 'var(--text-main)',
                fontSize: '0.74rem'
              }}
              onClick={() => setFilterStatus('lunas')}
            >
              🟢 Lunas
            </button>
            {hasShipping && (
              <button
                className={`demo-chip ${filterStatus === 'no_resi' ? 'active' : ''}`}
                style={{
                  background: filterStatus === 'no_resi' ? '#8b5cf6' : 'var(--bg-input)',
                  color: filterStatus === 'no_resi' ? '#fff' : 'var(--text-main)',
                  fontSize: '0.74rem'
                }}
                onClick={() => setFilterStatus('no_resi')}
              >
                📦 Perlu Resi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredOrders.length === 0 ? (
          <div className="pro-card" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tidak ada invoice yang sesuai filter</div>
            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Coba ubah kata kunci pencarian atau status filter.</div>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isLunas = order.lunas
            const hasDp = order.dp > 0 && !isLunas
            const isUnpaid = !isLunas && !hasDp

            return (
              <div
                key={order.hp}
                className="pro-card"
                style={{
                  padding: '16px',
                  display: 'grid',
                  gap: '12px',
                  borderLeft: `5px solid ${isLunas ? 'var(--success)' : hasDp ? '#f59e0b' : 'var(--danger)'}`
                }}
              >
                {/* Header Card: Pelanggan & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{order.nama}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({order.hp})</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      INV-2026-{order.hp.slice(-4)} • Tanggal: {order.orderDate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {isLunas ? (
                      <span className="badge-status lunas" style={{ fontSize: '0.72rem' }}>✓ LUNAS</span>
                    ) : hasDp ? (
                      <span className="badge-status lunas" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontSize: '0.72rem' }}>
                        DP: {rupiah(order.dp)}
                      </span>
                    ) : (
                      <span className="badge-status pending" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca', fontSize: '0.72rem' }}>
                        BELUM BAYAR
                      </span>
                    )}

                    {hasShipping && order.resi && (
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        🚚 {order.resi}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Brief */}
                <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)' }}>Rincian Barang / Jasa:</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '3px' }}>
                    {order.items.map((it, idx) => (
                      <li key={idx}>
                        <strong>{it.barang}</strong> {it.motif && it.motif !== '-' ? `(${it.motif})` : ''} -{' '}
                        {it.harga ? rupiah(it.harga) : 'Menunggu estimasi'}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financial Summary Line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.82rem' }}>
                    Total: <strong style={{ color: 'var(--primary)' }}>{rupiah(order.total)}</strong>
                    {order.dp > 0 && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>(DP: {rupiah(order.dp)})</span>}
                    {order.sisa > 0 ? (
                      <span style={{ color: 'var(--danger)', fontWeight: 800, marginLeft: '8px' }}>
                        Sisa: {rupiah(order.sisa)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--success)', fontWeight: 800, marginLeft: '8px' }}>
                        (LUNAS PENUH)
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Group */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {/* 1-Click Toggle Lunas */}
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                      onClick={() => handleToggleLunas(order)}
                      title="Klik untuk ubah cepat status lunas"
                    >
                      <Check size={14} color={isLunas ? 'var(--text-muted)' : 'var(--success)'} />
                      {isLunas ? 'Batal Lunas' : 'Tandai Lunas'}
                    </button>

                    {/* Quick WhatsApp Share Notification */}
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                      onClick={() => sendWaNotif(order, isLunas ? 'lunas' : order.resi ? 'resi' : 'invoice')}
                      title="Kirim notifikasi tagihan atau resi langsung ke WhatsApp customer"
                    >
                      <MessageCircle size={14} color="#25D366" /> WA
                    </button>

                    {/* View Customer Invoice */}
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                      onClick={() => onOpenCustomerInvoice?.(order.hp)}
                      title="Buka tampilan invoice resmi pelanggan ini"
                    >
                      <Eye size={14} /> Buka
                    </button>

                    {/* Edit Order */}
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                      onClick={() => setEditingOrder(JSON.parse(JSON.stringify(order)))}
                      title="Edit harga, DP, nomor resi, atau kurir"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    {/* Delete Order */}
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 8px', fontSize: '0.74rem', color: 'var(--danger)' }}
                      onClick={() => handleDelete(order)}
                      title="Hapus pesanan ini"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reset Demo Data Button */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.74rem', padding: '6px 12px' }}
          onClick={() => {
            if (confirm('Reset semua data kembali ke contoh bawaan awal? Semua editan akan dihapus.')) {
              resetStoredOrders(businessType)
              refreshOrders()
              onShowToast?.('Data demo berhasil di-reset ke setelan awal.')
            }
          }}
        >
          <RefreshCw size={13} /> Reset Data Demo ke Bawaan
        </button>
      </div>

      {/* MODAL EDIT ORDER */}
      {editingOrder && (
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
          onClick={() => setEditingOrder(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                ✏️ Edit Invoice: {editingOrder.nama}
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                onClick={() => setEditingOrder(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Uang Muka (DP) Rp</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editingOrder.dp || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, dp: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Diskon Promo Rp</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editingOrder.diskon || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, diskon: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              {hasShipping && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Ongkos Kirim Rp</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editingOrder.ongkir || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, ongkir: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Kurir Ekspedisi</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editingOrder.ekspedisi || ''}
                      onChange={(e) => setEditingOrder({ ...editingOrder, ekspedisi: e.target.value })}
                      placeholder="Misal: SiCepat / J&T"
                    />
                  </div>
                </div>
              )}

              {hasShipping && (
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Nomor Resi Pengiriman</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editingOrder.resi || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, resi: e.target.value })}
                    placeholder="Masukkan no resi (misal: 003928174912)"
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Tahapan Pesanan</label>
                <select
                  className="input-field"
                  value={editingOrder.stage || 'received'}
                  onChange={(e) => setEditingOrder({ ...editingOrder, stage: e.target.value })}
                >
                  <option value="received">1. Diterima / Antrean Awal</option>
                  <option value="hunting">2. Cek Stok / Diagnosa / Antrean Dapur</option>
                  <option value="packing">3. Sedang Diproses / Dikemas / Dikerjakan</option>
                  <option value="shipped">4. {hasShipping ? 'Sedang Dikirim Kurir' : 'Selesai / Siap Diambil'}</option>
                </select>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Harga Tiap Barang / Jasa (Rp):</div>
                {editingOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.78rem', alignSelf: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.barang}
                    </div>
                    <input
                      type="number"
                      className="input-field"
                      style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                      value={it.harga || ''}
                      onChange={(e) => {
                        const nextItems = [...editingOrder.items]
                        nextItems[idx].harga = Number(e.target.value || 0)
                        setEditingOrder({ ...editingOrder, items: nextItems })
                      }}
                      placeholder="Harga Rp"
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Perubahan
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditingOrder(null)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BUAT INVOICE MANUAL BARU */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                ➕ Terbitkan Invoice Baru (Manual)
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Nama Pelanggan *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Contoh: Budi Santoso"
                    value={newOrderForm.nama}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, nama: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>No. WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="08123456789"
                    value={newOrderForm.hp}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, hp: e.target.value })}
                  />
                </div>
              </div>

              {/* Items List */}
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Daftar Barang / Jasa:</label>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    onClick={() => setNewOrderForm({
                      ...newOrderForm,
                      items: [...newOrderForm.items, { barang: '', motif: '', ukuran: '', harga: '', catatan: '' }]
                    })}
                  >
                    + Tambah Baris
                  </button>
                </div>

                {newOrderForm.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 30px', gap: '6px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      className="input-field"
                      style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                      placeholder="Nama Barang / Jasa"
                      value={it.barang}
                      onChange={(e) => {
                        const next = [...newOrderForm.items]
                        next[idx].barang = e.target.value
                        setNewOrderForm({ ...newOrderForm, items: next })
                      }}
                    />
                    <input
                      type="number"
                      className="input-field"
                      style={{ fontSize: '0.8rem', padding: '6px 8px' }}
                      placeholder="Harga (Rp)"
                      value={it.harga}
                      onChange={(e) => {
                        const next = [...newOrderForm.items]
                        next[idx].harga = e.target.value
                        setNewOrderForm({ ...newOrderForm, items: next })
                      }}
                    />
                    {newOrderForm.items.length > 1 && (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        onClick={() => {
                          const next = newOrderForm.items.filter((_, i) => i !== idx)
                          setNewOrderForm({ ...newOrderForm, items: next })
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Uang Muka (DP) Rp</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    value={newOrderForm.dp}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, dp: e.target.value })}
                  />
                </div>
                {hasShipping ? (
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Ongkos Kirim Rp</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0"
                      value={newOrderForm.ongkir}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, ongkir: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Diskon Rp</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0"
                      value={newOrderForm.diskon}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, diskon: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {hasShipping && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Kurir</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newOrderForm.ekspedisi}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, ekspedisi: e.target.value })}
                      placeholder="SiCepat / J&T"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>No. Resi (Opsional)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newOrderForm.resi}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, resi: e.target.value })}
                      placeholder="Kosongkan jika belum dikirim"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Terbitkan & Buka Invoice
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GANTI PIN ADMIN */}
      {showPinModal && (
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
          onClick={() => setShowPinModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800 }}>🔑 Ganti PIN Keamanan Admin</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              PIN ini digunakan untuk membuka portal admin di browser toko Anda.
            </p>

            <form onSubmit={handleSavePin} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700 }}>Masukkan PIN Baru (Minimal 4 Angka):</label>
                <input
                  type="password"
                  maxLength={8}
                  className="input-field"
                  placeholder="Misal: 7890"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.2em' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan PIN Baru
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowPinModal(false)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

