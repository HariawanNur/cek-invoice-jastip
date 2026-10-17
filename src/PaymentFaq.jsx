import { useState } from 'react'
import { BUSINESS_PRESETS, DEFAULT_BANKS, ADMIN_WA } from './config'
import {
  CreditCard,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  QrCode,
  MessageCircle,
  HelpCircle
} from 'lucide-react'

export default function PaymentFaq({ businessType = 'olshop', onShowToast }) {
  const [copiedId, setCopiedId] = useState(null)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [showQrisModal, setShowQrisModal] = useState(false)

  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop

  const copyNumber = (bank) => {
    navigator.clipboard.writeText(bank.number)
    setCopiedId(bank.id)
    onShowToast?.(`Nomor rekening ${bank.name} berhasil disalin!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const waKonfirmasiLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
    `Halo admin ${currentPreset.defaultStoreName}, saya mau konfirmasi bukti transfer pembayaran pesanan.`
  )}`

  return (
    <div>
      {/* Rekening Pembayaran Card */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div>
            <h2 className="card-title">
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              Rekening Resmi Pembayaran
            </h2>
            <p className="card-subtitle">
              Pastikan transfer HANYA ke rekening resmi terdaftar di bawah ini
            </p>
          </div>
        </div>

        <div className="bank-cards-grid">
          {DEFAULT_BANKS.map((bank) => (
            <div key={bank.id} className="bank-item-card">
              <div>
                <div className="bank-name-badge">{bank.name}</div>
                <div className="bank-acc-no">{bank.number}</div>
                <div className="bank-acc-holder">a.n {bank.holder}</div>
              </div>

              {bank.isQris ? (
                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                  onClick={() => setShowQrisModal(true)}
                >
                  <QrCode size={16} />
                  Lihat QRIS
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                  onClick={() => copyNumber(bank)}
                >
                  {copiedId === bank.id ? (
                    <>
                      <Check size={16} color="var(--success)" />
                      Disalin
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Salin
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '14px' }}>
          <a
            className="btn-primary btn-wa"
            href={waKonfirmasiLink}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Konfirmasi Transfer via WhatsApp
          </a>
        </div>
      </div>

      {/* Trust Points / Jaminan Pelayanan */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div>
            <h2 className="card-title">
              <ShieldCheck size={20} color="var(--success)" />
              Jaminan Pelayanan {currentPreset.defaultStoreName}
            </h2>
            <p className="card-subtitle">Komitmen kami untuk kepuasan dan kepercayaan pelanggan</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {currentPreset.trustPoints.map((tp, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                ✓ {tp.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                {tp.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Tanya Jawab */}
      <div className="pro-card">
        <div className="pro-card-header">
          <div>
            <h2 className="card-title">
              <HelpCircle size={20} color="var(--primary)" />
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="card-subtitle">Pertanyaan yang sering ditanyakan seputar pemesanan & layanan</p>
          </div>
        </div>

        <div className="faq-list">
          {currentPreset.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div key={idx} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* QRIS Modal Simple View */}
      {showQrisModal && (
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
          onClick={() => setShowQrisModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <QrCode size={48} style={{ color: 'var(--primary)', margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800 }}>
              QRIS Universal Payment
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Dapat discan dari BCA Mobile, Livin Mandiri, BRImo, GoPay, OVO, Dana, ShopeePay.
            </p>

            <div
              style={{
                background: '#fff',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-block',
                border: '2px solid var(--border-color)',
                marginBottom: '16px'
              }}
            >
              <div style={{ width: '180px', height: '180px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                <QrCode size={96} color="#0f172a" />
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px', fontWeight: 700 }}>
                  MERCHANT QRIS RESMI
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Atau hubungi admin untuk barcode QRIS resolusi tinggi.
            </p>

            <button className="btn-primary" onClick={() => setShowQrisModal(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
