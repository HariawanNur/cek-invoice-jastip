import { useState } from 'react'
import { ADMIN_WA, NAMA_USAHA } from './config'
import OrderForm from './OrderForm'
import { CONTOH_NOMOR, MODE_DEMO, findCustomer, normalisasiHp, rupiah } from './data'
import { bagikanPdf } from './pdf'

const waLink = (text, nomor = '') => `https://wa.me/${nomor}?text=${encodeURIComponent(text)}`

function ringkasan(hp, c) {
  const baris = c.items.map((i) => `- ${[i.barang, i.motif].filter(Boolean).join(' ')} (${i.brand}): ${rupiah(i.harga)}`)
  return [
    `Invoice ${NAMA_USAHA}`, `${c.nama} (${hp})`, '', ...baris, '',
    `Subtotal: ${rupiah(c.subtotal)}`, `Fee jastip: ${rupiah(c.fee)}`,
    `Total: ${rupiah(c.total)}`, `Status: ${c.lunas ? 'Lunas' : 'Belum bayar'}`,
  ].join('\n')
}

async function bagikanHalaman() {
  const url = window.location.href
  const text = `Cek invoice ${NAMA_USAHA} kamu di sini (masukkan nomor HP): ${url}`
  if (navigator.share) {
    try { await navigator.share({ title: `Cek invoice ${NAMA_USAHA}`, text, url }); return } catch { /* batal */ }
  }
  window.open(waLink(text), '_blank')
}

async function kirimPdf(hp, c) {
  try {
    await bagikanPdf({ ...c, hp }, rupiah)
  } catch (e) {
    console.error(e)
  }
}

function Invoice({ hp, c }) {
  return (
    <div className="box">
      <div className="inv-head">
        <div><div className="name">{c.nama}</div><div className="ph">{hp}</div></div>
        <span className={'badge ' + (c.lunas ? 'ok' : 'wait')}>{c.pending ? 'Menunggu harga' : c.lunas ? 'Lunas' : 'Belum bayar'}</span>
      </div>
      {c.items.map((i, idx) => (
        <div className="item" key={idx}>
          <div>{[i.barang, i.motif].filter(Boolean).join(', ')}<small>{i.brand}</small></div>
          <div className="amt">{i.harga ? rupiah(i.harga) : 'Menunggu harga'}</div>
        </div>
      ))}
      <div className="sum"><span>Subtotal</span><span className="amt">{rupiah(c.subtotal)}</span></div>
      <div className="sum"><span>Fee jastip</span><span className="amt">{rupiah(c.fee)}</span></div>
      <div className="total"><span>Total</span><span className="amt">{rupiah(c.total)}</span></div>
      <div className="actions">
        <button className="btn2" onClick={() => kirimPdf(hp, c)}>Kirim PDF via WA</button>
        <a className="btn2" href={waLink(ringkasan(hp, c))} target="_blank" rel="noreferrer">Bagikan invoice ke WA</a>
        <a className="btn2" href={waLink(`Halo kak, saya mau tanya invoice ${hp}`, ADMIN_WA)} target="_blank" rel="noreferrer">Tanya admin</a>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('cek')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasil, setHasil] = useState(null)

  async function cek(value = input) {
    const hp = normalisasiHp(value)
    if (!hp) return setHasil({ error: 'Isi nomor HP dulu ya.' })
    setLoading(true)
    try {
      const c = await findCustomer(hp)
      setHasil(c ? { hp, c } : { error: `Nomor ${hp} belum ada di daftar order.`, tanya: true })
    } catch {
      setHasil({ error: 'Gagal mengambil data. Coba lagi sebentar lagi.' })
    }
    setLoading(false)
  }

  return (
    <main>
      <h1>{NAMA_USAHA}</h1>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'order'} className={tab === 'order' ? 'on' : ''} onClick={() => setTab('order')}>Pesan</button>
        <button role="tab" aria-selected={tab === 'cek'} className={tab === 'cek' ? 'on' : ''} onClick={() => setTab('cek')}>Cek invoice</button>
      </div>
      {tab === 'order' ? (
        <OrderForm onSelesai={(hp) => { setInput(hp); setTab('cek'); cek(hp) }} />
      ) : (<>
        <p className="sub">Masukkan nomor HP yang dipakai saat order, invoice langsung muncul.</p>
        <div className="box">
          <label htmlFor="hp">Nomor HP</label>
          <div className="row">
            <input id="hp" type="tel" inputMode="numeric" placeholder="08xxxxxxxxxx" autoComplete="off"
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && cek()} />
            <button className="go" disabled={loading} onClick={() => cek()}>{loading ? 'Mencari...' : 'Cek invoice'}</button>
          </div>
          {MODE_DEMO && (<>
            <p className="hint">Mode demo, coba nomor contoh:</p>
            <div className="chips">
              {CONTOH_NOMOR.map((n) => (<button key={n} className="chip" onClick={() => { setInput(n); cek(n) }}>{n}</button>))}
            </div>
          </>)}
        </div>
        <div id="out" aria-live="polite">
          {hasil?.error && (
            <div className="err">{hasil.error}
              {hasil.tanya && <> <a href={waLink('Halo kak, saya mau cek invoice order saya', ADMIN_WA)} target="_blank" rel="noreferrer">Hubungi admin</a></>}
            </div>
          )}
          {hasil?.c && <Invoice hp={hasil.hp} c={hasil.c} />}
        </div>
      </>)}
      <button className="share" onClick={bagikanHalaman}>Bagikan link halaman ini</button>
    </main>
  )
}
