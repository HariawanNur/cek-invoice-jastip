import { useState } from 'react'
import { normalisasiHp, submitOrder } from './data'

const kosong = () => ({ brand: '', barang: '', motif: '', catatan: '' })

export default function OrderForm({ onSelesai }) {
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [items, setItems] = useState([kosong()])
  const [website, setWebsite] = useState('') // honeypot anti-spam, jangan ditampilkan
  const [state, setState] = useState({ status: 'isi', pesan: '' })

  const ubah = (idx, key, val) => setItems(items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)))

  async function kirim() {
    const nomor = normalisasiHp(hp)
    const valid = items.filter((i) => i.barang.trim())
    if (!nama.trim()) return setState({ status: 'isi', pesan: 'Nama belum diisi.' })
    if (nomor.length < 9) return setState({ status: 'isi', pesan: 'Nomor HP belum benar.' })
    if (!valid.length) return setState({ status: 'isi', pesan: 'Isi minimal satu barang.' })
    setState({ status: 'kirim', pesan: '' })
    try {
      const r = await submitOrder({ nama: nama.trim(), hp: nomor, items: valid, website })
      if (!r.ok) throw new Error()
      setState({ status: 'sukses', pesan: nomor })
    } catch {
      setState({ status: 'isi', pesan: 'Order belum terkirim. Coba lagi sebentar lagi.' })
    }
  }

  if (state.status === 'sukses') {
    return (
      <div className="box">
        <div className="name">Order diterima</div>
        <p className="sub">Admin akan mengisi harga. Setelah itu invoice kamu bisa dicek dengan nomor {state.pesan}.</p>
        <button className="go" onClick={() => onSelesai(state.pesan)}>Cek invoice</button>
      </div>
    )
  }

  return (
    <div className="box">
      <label htmlFor="nama">Nama</label>
      <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" />
      <label htmlFor="hpo" style={{ marginTop: 12 }}>Nomor HP</label>
      <input id="hpo" type="tel" inputMode="numeric" value={hp} onChange={(e) => setHp(e.target.value)} placeholder="08xxxxxxxxxx" />
      <input className="hp-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} />

      {items.map((it, idx) => (
        <div className="orderitem" key={idx}>
          <div className="oi-title">Barang {idx + 1}
            {items.length > 1 && <button className="link" onClick={() => setItems(items.filter((_, i) => i !== idx))}>Hapus</button>}
          </div>
          <input value={it.barang} onChange={(e) => ubah(idx, 'barang', e.target.value)} placeholder="Nama barang (contoh: Celana pendek)" />
          <div className="row2">
            <input value={it.brand} onChange={(e) => ubah(idx, 'brand', e.target.value)} placeholder="Brand" />
            <input value={it.motif} onChange={(e) => ubah(idx, 'motif', e.target.value)} placeholder="Motif" />
            <input value={it.ukuran} onChange={(e) => ubah(idx, 'ukuran', e.target.value)} placeholder="Ukuran" />
          </div>
          <input value={it.catatan} onChange={(e) => ubah(idx, 'catatan', e.target.value)} placeholder="Catatan (opsional)" />
        </div>
      ))}
      <button className="chip" onClick={() => setItems([...items, kosong()])}>+ Tambah barang</button>

      {state.pesan && <div className="err" style={{ marginTop: 12 }}>{state.pesan}</div>}
      <button className="go full" disabled={state.status === 'kirim'} onClick={kirim}>
        {state.status === 'kirim' ? 'Mengirim...' : 'Kirim order'}
      </button>
    </div>
  )
}
