-- ==========================================
-- UKM Musik Undiksha Database Schema & RLS
-- ==========================================

-- 1. Site Settings (Single row for global config)
CREATE TABLE public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title text NOT NULL DEFAULT 'UKM MUSIK UNDIKSHA',
  hero_subtitle text NOT NULL DEFAULT 'Salam Rock',
  hero_image_url text,
  contact_humas text,
  contact_inventaris text,
  embed_music_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default row if not exists
INSERT INTO public.site_settings (hero_title, hero_subtitle) 
VALUES ('UKM MUSIK UNDIKSHA', 'Salam Rock');

-- 2. Activities (Gallery on Landing Page)
CREATE TABLE public.activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Divisions (Bidang Organisasi - GBPK 2026/2027)
CREATE TABLE IF NOT EXISTS public.divisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_image_url text,
  group_image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data 4 Bidang Sesuai GBPK UKM Musik Undiksha Masa Bakti 2026/2027
INSERT INTO public.divisions (name, slug, description, cover_image_url, group_image_url)
VALUES
(
  'Bidang I: Pelatihan dan Pengembangan',
  'pelatihan-dan-pengembangan',
  'Bidang I (Pelatihan dan Pengembangan) berfokus pada pembinaan, pendataan minat dan bakat musisi, pendelegasian lomba, serta peningkatan mutu kemahasiswaan dan penyelenggaraan acara musik besar UKM Musik Undiksha.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Melaksanakan dan menghadiri kegiatan-kegiatan akademik yang bersifat ke dalam dan ke luar Universitas Pendidikan Ganesha.
• Mengurus dan mendata seluruh minat dan bakat anggota kepengurusan UKM Musik.
• Mendampingi anggota UKM Musik yang membawa nama organisasi dan lembaga dalam lomba.
• Mengurus mengenai Informasi Kreativitas Mahasiswa.
• Bertanggung jawab terhadap Pendelegasian Lomba, seminar, pelatihan di dalam maupun di luar lingkungan Undiksha.
• Melaksanakan Ganesha Rock Festival demi meningkatkan eksistensi organisasi dan lembaga.
• Melaksanakan pekan Suksesi sebagai bentuk demokrasi dan kaderisasi pemimpin.
• Menyiapkan dan melaksanakan Rapat Kerja Kepengurusan sebagai langkah awal berorganisasi.',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop'
),
(
  'Bidang II: Humas dan Publikasi',
  'humas-dan-publikasi',
  'Bidang II (Humas dan Publikasi) bertindak sebagai jembatan informasi internal maupun eksternal, mengelola media sosial, memproduksi seluruh materi desain dan konten kreatif organisasi, serta melaksanakan kegiatan sosial kemasyarakatan.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Menyalurkan informasi dalam ruang lingkup internal maupun eksternal.
• Mengurus dan mengatur segala jenis publikasi yang dimiliki oleh UKM Musik.
• Mengurus segala macam bentuk desain dan konten yang diperlukan selama kepengurusan.
• Mengurus dan mengatur sosial media UKM Musik.
• Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop'
),
(
  'Bidang III: Inventaris',
  'inventaris',
  'Bidang III (Inventaris) bertanggung jawab penuh atas pemeliharaan, perawatan, dan pendataan aset alat musik serta fasilitas studio UKM Musik Undiksha, pengaturan sewa/peminjaman, piket sekretariat, hingga pawai parade PKKMB.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Bertanggung jawab dalam perawatan dan pemeliharaan segala jenis inventaris yang dimiliki UKM Musik.
• Bertanggung jawab dalam pengadaan dan perbaikan barang di kemudian hari.
• Mengatur dan mengurus segala macam bentuk peminjaman inventaris oleh organisasi lain.
• Mencatat asset dan inventaris UKM Musik.
• Mengatur pelaksanaan piket sekretariat UKM Musik.
• Mengurus parade UKM Musik dalam rangka PKKMB.',
  'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520523839898-507125cd53c1?q=80&w=1000&auto=format&fit=crop'
),
(
  'Bidang IV: Kesejahteraan Anggota',
  'kesejahteraan-anggota',
  'Bidang IV (Kesejahteraan Anggota) bertanggung jawab menjaga solidaritas dan keharmonisan seluruh fungsionaris, pendataan anggota, kegiatan kerohanian, seragam organisasi, wawancara bidang, Diklat anggota baru, serta kegiatan pengabdian masyarakat.

Pokok-Pokok Program Kerja (GBPK 2026/2027):
• Melaksanakan P2M berupa acara seminar nasional dan penggalian dana dalam rangka memperingati hari AIDS sedunia.
• Bertanggung jawab dalam keharmonisan anggota pengurus UKM Musik.
• Mendata seluruh anggota pengurus UKM Musik.
• Bertanggung jawab dalam mengatur segala macam bentuk kerohanian.
• Mengurus pembelian serta pembagian baju kerja UKM.
• Mengurus wawancara bidang untuk menjadi fungsionaris.
• Melaksanakan Pendidikan dan Pelatihan bagi mahasiswa Universitas Pendidikan Ganesha yang berminat bergabung ke dalam organisasi UKM Musik.',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url,
  group_image_url = EXCLUDED.group_image_url;

-- 4. Members (Anggota & Fungsionaris Bidang)
CREATE TABLE public.members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  photo_url text,
  is_featured boolean DEFAULT false, -- If true, show on landing page
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4b. Core Members (Dewan Pengurus Inti / Badan Pengurus Harian - BPH)
-- Entitas pimpinan organisasi yang menaungi seluruh bidang (bukan bidang)
CREATE TABLE IF NOT EXISTS public.core_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL, -- Contoh: Ketua Umum, Wakil Ketua, Sekretaris Umum, Bendahara Umum
  order_index integer DEFAULT 0,
  photo_url text,
  bio text,
  instagram_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for core_members
ALTER TABLE public.core_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on core_members" ON public.core_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on core_members" ON public.core_members FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed Data Dewan Pengurus Inti (BPH) Masa Bakti 2026/2027
INSERT INTO public.core_members (name, role, order_index, bio, photo_url)
VALUES
('Michael Marcel Hartono', 'Ketua', 1, 'Memimpin jalannya organisasi, menetapkan arah kebijakan strategis internal maupun eksternal lembaga, serta bertanggung jawab penuh atas realisasi GBPK Masa Bakti 2026/2027.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'),
('Putu Indah Susanti', 'Wakil Ketua', 2, 'Mendampingi Ketua dalam mengoordinasikan seluruh bidang operasional, menjaga stabilitas dan soliditas internal, serta bertindak atas nama Ketua bila berhalangan.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'),
('Putu Divanya Candy Fortuna', 'Sekretaris 1', 3, 'Mengelola sirkulasi persuratan resmi, perizinan kampus, notulensi rapat, dan kepatuhan administrasi kesekretariatan UKM Musik.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop'),
('Kezia Paula Ramadhani', 'Sekretaris 2', 4, 'Mendampingi Sekretaris 1 dalam pengarsipan berkas, dokumentasi legalitas, presensi kehadiran rapat, dan penyusunan berkas organisasi.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'),
('Ni Wayan Dayuh Amiliya Selena', 'Bendahara 1', 5, 'Bertanggung jawab atas manajemen sirkulasi keuangan kas besar, penganggaran terpadu proker, pembukuan kas masuk/keluar, dan laporan keuangan resmi.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop'),
('Ni Luh Julia Daniyanti', 'Bendahara 2', 6, 'Mendampingi Bendahara 1 dalam pencatatan kas operasional harian, verifikasi bukti nota transaksi, dan penyusunan laporan keuangan kepanitiaan.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop')
ON CONFLICT DO NOTHING;

-- Seed Data Fungsionaris & Anggota Bidang Masa Bakti 2026/2027
-- (Ketetapan Sidang Raker No. 03/TAP/SIDANG RAKER/07/VII/2026)
DO $$
DECLARE
  b1_id uuid;
  b2_id uuid;
  b3_id uuid;
  b4_id uuid;
BEGIN
  SELECT id INTO b1_id FROM public.divisions WHERE slug = 'pelatihan-dan-pengembangan' LIMIT 1;
  SELECT id INTO b2_id FROM public.divisions WHERE slug = 'humas-dan-publikasi' LIMIT 1;
  SELECT id INTO b3_id FROM public.divisions WHERE slug = 'inventaris' LIMIT 1;
  SELECT id INTO b4_id FROM public.divisions WHERE slug = 'kesejahteraan-anggota' LIMIT 1;

  -- BIDANG I: Pelatihan dan Pengembangan
  IF b1_id IS NOT NULL THEN
    INSERT INTO public.members (name, role, division_id) VALUES
      ('Kadek Christian Paramartha Dwipayana', 'Koordinator Bidang', b1_id),
      ('Mutiara Gayatri', 'Sekretaris Bidang', b1_id),
      ('Reva Yenni R. Ginting', 'Koordinator Divisi - Divisi I (Eksplorasi Musik)', b1_id),
      ('Kadek Krisna Dipayana', 'Anggota Divisi - Divisi I (Eksplorasi Musik)', b1_id),
      ('Made Dedy Yudika Pranata', 'Anggota Divisi - Divisi I (Eksplorasi Musik)', b1_id),
      ('Gusti Ayu Ashira Pratiwi', 'Anggota Divisi - Divisi I (Eksplorasi Musik)', b1_id),
      ('Anastasia Pui Dapa', 'Anggota Divisi - Divisi I (Eksplorasi Musik)', b1_id),
      ('Putu Aditya Arta Wiguna', 'Koordinator Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('Kadek Anggun Sari Pramesta Kori', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('Ni Kadek Gita Dwi Ardiani', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('I Made Duta Aryawan', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('Fransiska Sarah Sinaga', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('Safeety Rica Letwing Manik', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id),
      ('Friska Oktaviani Gulo', 'Anggota Divisi - Divisi II (Manajemen Performance)', b1_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- BIDANG II: Humas dan Publikasi
  IF b2_id IS NOT NULL THEN
    INSERT INTO public.members (name, role, division_id) VALUES
      ('I NYM Avataravada Cakti Apavarga', 'Koordinator Bidang', b2_id),
      ('Kadek Anggun Cahya Purnami', 'Sekretaris Bidang', b2_id),
      ('Putu Pranata Bujana Giri Sujiwaningrat', 'Koordinator Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Gede Dira Agastya', 'Anggota Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Daniel Cipta Dana', 'Anggota Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Ni Putu Diah Puspita', 'Anggota Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Dila Amanda', 'Anggota Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Renata Dwi Kasih Pangaribuan', 'Anggota Divisi - Divisi I (Media dan Publikasi)', b2_id),
      ('Ni Made Nigina', 'Koordinator Divisi - Divisi II (Humas)', b2_id),
      ('Ni Putu Diyana Maheswari', 'Anggota Divisi - Divisi II (Humas)', b2_id),
      ('Feroma Riski Nainggolan', 'Anggota Divisi - Divisi II (Humas)', b2_id),
      ('Sherly Damayanti Telaumbanua', 'Anggota Divisi - Divisi II (Humas)', b2_id),
      ('I Putu Ryan Cahya Adi Merta', 'Anggota Divisi - Divisi II (Humas)', b2_id),
      ('Mesycha Adel Mangesa Patoding', 'Anggota Divisi - Divisi II (Humas)', b2_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- BIDANG III: Inventaris
  IF b3_id IS NOT NULL THEN
    INSERT INTO public.members (name, role, division_id) VALUES
      ('Kadek Erwin Setiawan', 'Koordinator Bidang', b3_id),
      ('Made Pramiahesti Ayu Ningrum', 'Sekretaris Bidang', b3_id),
      ('Gede Keva Agastya', 'Koordinator Divisi - Divisi I (Pengadaan)', b3_id),
      ('I Ketut Alit Junaedi Wardana', 'Anggota Divisi - Divisi I (Pengadaan)', b3_id),
      ('I Gede Dimas Arya Wiryanatha', 'Anggota Divisi - Divisi I (Pengadaan)', b3_id),
      ('Rifa Nur Aini', 'Anggota Divisi - Divisi I (Pengadaan)', b3_id),
      ('Aylo Abraham Brahmana', 'Anggota Divisi - Divisi I (Pengadaan)', b3_id),
      ('I Made Yudha Dwipayana', 'Koordinator Divisi - Divisi II (Perawatan)', b3_id),
      ('Jaysen Natanael Kartiko', 'Anggota Divisi - Divisi II (Perawatan)', b3_id),
      ('Made Mahestra Wilothama', 'Anggota Divisi - Divisi II (Perawatan)', b3_id),
      ('Farel Hafiz Yuril Kemal', 'Anggota Divisi - Divisi II (Perawatan)', b3_id),
      ('I Putu Alit Juniarta', 'Anggota Divisi - Divisi II (Perawatan)', b3_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- BIDANG IV: Kesejahteraan Anggota
  IF b4_id IS NOT NULL THEN
    INSERT INTO public.members (name, role, division_id) VALUES
      ('Komang Wulan Cantika Taradiva', 'Koordinator Bidang', b4_id),
      ('I Gede Adnyana Dipa', 'Sekretaris Bidang', b4_id),
      ('Ni Kadek Kartika Putri', 'Koordinator Divisi - Divisi I (Kerohanian)', b4_id),
      ('Kadek Tata Sri Artawan', 'Anggota Divisi - Divisi I (Kerohanian)', b4_id),
      ('Putu Nindi Rahayu', 'Anggota Divisi - Divisi I (Kerohanian)', b4_id),
      ('Ni Putu Yunda Asih', 'Anggota Divisi - Divisi I (Kerohanian)', b4_id),
      ('Kadek Merlikayani', 'Anggota Divisi - Divisi I (Kerohanian)', b4_id),
      ('Kadek Yowanda Betricia', 'Koordinator Divisi - Divisi II (Keanggotaan)', b4_id),
      ('I Putu Pranata Utama Diputra', 'Anggota Divisi - Divisi II (Keanggotaan)', b4_id),
      ('Selpia Delawati Marbun', 'Anggota Divisi - Divisi II (Keanggotaan)', b4_id),
      ('Berliana Amanah Ningrum', 'Anggota Divisi - Divisi II (Keanggotaan)', b4_id),
      ('Putri Ari Laksmi', 'Anggota Divisi - Divisi II (Keanggotaan)', b4_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 5. Programs (Proker / Berita)
CREATE TABLE public.programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  content text,
  cover_image_url text,
  date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Rental Items (Barang Sewa)
CREATE TABLE public.rental_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  detail_content text,
  price_per_day numeric,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;

-- 1. Policies for public read access (SELECT)
CREATE POLICY "Allow public read access on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on divisions" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public read access on programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on rental_items" ON public.rental_items FOR SELECT USING (true);

-- 2. Policies for Admin write access (INSERT, UPDATE, DELETE)
-- Only users who are authenticated (logged in) can modify data.

-- Site Settings
CREATE POLICY "Allow authenticated full access on site_settings" ON public.site_settings 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Activities
CREATE POLICY "Allow authenticated full access on activities" ON public.activities 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Divisions
CREATE POLICY "Allow authenticated full access on divisions" ON public.divisions 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Members
CREATE POLICY "Allow authenticated full access on members" ON public.members 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Programs
CREATE POLICY "Allow authenticated full access on programs" ON public.programs 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Rental Items
CREATE POLICY "Allow authenticated full access on rental_items" ON public.rental_items 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE POLICIES (Assuming you created a bucket named 'public_assets')
-- ==========================================
-- Note: You must create the bucket 'public_assets' manually in the Supabase Dashboard 
-- before these policies can work.

-- Allow public to read files from 'public_assets' bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'public_assets');

-- Allow authenticated admins to insert, update, delete files in 'public_assets'
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public_assets' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'public_assets' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'public_assets' AND auth.role() = 'authenticated');

-- 7. Bands (Peserta Lomba Band Nasional - RGC XVII)
CREATE TABLE IF NOT EXISTS public.bands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nomor_undi text,
  name text NOT NULL,
  song_title text,
  video_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Band Scores (Penilaian Juri Lomba Band Nasional - RGC XVII)
-- Kriteria Penilaian:
-- a) Musikalitas dan Harmoni (20%)
-- b) Kreativitas dan Aransemen (20%)
-- c) Kualitas Vokal (15%)
-- d) Kualitas Instrumen (15%)
-- e) Kekompakan Band (10%)
-- f) Teknis Audio (10%)
-- g) Performance dan Ekspresi Visual (10%)
CREATE TABLE IF NOT EXISTS public.band_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  jury_name text NOT NULL,
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE,
  musikalitas integer CHECK (musikalitas >= 50 AND musikalitas <= 100),
  aransemen integer CHECK (aransemen >= 50 AND aransemen <= 100),
  vokal integer CHECK (vokal >= 50 AND vokal <= 100),
  instrumen integer CHECK (instrumen >= 50 AND instrumen <= 100),
  kekompakan integer CHECK (kekompakan >= 50 AND kekompakan <= 100),
  audio integer CHECK (audio >= 50 AND audio <= 100),
  penampilan integer CHECK (penampilan >= 50 AND penampilan <= 100),
  total_murni integer,
  total_score numeric,
  keterangan text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Juries (Juri Lomba)
