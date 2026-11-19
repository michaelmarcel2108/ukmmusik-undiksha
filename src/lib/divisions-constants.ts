// Garis Besar Program Kerja (GBPK) & Susunan Kepengurusan UKM Musik Undiksha Masa Bakti 2026/2027
// Ketetapan Sidang Rapat Kerja: Nomor 03/TAP/SIDANG RAKER/07/VII/2026 & 07/TAP/SIDANG RAKER/07/VII/2026

export interface DivisionMember {
  name: string;
  role: string;
  divisionGroup?: string; // e.g. "Pimpinan Bidang", "Divisi Eksplorasi Musik", dll.
  photo_url?: string;
}

export interface DivisionItem {
  code: string;
  name: string;
  slug: string;
  description: string;
  programs: string[];
  members: DivisionMember[];
  cover_image_url?: string;
  group_image_url?: string;
}

export const GBPK_DIVISIONS: DivisionItem[] = [
  {
    code: "Bidang I",
    name: "Pelatihan dan Pengembangan",
    slug: "pelatihan-dan-pengembangan",
    description: `Bidang I (Pelatihan dan Pengembangan) berfokus pada pembinaan, pendataan minat dan bakat musisi, pendelegasian lomba, serta peningkatan mutu kemahasiswaan dan penyelenggaraan acara musik besar UKM Musik Undiksha.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Melaksanakan dan menghadiri kegiatan-kegiatan akademik yang bersifat ke dalam dan ke luar Universitas Pendidikan Ganesha.
• Mengurus dan mendata seluruh minat dan bakat anggota kepengurusan UKM Musik.
• Mendampingi anggota UKM Musik yang membawa nama organisasi dan lembaga dalam lomba.
• Mengurus mengenai Informasi Kreativitas Mahasiswa.
• Bertanggung jawab terhadap Pendelegasian Lomba, seminar, pelatihan di dalam maupun di luar lingkungan Undiksha.
• Melaksanakan Ganesha Rock Festival demi meningkatkan eksistensi organisasi dan lembaga.
• Melaksanakan pekan Suksesi sebagai bentuk demokrasi dan kaderisasi pemimpin.
• Menyiapkan dan melaksanakan Rapat Kerja Kepengurusan sebagai langkah awal berorganisasi.`,
    programs: [
      "Melaksanakan dan menghadiri kegiatan-kegiatan akademik yang bersifat ke dalam dan ke luar Universitas Pendidikan Ganesha.",
      "Mengurus dan mendata seluruh minat dan bakat anggota kepengurusan UKM Musik.",
      "Mendampingi anggota UKM Musik yang membawa nama organisasi dan lembaga dalam lomba.",
      "Mengurus mengenai Informasi Kreativitas Mahasiswa.",
      "Bertanggung jawab terhadap Pendelegasian Lomba, seminar, pelatihan di dalam maupun di luar lingkungan Undiksha.",
      "Melaksanakan Ganesha Rock Festival demi meningkatkan eksistensi organisasi dan lembaga.",
      "Melaksanakan pekan Suksesi sebagai bentuk demokrasi dan kaderisasi pemimpin.",
      "Menyiapkan dan melaksanakan Rapat Kerja Kepengurusan sebagai langkah awal berorganisasi.",
    ],
    members: [
      { name: "Kadek Christian Paramartha Dwipayana", role: "Koordinator Bidang", divisionGroup: "Pimpinan Bidang" },
      { name: "Mutiara Gayatri", role: "Sekretaris Bidang", divisionGroup: "Pimpinan Bidang" },

      // DIVISI I (Eksplorasi Musik)
      { name: "Reva Yenni R. Ginting", role: "Koordinator Divisi", divisionGroup: "Divisi I (Eksplorasi Musik)" },
      { name: "Kadek Krisna Dipayana", role: "Anggota Divisi", divisionGroup: "Divisi I (Eksplorasi Musik)" },
      { name: "Made Dedy Yudika Pranata", role: "Anggota Divisi", divisionGroup: "Divisi I (Eksplorasi Musik)" },
      { name: "Gusti Ayu Ashira Pratiwi", role: "Anggota Divisi", divisionGroup: "Divisi I (Eksplorasi Musik)" },
      { name: "Anastasia Pui Dapa", role: "Anggota Divisi", divisionGroup: "Divisi I (Eksplorasi Musik)" },

      // DIVISI II (Manajemen Performance)
      { name: "Putu Aditya Arta Wiguna", role: "Koordinator Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "Kadek Anggun Sari Pramesta Kori", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "Ni Kadek Gita Dwi Ardiani", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "I Made Duta Aryawan", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "Fransiska Sarah Sinaga", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "Safeety Rica Letwing Manik", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
      { name: "Friska Oktaviani Gulo", role: "Anggota Divisi", divisionGroup: "Divisi II (Manajemen Performance)" },
    ],
    cover_image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    group_image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop",
  },
  {
    code: "Bidang II",
    name: "Humas dan Publikasi",
    slug: "humas-dan-publikasi",
    description: `Bidang II (Humas dan Publikasi) bertindak sebagai jembatan informasi internal maupun eksternal, mengelola media sosial, memproduksi seluruh materi desain dan konten kreatif organisasi, serta melaksanakan kegiatan sosial kemasyarakatan.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Menyalurkan informasi dalam ruang lingkup internal maupun eksternal.
• Mengurus dan mengatur segala jenis publikasi yang dimiliki oleh UKM Musik.
• Mengurus segala macam bentuk desain dan konten yang diperlukan selama kepengurusan.
• Mengurus dan mengatur sosial media UKM Musik.
• Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.`,
    programs: [
      "Menyalurkan informasi dalam ruang lingkup internal maupun eksternal.",
      "Mengurus dan mengatur segala jenis publikasi yang dimiliki oleh UKM Musik.",
      "Mengurus segala macam bentuk desain dan konten yang diperlukan selama kepengurusan.",
      "Mengurus dan mengatur sosial media UKM Musik.",
      "Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.",
    ],
    members: [
      { name: "I NYM Avataravada Cakti Apavarga", role: "Koordinator Bidang", divisionGroup: "Pimpinan Bidang" },
      { name: "Kadek Anggun Cahya Purnami", role: "Sekretaris Bidang", divisionGroup: "Pimpinan Bidang" },

      // DIVISI I (Media dan Publikasi)
      { name: "Putu Pranata Bujana Giri Sujiwaningrat", role: "Koordinator Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },
      { name: "Gede Dira Agastya", role: "Anggota Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },
      { name: "Daniel Cipta Dana", role: "Anggota Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },
      { name: "Ni Putu Diah Puspita", role: "Anggota Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },
      { name: "Dila Amanda", role: "Anggota Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },
      { name: "Renata Dwi Kasih Pangaribuan", role: "Anggota Divisi", divisionGroup: "Divisi I (Media dan Publikasi)" },

      // DIVISI II (Humas)
      { name: "Ni Made Nigina", role: "Koordinator Divisi", divisionGroup: "Divisi II (Humas)" },
      { name: "Ni Putu Diyana Maheswari", role: "Anggota Divisi", divisionGroup: "Divisi II (Humas)" },
      { name: "Feroma Riski Nainggolan", role: "Anggota Divisi", divisionGroup: "Divisi II (Humas)" },
      { name: "Sherly Damayanti Telaumbanua", role: "Anggota Divisi", divisionGroup: "Divisi II (Humas)" },
      { name: "I Putu Ryan Cahya Adi Merta", role: "Anggota Divisi", divisionGroup: "Divisi II (Humas)" },
      { name: "Mesycha Adel Mangesa Patoding", role: "Anggota Divisi", divisionGroup: "Divisi II (Humas)" },
    ],
    cover_image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
    group_image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
  },
  {
    code: "Bidang III",
    name: "Inventaris",
    slug: "inventaris",
    description: `Bidang III (Inventaris) bertanggung jawab penuh atas pemeliharaan, perawatan, dan pendataan aset alat musik serta fasilitas studio UKM Musik Undiksha, pengaturan sewa/peminjaman, piket sekretariat, hingga pawai parade PKKMB.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Bertanggung jawab dalam perawatan dan pemeliharaan segala jenis inventaris yang dimiliki UKM Musik.
• Bertanggung jawab dalam pengadaan dan perbaikan barang di kemudian hari.
• Mengatur dan mengurus segala macam bentuk peminjaman inventaris oleh organisasi lain.
• Mencatat asset dan inventaris UKM Musik.
• Mengatur pelaksanaan piket sekretariat UKM Musik.
• Mengurus parade UKM Musik dalam rangka PKKMB.`,
    programs: [
      "Bertanggung jawab dalam perawatan dan pemeliharaan segala jenis inventaris yang dimiliki UKM Musik.",
      "Bertanggung jawab dalam pengadaan dan perbaikan barang di kemudian hari.",
      "Mengatur dan mengurus segala macam bentuk peminjaman inventaris oleh organisasi lain.",
      "Mencatat asset dan inventaris UKM Musik.",
      "Mengatur pelaksanaan piket sekretariat UKM Musik.",
      "Mengurus parade UKM Musik dalam rangka PKKMB.",
    ],
    members: [
      { name: "Kadek Erwin Setiawan", role: "Koordinator Bidang", divisionGroup: "Pimpinan Bidang" },
      { name: "Made Pramiahesti Ayu Ningrum", role: "Sekretaris Bidang", divisionGroup: "Pimpinan Bidang" },

      // DIVISI I (Pengadaan)
      { name: "Gede Keva Agastya", role: "Koordinator Divisi", divisionGroup: "Divisi I (Pengadaan)" },
      { name: "I Ketut Alit Junaedi Wardana", role: "Anggota Divisi", divisionGroup: "Divisi I (Pengadaan)" },
      { name: "I Gede Dimas Arya Wiryanatha", role: "Anggota Divisi", divisionGroup: "Divisi I (Pengadaan)" },
      { name: "Rifa Nur Aini", role: "Anggota Divisi", divisionGroup: "Divisi I (Pengadaan)" },
      { name: "Aylo Abraham Brahmana", role: "Anggota Divisi", divisionGroup: "Divisi I (Pengadaan)" },

      // DIVISI II (Perawatan)
      { name: "I Made Yudha Dwipayana", role: "Koordinator Divisi", divisionGroup: "Divisi II (Perawatan)" },
      { name: "Jaysen Natanael Kartiko", role: "Anggota Divisi", divisionGroup: "Divisi II (Perawatan)" },
      { name: "Made Mahestra Wilothama", role: "Anggota Divisi", divisionGroup: "Divisi II (Perawatan)" },
      { name: "Farel Hafiz Yuril Kemal", role: "Anggota Divisi", divisionGroup: "Divisi II (Perawatan)" },
      { name: "I Putu Alit Juniarta", role: "Anggota Divisi", divisionGroup: "Divisi II (Perawatan)" },
    ],
    cover_image_url: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=1600&auto=format&fit=crop",
    group_image_url: "https://images.unsplash.com/photo-1520523839898-507125cd53c1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    code: "Bidang IV",
    name: "Kesejahteraan Anggota",
    slug: "kesejahteraan-anggota",
    description: `Bidang IV (Kesejahteraan Anggota) bertanggung jawab menjaga solidaritas dan keharmonisan seluruh fungsionaris, pendataan anggota, kegiatan kerohanian, seragam organisasi, wawancara bidang, Diklat anggota baru, serta kegiatan pengabdian masyarakat.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.
• Bertanggung jawab dalam keharmonisan anggota pengurus UKM Musik.
• Mendata seluruh anggota pengurus UKM Musik.
• Bertanggung jawab dalam mengatur segala macam bentuk kerohanian.
• Mengurus pembelian serta pembagian baju kerja UKM.
• Mengurus wawancara bidang untuk menjadi fungsionaris.
• Melaksanakan Pendidikan dan Pelatihan bagi mahasiswa Universitas Pendidikan Ganesha yang berminat bergabung ke dalam organisasi UKM Musik.`,
    programs: [
      "Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.",
      "Bertanggung jawab dalam keharmonisan anggota pengurus UKM Musik.",
      "Mendata seluruh anggota pengurus UKM Musik.",
      "Bertanggung jawab dalam mengatur segala macam bentuk kerohanian.",
      "Mengurus pembelian serta pembagian baju kerja UKM.",
      "Mengurus wawancara bidang untuk menjadi fungsionaris.",
      "Melaksanakan Pendidikan dan Pelatihan bagi mahasiswa Universitas Pendidikan Ganesha yang berminat bergabung ke dalam organisasi UKM Musik.",
    ],
    members: [
      { name: "Komang Wulan Cantika Taradiva", role: "Koordinator Bidang", divisionGroup: "Pimpinan Bidang" },
      { name: "I Gede Adnyana Dipa", role: "Sekretaris Bidang", divisionGroup: "Pimpinan Bidang" },

      // DIVISI I (Kerohanian)
      { name: "Ni Kadek Kartika Putri", role: "Koordinator Divisi", divisionGroup: "Divisi I (Kerohanian)" },
      { name: "Kadek Tata Sri Artawan", role: "Anggota Divisi", divisionGroup: "Divisi I (Kerohanian)" },
      { name: "Putu Nindi Rahayu", role: "Anggota Divisi", divisionGroup: "Divisi I (Kerohanian)" },
      { name: "Ni Putu Yunda Asih", role: "Anggota Divisi", divisionGroup: "Divisi I (Kerohanian)" },
      { name: "Kadek Merlikayani", role: "Anggota Divisi", divisionGroup: "Divisi I (Kerohanian)" },

      // DIVISI II (Keanggotaan)
      { name: "Kadek Yowanda Betricia", role: "Koordinator Divisi", divisionGroup: "Divisi II (Keanggotaan)" },
      { name: "I Putu Pranata Utama Diputra", role: "Anggota Divisi", divisionGroup: "Divisi II (Keanggotaan)" },
      { name: "Selpia Delawati Marbun", role: "Anggota Divisi", divisionGroup: "Divisi II (Keanggotaan)" },
      { name: "Berliana Amanah Ningrum", role: "Anggota Divisi", divisionGroup: "Divisi II (Keanggotaan)" },
      { name: "Putri Ari Laksmi", role: "Anggota Divisi", divisionGroup: "Divisi II (Keanggotaan)" },
    ],
    cover_image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    group_image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop",
  },
];
