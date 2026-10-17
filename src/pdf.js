import { jsPDF } from 'jspdf'
import { BUSINESS_PRESETS, ADMIN_WA } from './config'

const PALETTE = {
  primary: [79, 70, 229],      // Indigo #4f46e5
  primaryDark: [49, 46, 129],  // Dark Indigo
  textDark: [15, 23, 42],      // Slate 900
  textMuted: [100, 116, 139],  // Slate 500
  border: [226, 232, 240],     // Slate 200
  bgSoft: [248, 250, 252],     // Slate 50
  emerald: [16, 185, 129],     // Green
  amber: [217, 119, 6],        // Amber
  rose: [225, 29, 72]          // Rose
}

export async function bagikanPdf(cust, rupiah, businessType = 'olshop', hasShipping = true) {
  const currentPreset = BUSINESS_PRESETS[businessType] || BUSINESS_PRESETS.olshop
  const storeName = currentPreset.defaultStoreName
  const tagline = currentPreset.tagline

  // A5 format (148 x 210 mm) - Sangat nyaman dan proporsional dibaca di smartphone & cetak thermal
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 10
  const R = W - M
  let y = 0

  // ===== TOP BRAND HEADER =====
  doc.setFillColor(...PALETTE.primary)
  doc.rect(0, 0, W, 26, 'F')

  // Accent Line
  doc.setFillColor(236, 72, 153)
  doc.rect(0, 25.2, W, 0.8, 'F')

  // Header Title
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(storeName, M, 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(224, 231, 255)
  doc.text(tagline.slice(0, 50), M, 16)
  doc.text(`Official WhatsApp: +${ADMIN_WA}  •  Portal Invoice Resmi`, M, 21)

  // Invoice Number & Date (Right Top)
  const invNo = `INV/${new Date().getFullYear()}/${(cust.hp || '0000').slice(-4)}/${Math.floor(1000 + Math.random() * 9000)}`
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('OFFICIAL INVOICE', R, 11, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(224, 231, 255)
  doc.text(invNo, R, 16, { align: 'right' })
  const tgl = cust.orderDate || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(tgl, R, 21, { align: 'right' })

  // ===== CUSTOMER CARD & STATUS BADGE =====
  y = 33
  doc.setFillColor(...PALETTE.bgSoft)
  doc.setDrawColor(...PALETTE.border)
  doc.roundedRect(M, y, R - M, 18, 2, 2, 'FD')

  doc.setTextColor(...PALETTE.textMuted)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('DITAGIHKAN KEPADA:', M + 4, y + 5)

  doc.setTextColor(...PALETTE.textDark)
  doc.setFontSize(10)
  doc.text(String(cust.nama || '-'), M + 4, y + 10.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...PALETTE.textMuted)
  doc.text(`WhatsApp: ${cust.hp || '-'}  •  Layanan: ${currentPreset.name}`, M + 4, y + 15)

  // Status Badge
  const statusLabel = cust.pending ? 'MENUNGGU ESTIMASI' : cust.lunas ? 'LUNAS (PAID)' : cust.dp > 0 ? 'DP TERBAYAR' : 'BELUM BAYAR'
  const badgeColor = cust.lunas ? PALETTE.emerald : cust.pending ? PALETTE.textMuted : cust.dp > 0 ? PALETTE.primary : PALETTE.amber

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  const badgeW = doc.getTextWidth(statusLabel) + 8
  const badgeX = R - 4 - badgeW
  doc.setFillColor(...badgeColor)
  doc.roundedRect(badgeX, y + 4.5, badgeW, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text(statusLabel, badgeX + badgeW / 2, y + 10, { align: 'center' })

  // ===== TABLE ITEMS =====
  y += 24
  const colNo = M + 2
  const colBarang = M + 9
  const colBrand = M + 60
  const colHarga = R - 2

  // Table Header
  doc.setFillColor(...PALETTE.primaryDark)
  doc.rect(M, y, R - M, 7, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('NO', colNo, y + 4.8)
  doc.text('DESKRIPSI PRODUK / LAYANAN', colBarang, y + 4.8)
  doc.text('KATEGORI / DETAIL', colBrand, y + 4.8)
  doc.text('TOTAL HARGA', colHarga, y + 4.8, { align: 'right' })
  y += 7

  // Rows
  cust.items.forEach((item, idx) => {
    const detail = [item.barang, item.motif, item.ukuran].filter(Boolean).join(' - ')
    const lines = doc.splitTextToSize(detail, 46)
    const rowHeight = Math.max(lines.length * 4.2 + 3, 7.5)

    if (y + rowHeight > H - 55) {
      doc.addPage()
      y = 12
    }

    if (idx % 2 === 1) {
      doc.setFillColor(...PALETTE.bgSoft)
      doc.rect(M, y, R - M, rowHeight, 'F')
    }

    doc.setTextColor(...PALETTE.textDark)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.text(String(idx + 1), colNo, y + 4.5)

    doc.text(lines, colBarang, y + 4.5)

    doc.setTextColor(...PALETTE.textMuted)
    doc.setFontSize(7)
    doc.text(String(item.brand || '-').slice(0, 18), colBrand, y + 4.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...PALETTE.textDark)
    const itemTotal = Number(item.harga || 0) + Number(item.jastip || 0)
    const priceText = item.harga ? rupiah(itemTotal) : 'Menunggu'
    doc.text(priceText, colHarga, y + 4.5, { align: 'right' })

    y += rowHeight
    doc.setDrawColor(...PALETTE.border)
    doc.line(M, y, R, y)
  })

  // ===== SUMMARY & REKENING PEMBAYARAN =====
  y += 5
  if (y > H - 55) {
    doc.addPage()
    y = 12
  }

  const startSumY = y

  // Left Box: Rekening Info
  doc.setFillColor(...PALETTE.bgSoft)
  doc.setDrawColor(...PALETTE.border)
  doc.roundedRect(M, startSumY, 60, 36, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...PALETTE.primary)
  doc.text('METODE PEMBAYARAN RESMI', M + 4, startSumY + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...PALETTE.textDark)
  doc.text('• BCA: 8830192831 (AWANG PRATAMA)', M + 4, startSumY + 11)
  doc.text('• Mandiri: 1370019283912 (AWANG PRATAMA)', M + 4, startSumY + 16)
  doc.text('• SeaBank: 9019283741 (AWANG PRATAMA)', M + 4, startSumY + 21)
  doc.text('• QRIS All E-Wallet: Tersedia via WA', M + 4, startSumY + 26)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6)
  doc.setTextColor(...PALETTE.textMuted)
  doc.text('*Konfirmasi transfer via WhatsApp Admin.', M + 4, startSumY + 32)

  // Right Box: Financial Breakdown
  let curY = startSumY + 1
  const sumLabelX = R - 48
  const sumValX = R - 2

  const printRow = (label, val, isBold = false, color = PALETTE.textDark) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...PALETTE.textMuted)
    doc.text(label, sumLabelX, curY)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    doc.text(val, sumValX, curY, { align: 'right' })
    curY += 4.5
  }

  printRow('Subtotal Tagihan', rupiah(cust.subtotal))
  if (cust.fee > 0) printRow(currentPreset.labels.feeLabel, rupiah(cust.fee))
  if (hasShipping && cust.ongkir > 0) printRow('Ongkos Kirim', rupiah(cust.ongkir))
  if (cust.diskon > 0) printRow('Diskon Promo', `-${rupiah(cust.diskon)}`, false, PALETTE.rose)

  // Total Tagihan Line
  curY += 1
  doc.setFillColor(...PALETTE.primary)
  doc.roundedRect(sumLabelX - 2, curY - 3.5, 50, 7.5, 1.5, 1.5, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('TOTAL TAGIHAN', sumLabelX, curY + 1.2)
  doc.text(rupiah(cust.total), sumValX, curY + 1.2, { align: 'right' })

  curY += 8.5
  if (cust.dp > 0) {
    printRow('DP / Uang Muka Masuk', `-${rupiah(cust.dp)}`, false, PALETTE.emerald)
  }

  // Sisa Bayar Tag
  const sisaColor = cust.sisa > 0 ? PALETTE.rose : PALETTE.emerald
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...PALETTE.textDark)
  doc.text('SISA PEMBAYARAN', sumLabelX, curY)
  doc.setTextColor(...sisaColor)
  doc.text(rupiah(cust.sisa), sumValX, curY, { align: 'right' })

  // ===== FOOTER BAR =====
  doc.setDrawColor(...PALETTE.border)
  doc.line(M, H - 12, R, H - 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...PALETTE.textMuted)
  doc.text(`Terima kasih telah mempercayakan transaksi Anda kepada ${storeName}.`, W / 2, H - 7.5, { align: 'center' })
  doc.text('Invoice ini sah dan diterbitkan secara digital oleh sistem otomatis.', W / 2, H - 4.5, { align: 'center' })

  // ===== UNDUH / BAGIKAN FILE =====
  const safeName = (cust.nama || 'Customer').replace(/[^a-zA-Z0-9]/g, '_')
  const fileName = `Invoice_${safeName}_${cust.hp || ''}.pdf`
  const blob = doc.output('blob')
  const file = new File([blob], fileName, { type: 'application/pdf' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Invoice ${storeName} - ${cust.nama}`,
        text: `Halo ${cust.nama}, ini invoice pesanan resmi Anda dari ${storeName}.`
      })
      return
    } catch {
      // jika cancel share, tetap sediakan fallback
    }
  }

  doc.save(fileName)
}