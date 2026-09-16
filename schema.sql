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

-- 3. Divisions (Bidang)
CREATE TABLE public.divisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_image_url text,
  group_image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Members
CREATE TABLE public.members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  photo_url text,
  is_featured boolean DEFAULT false, -- If true, show on landing page
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- 7. Bands (Peserta Lomba)
CREATE TABLE public.bands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Band Scores (Penilaian Juri)
CREATE TABLE public.band_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  jury_name text NOT NULL,
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE,
  harmonisasi integer CHECK (harmonisasi >= 50 AND harmonisasi <= 100),
  skill integer CHECK (skill >= 50 AND skill <= 100),
  performance integer CHECK (performance >= 50 AND performance <= 100),
  total_score integer,
  keterangan text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for new tables
ALTER TABLE public.bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_scores ENABLE ROW LEVEL SECURITY;

-- Policies for Bands
CREATE POLICY "Allow public read access on bands" ON public.bands FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on bands" ON public.bands FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for Band Scores
CREATE POLICY "Allow public insert access on band_scores" ON public.band_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on band_scores" ON public.band_scores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 9. Juries (Juri Lomba)
CREATE TABLE public.juries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for juries
ALTER TABLE public.juries ENABLE ROW LEVEL SECURITY;

-- Policies for Juries
CREATE POLICY "Allow public read access on juries" ON public.juries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on juries" ON public.juries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

