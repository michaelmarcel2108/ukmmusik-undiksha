// Konfigurasi & Panduan Dewan Pengurus Inti (Badan Pengurus Harian / BPH)
// UKM Musik Universitas Pendidikan Ganesha Masa Bakti 2026/2027
// Ketetapan Raker No. 03/TAP/SIDANG RAKER/07/VII/2026

export const CORE_BPH_COVER_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop";

export interface CoreRoleItem {
  key: string;
  role: string;
  title: string;
  badge: string;
  order: number;
  description: string;
  responsibilities: string[];
  defaultName: string;
  photoUrl?: string;
}

export const ADVISORS_CONFIG = [
  {
    role: "Pelindung",
    title: "Rektor Universitas Pendidikan Ganesha",
    name: "Prof. Dr. Wayan Lasmawan, M.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    role: "Pengarah",
    title: "Wakil Rektor III Universitas Pendidikan Ganesha",
    name: "Prof. Dr. Drs. I Ketut Sudiana, M.Kes.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    role: "Pembina",
    title: "Pembina UKM Musik Undiksha",
    name: "I Kadek Happy Kardiawan, S.Pd., M.Pd.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  },
];

export const CORE_ROLES_CONFIG: CoreRoleItem[] = [
  {
    key: "ketua-umum",
    role: "Ketua",
    title: "Pemimpin & Penanggung Jawab Tertinggi",
    badge: "Ketua Umum",
    order: 1,
    defaultName: "Michael Marcel Hartono",
    description: "Memimpin jalannya organisasi, menetapkan arah kebijakan strategis internal maupun eksternal lembaga, serta bertanggung jawab penuh atas realisasi GBPK Masa Bakti 2026/2027.",
    responsibilities: [
      "Memimpin dan mengarahkan seluruh fungsionaris UKM Musik Undiksha.",
      "Mengambil keputusan strategis dalam ranah internal maupun eksternal kampus.",
      "Mengontrol, membimbing, dan mengevaluasi kinerja Bidang I, II, III, dan IV.",
      "Mewakili UKM Musik Undiksha dalam koordinasi resmi dengan Rektorat/Kemahasiswaan dan pihak luar.",
      "Memastikan seluruh amanat Rapat Kerja dan GBPK terlaksana secara disiplin dan berintegritas.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    key: "wakil-ketua",
    role: "Wakil Ketua",
    title: "Koordinator Internal & Penggerak Operasional",
    badge: "Wakil Ketua",
    order: 2,
    defaultName: "Putu Indah Susanti",
    description: "Mendampingi Ketua dalam mengoordinasikan seluruh bidang operasional, menjaga stabilitas dan soliditas internal, serta bertindak atas nama Ketua bila berhalangan.",
    responsibilities: [
      "Mengoordinasikan dan memantau realisasi program kerja di seluruh bidang operasional.",
      "Menggantikan tugas, fungsi, dan wewenang Ketua apabila berhalangan hadir.",
      "Menjaga keharmonisan dan iklim kerja produktif di antara seluruh fungsionaris.",
      "Memberikan pertimbangan strategis terhadap penyelesaian kendala operasional organisasi.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    key: "sekretaris-1",
    role: "Sekretaris 1",
    title: "Administrasi Utama & Tata Kelola Persuratan",
    badge: "Sekretaris 1",
    order: 3,
    defaultName: "Putu Divanya Candy Fortuna",
    description: "Mengelola sirkulasi persuratan resmi, perizinan kampus, notulensi rapat, dan kepatuhan administrasi kesekretariatan UKM Musik.",
    responsibilities: [
      "Mengatur sirkulasi surat masuk, surat keluar, dan dispensasi kemahasiswaan.",
      "Menyusun notulensi rapat kerja, rapat pleno, dan rapat evaluasi kepengurusan.",
      "Mengkoordinasikan penyusunan proposal kegiatan dan LPJ bersama bidang.",
      "Mengelola pengarsipan digital dan database resmi organisasi.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  },
  {
    key: "sekretaris-2",
    role: "Sekretaris 2",
    title: "Pendamping Administrasi & Dokumentasi Arsip",
    badge: "Sekretaris 2",
    order: 4,
    defaultName: "Kezia Paula Ramadhani",
    description: "Mendampingi Sekretaris 1 dalam pengarsipan berkas, dokumentasi legalitas, presensi kehadiran rapat, dan penyusunan berkas organisasi.",
    responsibilities: [
      "Membantu pengelolaan administrasi berkas kesekretariatan harian.",
      "Mencatat presensi kehadiran seluruh kegiatan dan rapat fungsionaris.",
      "Mengelola inventaris dokumen dan berkas legalitas kelembagaan.",
      "Mendampingi pembuatan laporan berkala administrasi organisasi.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    key: "bendahara-1",
    role: "Bendahara 1",
    title: "Manajemen Keuangan Utama & Kas Besar",
    badge: "Bendahara 1",
    order: 5,
    defaultName: "Ni Wayan Dayuh Amiliya Selena",
    description: "Bertanggung jawab atas manajemen sirkulasi keuangan kas besar, penganggaran terpadu proker, pembukuan kas masuk/keluar, dan laporan keuangan resmi.",
    responsibilities: [
      "Mengelola kas besar dan rekening resmi organisasi.",
      "Menyusun Rancangan Anggaran Biaya (RAB) terpadu bersama seluruh bidang.",
      "Melakukan audit dan pelaporan keuangan berkala secara transparan dan akuntabel.",
      "Mengatur sirkulasi dana pendaftaran lomba, sewa studio/alat, dan kas internal.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
  },
  {
    key: "bendahara-2",
    role: "Bendahara 2",
    title: "Pengelolaan Kas Operasional & Bukti Transaksi",
    badge: "Bendahara 2",
    order: 6,
    defaultName: "Ni Luh Julia Daniyanti",
    description: "Mendampingi Bendahara 1 dalam pencatatan kas operasional harian, verifikasi bukti nota transaksi, dan penyusunan laporan keuangan kepanitiaan.",
    responsibilities: [
      "Mengelola kas kecil operasional kebutuhan harian sekretariat.",
      "Mengumpulkan, memverifikasi, dan mengarsipkan nota/bukti transaksi keuangan.",
      "Membantu penyusunan lampiran keuangan dalam Laporan Pertanggungjawaban (LPJ).",
      "Mendampingi pencatatan penerimaan iuran dan kas fungsionaris.",
    ],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
];
