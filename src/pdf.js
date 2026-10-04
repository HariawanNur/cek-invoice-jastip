import { jsPDF } from 'jspdf'
import { NAMA_USAHA } from './config'

const WARNA = { utama: [79, 107, 246], teks: [26, 32, 51], abu: [110, 120, 140], garis: [225, 229, 238], bg: [244, 246, 251] }

export async function bagikanPdf(cust, rupiah) {
    const doc = new jsPDF({ unit: 'mm', format: 'a5' }) // A5 lebih pas dibaca di HP
    const W = doc.internal.pageSize.getWidth()
    const M = 12
    const R = W - M
    let y = 0

    // ===== Header =====
    doc.setFillColor(...WARNA.utama)
    doc.rect(0, 0, W, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18)
    doc.text(NAMA_USAHA, M, 13)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
    doc.text('INVOICE', M, 21)
    const tgl = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    doc.text(tgl, R, 21, { align: 'right' })

    // ===== Info customer =====
    y = 38
    doc.setTextColor(...WARNA.abu); doc.setFontSize(8)
    doc.text('DITAGIHKAN KEPADA', M, y)
    doc.setTextColor(...WARNA.teks); doc.setFont('helvetica', 'bold'); doc.setFontSize(12)
    doc.text(String(cust.nama || '-'), M, y + 6)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...WARNA.abu)
    if (cust.hp) doc.text(String(cust.hp), M, y + 12)

    // Badge status
    const status = cust.pending ? 'MENUNGGU HARGA' : cust.lunas ? 'LUNAS' : 'BELUM BAYAR'
    const warnaBadge = cust.lunas ? [34, 150, 90] : cust.pending ? [120, 130, 150] : [214, 130, 20]
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
    const bw = doc.getTextWidth(status) + 8
    doc.setFillColor(...warnaBadge)
    doc.roundedRect(R - bw, y - 3, bw, 7, 3.5, 3.5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(status, R - bw / 2, y + 1.8, { align: 'center' })

    // ===== Tabel barang =====
    y += 22
    const xNo = M + 2, xBarang = M + 10, xHarga = R - 2
    doc.setFillColor(...WARNA.bg)
    doc.rect(M, y, R - M, 8, 'F')
    doc.setTextColor(...WARNA.abu); doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
    doc.text('NO', xNo, y + 5.4)
    doc.text('BARANG', xBarang, y + 5.4)
    doc.text('HARGA', xHarga, y + 5.4, { align: 'right' })
    y += 8

    const lebarBarang = xHarga - xBarang - 32
    cust.items.forEach((i, n) => {
        const nama = [i.barang, i.motif, i.ukuran].filter(Boolean).join(', ')
        const baris = doc.splitTextToSize(nama, lebarBarang)
        const tinggi = baris.length * 5 + (i.brand ? 5 : 0) + 4

        if (y + tinggi > doc.internal.pageSize.getHeight() - 50) { doc.addPage(); y = 15 }

        doc.setTextColor(...WARNA.teks); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
        doc.text(String(n + 1), xNo, y + 6)
        doc.text(baris, xBarang, y + 6)
        if (i.brand) {
            doc.setFontSize(8); doc.setTextColor(...WARNA.abu)
            doc.text(String(i.brand), xBarang, y + 6 + baris.length * 5)
        }
        doc.setFontSize(10); doc.setTextColor(...WARNA.teks)
        doc.text(i.harga ? rupiah(i.harga) : 'Menunggu', xHarga, y + 6, { align: 'right' })

        y += tinggi
        doc.setDrawColor(...WARNA.garis); doc.line(M, y, R, y)
    })

    // ===== Ringkasan =====
    y += 8
    const baris = (label, nilai) => {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...WARNA.abu)
        doc.text(label, R - 60, y)
        doc.setTextColor(...WARNA.teks)
        doc.text(nilai, xHarga, y, { align: 'right' })
        y += 6
    }
    baris('Subtotal', rupiah(cust.subtotal))
    baris('Fee jastip', rupiah(cust.fee))

    y += 1
    doc.setFillColor(...WARNA.utama)
    doc.roundedRect(R - 70, y - 5, 70, 11, 2, 2, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
    doc.text('TOTAL', R - 66, y + 2)
    doc.text(rupiah(cust.total), xHarga, y + 2, { align: 'right' })

    // ===== Footer =====
    const H = doc.internal.pageSize.getHeight()
    doc.setDrawColor(...WARNA.garis); doc.line(M, H - 16, R, H - 16)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...WARNA.abu)
    doc.text(`Terima kasih sudah order di ${NAMA_USAHA}`, W / 2, H - 10, { align: 'center' })

    // ===== Bagikan / unduh =====
    const file = new File([doc.output('blob')], `invoice-${cust.nama}.pdf`, { type: 'application/pdf' })
    if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Invoice ${NAMA_USAHA}` })
    } else {
        doc.save(file.name)
    }
}