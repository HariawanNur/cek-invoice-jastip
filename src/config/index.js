// =========================================================================
// UNIVERSAL BUSINESS PORTAL CONFIGURATION (MULTI-BISNIS SIAP JUAL)
// Aplikasi ini dapat digunakan untuk SEMUA jenis usaha / UMKM
// =========================================================================

export const API_URL = 'https://script.google.com/macros/s/AKfycbyEFynFwwI9PXjfMQQA_BO6naXMIarJj3h47trw_ypKsbTYAurHhIye0phbVn3QMr0/exec'
export const ADMIN_WA = '6285117158205'
export const NAMA_USAHA = 'Universal Portal'

// Preset Tipe Bisnis Populer di Indonesia
export const BUSINESS_PRESETS = {
  olshop: {
    id: 'olshop',
    name: 'Toko Online & Retail',
    hasShipping: true, // Default: Memerlukan pengiriman kurir ekspedisi
    icon: 'ShoppingBag',
    defaultStoreName: 'Lumina Daily Wear',
    tagline: 'Pakaian & Fashion Trendy Kekinian Original',
    badge: 'Official Store ✨',
    announcement: '🔥 Promo Gajian: Diskon Up To 30% + Free Ongkir se-Jabodetabek!',
    infoPill: '📦 Pengiriman Setiap Hari Jam 16:00 WIB',
    labels: {
      searchTitle: 'Lacak Pesanan & Resi Pengiriman',
      searchSubtitle: 'Masukkan nomor WhatsApp saat Anda checkout pesanan',
      orderTab: 'Pesan Produk',
      orderTitle: 'Form Pemesanan Produk Retail',
      orderSubtitle: 'Pilih produk, varian warna/ukuran, dan jumlah yang ingin dibeli',
      itemTitle: 'Produk',
      itemColName: 'Nama Produk / Baju',
      itemColBrand: 'Kategori / Brand',
      itemColVariant: 'Warna / Motif',
      itemColSize: 'Ukuran (S/M/L/XL)',
      feeLabel: 'Biaya Packaging / Handling',
      calcTab: 'Simulasi Belanja',
      calcTitle: 'Simulasi Belanja & Estimasi Total Bayar',
      stagesWithShipping: [
        { key: 'received', label: 'Pesanan Masuk' },
        { key: 'hunting', label: 'Verifikasi Bayar' },
        { key: 'packing', label: 'Sedang Dikemas' },
        { key: 'shipped', label: 'Dalam Pengiriman' },
        { key: 'completed', label: 'Paket Diterima' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'Pesanan Masuk' },
        { key: 'hunting', label: 'Verifikasi Bayar' },
        { key: 'packing', label: 'Disiapkan Toko' },
        { key: 'shipped', label: 'Siap Diambil di Toko' },
        { key: 'completed', label: 'Pesanan Selesai' }
      ]
    },
    trustPoints: [
      { title: 'Garansi 100% Produk Asli', desc: 'Jaminan uang kembali jika barang cacat atau tidak sesuai' },
      { title: 'Pengiriman Cepat', desc: 'Resi ekspedisi langsung diupdate otomatis di portal ini' },
      { title: 'Bisa Tukar Ukuran', desc: 'Layanan retur ukuran dalam 3 hari setelah barang tiba' },
      { title: 'Packing Rapi & Aman', desc: 'Setiap paket dilapisi polymailer tebal & bubble wrap' }
    ],
    faqs: [
      { q: 'Kapan pesanan saya dikirim?', a: 'Pesanan yang telah diverifikasi sebelum jam 15.00 WIB dikirim pada hari yang sama. Resi otomatis dapat dicek di portal ini.' },
      { q: 'Bagaimana cara melacak nomor resi?', a: 'Masukkan nomor WhatsApp Anda di tab Cek Pesanan. Nomor resi kurir SiCepat/J&T/JNE akan langsung muncul beserta link pelacakannya.' },
      { q: 'Bagaimana cara konfirmasi pembayaran?', a: 'Transfer ke rekening BCA/Mandiri atau QRIS toko, lalu klik tombol "Konfirmasi Pembayaran via WA" dan lampirkan bukti transfer.' }
    ]
  },

  servis: {
    id: 'servis',
    name: 'Servis HP & Laptop',
    hasShipping: false, // Default: Non-pengiriman (Ambil sendiri di workshop)
    icon: 'Wrench',
    defaultStoreName: 'iFixit Gadget & Laptop Care',
    tagline: 'Spesialis Servis iPhone, Android & Laptop Bergaransi',
    badge: 'Teknisi Tersertifikasi 🔧',
    announcement: '⚡ Free Pengecekan & Diagnosa Kerusakan Awal di Workshop Kami!',
    infoPill: '⏱️ Jam Buka Workshop: 10:00 - 21:00 WIB',
    labels: {
      searchTitle: 'Cek Status Servis & Estimasi Biaya',
      searchSubtitle: 'Masukkan nomor WhatsApp yang terdaftar di nota tanda terima servis',
      orderTab: 'Booking Servis',
      orderTitle: 'Form Booking Servis / Drop Unit',
      orderSubtitle: 'Isi tipe perangkat, keluhan kerusakan, dan sparepart yang dibutuhkan',
      itemTitle: 'Perangkat',
      itemColName: 'Tipe Perangkat (iPhone 13 / Asus ROG)',
      itemColBrand: 'Merk / Seri',
      itemColVariant: 'Keluhan / Kerusakan Utama',
      itemColSize: 'Kelengkapan (Unit/Cas/Dus)',
      feeLabel: 'Biaya Jasa Servis',
      calcTab: 'Kalkulator Servis',
      calcTitle: 'Estimasi Biaya Servis & Sparepart',
      stagesWithShipping: [
        { key: 'received', label: 'Unit Diterima' },
        { key: 'hunting', label: 'Diagnosa Kerusakan' },
        { key: 'packing', label: 'Pengerjaan Servis' },
        { key: 'shipped', label: 'Dikirim Balik Kurir' },
        { key: 'completed', label: 'Unit Diterima' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'Unit Diterima' },
        { key: 'hunting', label: 'Diagnosa Kerusakan' },
        { key: 'packing', label: 'Pengerjaan Servis' },
        { key: 'shipped', label: 'Quality Check (QC)' },
        { key: 'completed', label: 'Siap Diambil di Workshop' }
      ]
    },
    trustPoints: [
      { title: 'Garansi Servis Hingga 90 Hari', desc: 'Jaminan ganti baru jika sparepart yang diganti mengalami kendala' },
      { title: 'Sparepart Original & Berkualitas', desc: 'Kami hanya menggunakan sparepart original atau grade premium terbaik' },
      { title: 'Bisa Ditunggu (Fast Repair)', desc: 'Servis ringan seperti ganti baterai & LCD selesai dalam 30-60 menit' },
      { title: 'Data Pribadi 100% Aman', desc: 'Privasi data di dalam perangkat dijamin tidak disentuh teknisi' }
    ],
    faqs: [
      { q: 'Berapa lama proses pengerjaan servis?', a: 'Ganti baterai & LCD umumnya 30-60 menit. Kerusakan mesin/motherboard membutuhkan 1-3 hari kerja untuk pengujian menyeluruh.' },
      { q: 'Apakah ada garansinya?', a: 'Ya, semua penggantian sparepart bergaransi resmi toko mulai dari 30 hingga 90 hari.' },
      { q: 'Bagaimana cara mengetahui unit saya sudah selesai?', a: 'Cek status nomor WhatsApp Anda di portal ini. Jika status sudah "Siap Diambil", Anda bisa langsung ke workshop.' }
    ]
  },

  kuliner: {
    id: 'kuliner',
    name: 'Kuliner & Katering',
    hasShipping: false, // Default: Non-ekspedisi (Dine-in / Takeaway / Diambil langsung)
    icon: 'Utensils',
    defaultStoreName: 'Dapur Rasa Catering & Cake',
    tagline: 'Nasi Box, Tumpeng Mini, Snack Box & Kue Basah Enak & Halal',
    badge: '100% Halal & Higienis 🍲',
    announcement: '📢 Buka Pemesanan Nasi Box & Tumpeng untuk Acara Kantor / Syukuran!',
    infoPill: '👨‍🍳 Freshly Made - Dibuat di Hari Pemesanan',
    labels: {
      searchTitle: 'Lacak Pesanan Katering & Invoice',
      searchSubtitle: 'Masukkan nomor WhatsApp pemesan katering / kue',
      orderTab: 'Pesan Menu',
      orderTitle: 'Form Pemesanan Makanan / Katering',
      orderSubtitle: 'Pilih menu makanan, porsi, tanggal pengambilan, dan catatan kemasan',
      itemTitle: 'Menu',
      itemColName: 'Nama Menu / Paket Makanan',
      itemColBrand: 'Kategori Menu',
      itemColVariant: 'Varian / Level Pedas / Lauk',
      itemColSize: 'Porsi (Box / Pax)',
      feeLabel: 'Biaya Kemasan Khusus',
      calcTab: 'Kalkulator Porsi',
      calcTitle: 'Kalkulator Estimasi Porsi & Budget Katering',
      stagesWithShipping: [
        { key: 'received', label: 'Order Diterima' },
        { key: 'hunting', label: 'Bahan Disiapkan' },
        { key: 'packing', label: 'Sedang Dimasak' },
        { key: 'shipped', label: 'Kurir Pengantaran' },
        { key: 'completed', label: 'Pesanan Tiba' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'Order Diterima' },
        { key: 'hunting', label: 'Bahan Disiapkan' },
        { key: 'packing', label: 'Sedang Dimasak' },
        { key: 'shipped', label: 'Selesai Dikemas' },
        { key: 'completed', label: 'Siap Diambil / Disajikan' }
      ]
    },
    trustPoints: [
      { title: '100% Bahan Segar & Halal', desc: 'Diolah higienis dengan bahan baku pilihan berkualitas setiap hari' },
      { title: 'Kemasan Cantik & Rapi', desc: 'Box food grade tebal lengkap dengan sendok, tisu, dan tusuk gigi' },
      { title: 'Rasa Autentik & Higienis', desc: 'Resep bumbu turun temurun tanpa bahan pengawet berbahaya' },
      { title: 'Bisa Request Menu Khusus', desc: 'Melayani menu vegetarian, diet rendah garam, atau request lauk khusus' }
    ],
    faqs: [
      { q: 'Kapan batas minimal order katering?', a: 'Untuk pesanan 10-50 box minimal H-1. Untuk pesanan di atas 50 box atau tumpeng disarankan H-2 atau H-3.' },
      { q: 'Apakah ada minimal order?', a: 'Minimal order nasi box adalah 10 box. Di bawah itu dapat menghubungi admin untuk ketersediaan menu harian.' },
      { q: 'Bagaimana sistem pembayarannya?', a: 'DP minimal 50% saat order dikonfirmasi, dan pelunasan saat pesanan siap diambil.' }
    ]
  },

  percetakan: {
    id: 'percetakan',
    name: 'Percetakan & Sablon',
    hasShipping: true, // Default: Memerlukan kargo / ekspedisi
    icon: 'Printer',
    defaultStoreName: 'Creative Print & Sablon Studio',
    tagline: 'Cetak Kaos Komunitas, Banner, Undangan & Souvenir Custom',
    badge: 'Hasil Cetak Presisi & Cepat 🖨️',
    announcement: '🚀 Promo Cetak Kaos Komunitas Minimal 24 Pcs Free Jasa Desain!',
    infoPill: '🏢 Workshop Cetak & Pengiriman ke Seluruh Indonesia',
    labels: {
      searchTitle: 'Lacak Progres Cetak & Status Pesanan',
      searchSubtitle: 'Masukkan nomor WhatsApp saat Anda mengirimkan file desain',
      orderTab: 'Order Cetak',
      orderTitle: 'Form Pemesanan Cetak & Sablon Custom',
      orderSubtitle: 'Isi spesifikasi bahan, ukuran cetak, jumlah pcs, dan link desain',
      itemTitle: 'Pesanan Cetak',
      itemColName: 'Jenis Produk (Kaos / Banner / Brosur)',
      itemColBrand: 'Bahan / Gramasi (Combed 30s / Flexi)',
      itemColVariant: 'Warna Bahan / Jenis Sablon (DTF/Plastisol)',
      itemColSize: 'Ukuran (A3 / 2x1m / M-XL)',
      feeLabel: 'Biaya Setting / Desain Custom',
      calcTab: 'Kalkulator Cetak',
      calcTitle: 'Kalkulator Estimasi Biaya Sablon & Cetak',
      stagesWithShipping: [
        { key: 'received', label: 'File Diterima' },
        { key: 'hunting', label: 'ACC Desain' },
        { key: 'packing', label: 'Proses Produksi' },
        { key: 'shipped', label: 'Finishing & Kirim' },
        { key: 'completed', label: 'Pesanan Selesai' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'File Diterima' },
        { key: 'hunting', label: 'ACC Desain' },
        { key: 'packing', label: 'Proses Produksi' },
        { key: 'shipped', label: 'Finishing & QC' },
        { key: 'completed', label: 'Siap Diambil di Workshop' }
      ]
    },
    trustPoints: [
      { title: 'Tinta & Sablon Kualitas Tinggi', desc: 'Warna tajam, awet dicuci berkali-kali, tidak mudah pecah atau luntur' },
      { title: 'Quality Control Ketat', desc: 'Pemeriksaan jahitan, warna, dan jumlah sebelum diserahkan ke customer' },
      { title: 'Bantu Setting File Gratis', desc: 'Tim desain siap membantu cek resolusi file sebelum naik mesin cetak' },
      { title: 'Kapasitas Produksi Besar', desc: 'Mesin digital print & sablon modern berkapasitas ribuan pcs per hari' }
    ],
    faqs: [
      { q: 'Format file apa yang didukung untuk cetak?', a: 'Kami merekomendasikan format PDF, AI, PSD, CDR, atau PNG resolusi tinggi (minimal 300 DPI) dengan mode warna CMYK.' },
      { q: 'Berapa lama waktu pengerjaan sablon kaos?', a: 'Untuk kuantitas 12-50 pcs estimasi 3-5 hari kerja setelah preview desain disetujui (ACC).' }
    ]
  },

  jasa: {
    id: 'jasa',
    name: 'Jasa & Digital Agency',
    hasShipping: false, // Default: Non-pengiriman (100% Serah Terima Digital)
    icon: 'Briefcase',
    defaultStoreName: 'PixelCraft Digital Studio',
    tagline: 'Jasa Pembuatan Website, Desain Grafis & Kelola Sosmed',
    badge: 'Professional Agency 💼',
    announcement: '💡 Konsultasi Kebutuhan Website & Branding Usaha Anda Gratis!',
    infoPill: '💻 Layanan Online untuk Klien se-Indonesia & Global',
    labels: {
      searchTitle: 'Cek Status Tagihan & Progres Proyek',
      searchSubtitle: 'Masukkan nomor WhatsApp PIC atau nomor kontak klien',
      orderTab: 'Mulai Proyek',
      orderTitle: 'Form Pengajuan Brief & Kebutuhan Layanan',
      orderSubtitle: 'Pilih paket layanan, target deadline, dan rincian kebutuhan Anda',
      itemTitle: 'Layanan',
      itemColName: 'Nama Layanan / Proyek',
      itemColBrand: 'Kategori Jasa (Web/Desain/Sosmed)',
      itemColVariant: 'Paket (Basic / Pro / Custom)',
      itemColSize: 'Durasi / Estimasi Hari Pengerjaan',
      feeLabel: 'Biaya Add-on / Fitur Tambahan',
      calcTab: 'Kalkulator Proyek',
      calcTitle: 'Kalkulator Estimasi Biaya Jasa & Fitur',
      stagesWithShipping: [
        { key: 'received', label: 'Brief Masuk' },
        { key: 'hunting', label: 'Pengerjaan Proyek' },
        { key: 'packing', label: 'Review & Revisi' },
        { key: 'shipped', label: 'Pengiriman CD/File Fisik' },
        { key: 'completed', label: 'Proyek Selesai' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'Brief Masuk' },
        { key: 'hunting', label: 'Pengerjaan Proyek' },
        { key: 'packing', label: 'Review & Revisi' },
        { key: 'shipped', label: 'Serah Terima File Cloud' },
        { key: 'completed', label: 'Proyek Selesai' }
      ]
    },
    trustPoints: [
      { title: 'Berpengalaman & Portofolio Nyata', desc: 'Ratusan proyek website dan branding sukses kami kerjakan dengan rating 5.0' },
      { title: 'Revisi Terjamin', desc: 'Free garansi revisi minor hingga hasil akhir sesuai kesepakatan brief awal' },
      { title: 'File Master Lengkap', desc: 'Semua aset desain, source code, dan akses diserahkan 100% kepada klien' },
      { title: 'Support & Konsultasi Responsif', desc: 'Tim kami siap berdiskusi cepat via WhatsApp atau Google Meet' }
    ],
    faqs: [
      { q: 'Bagaimana alur pengerjaan proyek?', a: '1. Pengisian brief kebutuhan\n2. Diskusi estimasi & kesepakatan biaya\n3. Pembayaran DP 50%\n4. Pengerjaan & sesi review/revisi\n5. Pelunasan & serah terima file final.' },
      { q: 'Berapa lama pembuatan website landing page?', a: 'Umumnya selesai dalam 3-7 hari kerja tergantung kelengkapan materi teks dan foto produk dari klien.' }
    ]
  },

  jastip: {
    id: 'jastip',
    name: 'Jasa Titip (Jastip)',
    hasShipping: true, // Default: Memerlukan pengiriman ekspedisi
    icon: 'Plane',
    defaultStoreName: 'JastipAvenue Studio',
    tagline: 'Authentic Personal Shopper & Fast Pre-Order Handcarry',
    badge: 'Verified Jastiper ✈️',
    announcement: '🔥 Free Ongkir Ekspedisi se-Jabodetabek s/d 25 Oktober! Pembayaran via QRIS & Transfer Bank Otomatis.',
    infoPill: '🇹🇭 🇯🇵 Open Trip Bangkok & Japan Handcarry Original',
    labels: {
      searchTitle: 'Lacak Invoice & Resi Titipan',
      searchSubtitle: 'Masukkan nomor WhatsApp yang Anda gunakan saat memesan',
      orderTab: 'Form Titip',
      orderTitle: 'Form Titip Belanja (Pre-Order)',
      orderSubtitle: 'Isi detail barang yang ingin Anda titip belanja saat trip berlangsung',
      itemTitle: 'Barang Titipan',
      itemColName: 'Nama Barang Titipan',
      itemColBrand: 'Brand / Toko Asal',
      itemColVariant: 'Warna / Motif',
      itemColSize: 'Ukuran / Size',
      feeLabel: 'Fee Jasa Titip',
      calcTab: 'Kalkulator Kurs',
      calcTitle: 'Kalkulator Kurs & Estimasi Jastip Luar Negeri',
      stagesWithShipping: [
        { key: 'received', label: 'Order Masuk' },
        { key: 'hunting', label: 'Hunting Store' },
        { key: 'packing', label: 'Packing Gudang' },
        { key: 'shipped', label: 'Pengiriman Ekspedisi' },
        { key: 'completed', label: 'Selesai Diterima' }
      ],
      stagesNoShipping: [
        { key: 'received', label: 'Order Masuk' },
        { key: 'hunting', label: 'Hunting Store' },
        { key: 'packing', label: 'Sortir Belanjaan' },
        { key: 'shipped', label: 'Siap Diambil di Lokasi' },
        { key: 'completed', label: 'Pesanan Selesai' }
      ]
    },
    trustPoints: [
      { title: '100% Produk Asli Official Store', desc: 'Dibeli langsung dari outlet mall resmi dengan struk toko asli' },
      { title: 'Packing Tebal & Aman', desc: 'Free double bubble wrap dan kardus tebal untuk barang fragile' },
      { title: 'Garansi Refund 100%', desc: 'Uang kembali utuh tanpa potongan jika barang titipan out of stock' }
    ],
    faqs: [
      { q: 'Bagaimana cara titip barang?', a: 'Isi form di tab Form Titip, masukkan nama barang dan link foto. Tim kami akan mengonfirmasi ketersediaan stok di store.' },
      { q: 'Bagaimana jika barang yang dititip habis?', a: 'Dana DP Anda akan direfund 100% tanpa potongan apa pun maksimal dalam 1x24 jam.' }
    ]
  }
}

