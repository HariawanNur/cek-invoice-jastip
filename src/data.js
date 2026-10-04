import { API_URL } from './config'

// Mode demo (dipakai kalau API_URL kosong). Bentuk datanya sama dengan balasan Apps Script.
const DEMO = {
  '081200000001': { nama: 'Bunda Sari', items: [
    { brand: 'Cuit', barang: 'Celpan', motif: 'Biru 3-4y', harga: 35000, jastip: 3000, status: 'Belum' },
    { brand: 'LPH', barang: 'Baju pan pan', motif: 'wolf', harga: 40000, jastip: 3000, status: 'Belum' },
  ] },
  '081200000002': { nama: 'Bunda Dewi', items: [
    { brand: 'Ambuka', barang: 'Minyak telon', motif: '', harga: 69000, jastip: 5000, status: 'Lunas' },
    { brand: 'Cuit', barang: 'Legging', motif: 'Ungu', harga: 27000, jastip: 3000, status: 'Lunas' },
  ] },
}
export const CONTOH_NOMOR = Object.keys(DEMO)
export const MODE_DEMO = !API_URL

// 0812..., +62812..., 62812..., 812... -> 0812...
export function normalisasiHp(input) {
  let d = String(input).replace(/\D/g, '')
  if (d.startsWith('62')) d = '0' + d.slice(2)
  else if (d && !d.startsWith('0')) d = '0' + d
  return d
}

export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

// Ambil invoice satu customer berdasarkan nomor HP. Return null kalau tidak ada.
export async function findCustomer(hp) {
  let data
  if (MODE_DEMO) {
    data = DEMO[hp]
  } else {
    const res = await fetch(`${API_URL}?hp=${encodeURIComponent(hp)}`)
    const json = await res.json()
    data = json.ok ? json : null
  }
  if (!data || !data.items?.length) return null
  const subtotal = data.items.reduce((s, i) => s + Number(i.harga || 0), 0)
  const fee = data.items.reduce((s, i) => s + Number(i.jastip || 0), 0)
  const pending = data.items.some((i) => !Number(i.harga))
  const lunas = !pending && data.items.every((i) => String(i.status).trim().toLowerCase() === 'lunas')
  return { nama: data.nama, items: data.items, subtotal, fee, total: subtotal + fee, lunas, pending }
}

// Kirim order dari customer. Di mode demo tidak menyimpan apa-apa.
export async function submitOrder(order) {
  if (MODE_DEMO) return { ok: true, demo: true }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // text/plain supaya tidak kena preflight CORS
    body: JSON.stringify(order),
  })
  return res.json()
}