CREATE TABLE IF NOT EXISTS public.juries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Vocal Solos (Peserta Lomba Vokal Solo Nasional - RGC XVII)
CREATE TABLE IF NOT EXISTS public.vocal_solos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nomor_undi text,
  name text NOT NULL,
  song_title text,
  video_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Vocal Scores (Penilaian Juri Lomba Vokal Solo Nasional - RGC XVII)
-- Kriteria Penilaian:
-- a) Ketepatan Nada dan Intonasi (30%)
-- b) Teknik Vokal dan Pernapasan (25%)
-- c) Penghayatan Lagu dan Ekspresi (20%)
-- d) Artikulasi dan Pelafalan (10%)
-- e) Penampilan dan Penguasaan Panggung (10%)
-- f) Kreativitas dan Interpretasi Lagu (5%)
CREATE TABLE IF NOT EXISTS public.vocal_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  jury_name text NOT NULL,
  vocal_id uuid REFERENCES public.vocal_solos(id) ON DELETE CASCADE,
  intonasi integer CHECK (intonasi >= 50 AND intonasi <= 100),
  teknik integer CHECK (teknik >= 50 AND teknik <= 100),
  penghayatan integer CHECK (penghayatan >= 50 AND penghayatan <= 100),
  artikulasi integer CHECK (artikulasi >= 50 AND artikulasi <= 100),
  penampilan integer CHECK (penampilan >= 50 AND penampilan <= 100),
  kreativitas integer CHECK (kreativitas >= 50 AND kreativitas <= 100),
  total_murni integer,
  total_score numeric,
  keterangan text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all competition tables