// Rekening Pembayaran Resmi Toko
export const DEFAULT_BANKS = [
  {
    id: 'bca',
    name: 'Bank BCA',
    number: '8830192831',
    holder: 'AWANG PRATAMA',
    type: 'Bank Transfer'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    number: '1370019283912',
    holder: 'AWANG PRATAMA',
    type: 'Bank Transfer'
  },
  {
    id: 'seabank',
    name: 'SeaBank',
    number: '9019283741',
    holder: 'AWANG PRATAMA',
    type: 'Bebas Biaya Admin'
  },
  {
    id: 'qris',
    name: 'QRIS All Payment',
    number: 'Scan QRIS Tersedia via WA',
    holder: 'Merchant ID Resmi',
    type: 'GoPay / OVO / Dana / ShopeePay / Mobile Banking',
    isQris: true
  }
]

// Mata Uang Kalkulator Kurs (Jastip)
export const EXCHANGE_RATES = [
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 465, minFee: 25000, feePercent: 8, example: '1.200 ฿ (Celana Gentle Woman)' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 108, minFee: 30000, feePercent: 8, example: '3.500 ¥ (Skincare Shiseido / Uniqlo)' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 12200, minFee: 40000, feePercent: 7, example: '45 S$ (Charles & Keith Bag)' },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 16150, minFee: 50000, feePercent: 10, example: '50 $ (Sephora Beauty)' },
  { code: 'MYR', name: 'Ringgit Malaysia', symbol: 'RM', rate: 3650, minFee: 25000, feePercent: 8, example: '80 RM (Vincci Shoes)' }
]