ALTER TABLE public.bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.juries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocal_solos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocal_scores ENABLE ROW LEVEL SECURITY;

-- Policies for Bands
CREATE POLICY "Allow public read access on bands" ON public.bands FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on bands" ON public.bands FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for Band Scores
CREATE POLICY "Allow public read access on band_scores" ON public.band_scores FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on band_scores" ON public.band_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on band_scores" ON public.band_scores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for Juries
CREATE POLICY "Allow public read access on juries" ON public.juries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on juries" ON public.juries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for Vocal Solos
CREATE POLICY "Allow public read access on vocal_solos" ON public.vocal_solos FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on vocal_solos" ON public.vocal_solos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for Vocal Scores
CREATE POLICY "Allow public read access on vocal_scores" ON public.vocal_scores FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on vocal_scores" ON public.vocal_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on vocal_scores" ON public.vocal_scores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ========================================================
-- MIGRATION SCRIPT FOR EXISTING DATABASE
-- (Jalankan blok di bawah ini jika tabel bands / band_scores sudah ada sebelumnya)
-- ========================================================
/*
ALTER TABLE public.bands 
  ADD COLUMN IF NOT EXISTS nomor_undi text,
  ADD COLUMN IF NOT EXISTS song_title text,
  ADD COLUMN IF NOT EXISTS video_url text;

ALTER TABLE public.band_scores
  ADD COLUMN IF NOT EXISTS musikalitas integer CHECK (musikalitas >= 50 AND musikalitas <= 100),
  ADD COLUMN IF NOT EXISTS instrumen integer CHECK (instrumen >= 50 AND instrumen <= 100),
  ADD COLUMN IF NOT EXISTS kekompakan integer CHECK (kekompakan >= 50 AND kekompakan <= 100),
  ADD COLUMN IF NOT EXISTS audio integer CHECK (audio >= 50 AND audio <= 100),
  ADD COLUMN IF NOT EXISTS total_murni integer;

-- Longgarkan constraint kolom lama jika ada
ALTER TABLE public.band_scores ALTER COLUMN harmonisasi DROP NOT NULL;
*/

