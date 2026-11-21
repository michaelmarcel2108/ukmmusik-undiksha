-- ==========================================================================
-- SCRIPT UPDATE LINK DRIVE SUSULAN PESERTA RGC XVII (21 Nov 2026)
-- ==========================================================================
-- 1. Band No. 10, 23, 34
-- 2. Vokal Solo No. 29, 33
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. LOMBA BAND (Tabel: public.bands)
-- --------------------------------------------------------------------------

-- No Undi 10: Band
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/10lCbd13h_FzIJpCcHmOao-FBQwvmmsPU?usp=drive_link'
WHERE nomor_undi IN ('10', '010')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) = 10;

-- No Undi 23: Band
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1o63abdd7Y4lqsJxPZb3qLGOe-Aup5I_p'
WHERE nomor_undi IN ('23', '023')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) = 23;

-- No Undi 34: Band
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1C2jr8PTcpjIncmGYxyDRL07kWO_IlLDF/view?usp=drivesdk'
WHERE nomor_undi IN ('34', '034')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) = 34;


-- --------------------------------------------------------------------------
-- 2. LOMBA VOKAL SOLO (Tabel: public.vocal_solos)
-- --------------------------------------------------------------------------

-- No Undi 29: Vokal Solo
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1rx3GhqcxoirqdTckVdwoTPoGQiHbFgLk'
WHERE nomor_undi IN ('29', '029')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) = 29;

-- No Undi 33: Vokal Solo
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1lONauJwbEBt-8Mij7Q4lwjH53oqI5tQi'
WHERE nomor_undi IN ('33', '033')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) = 33;


-- ==========================================================================
-- 3. QUERY VERIFIKASI (Untuk memastikan data sudah terupdate)
-- ==========================================================================

-- Cek Band (10, 23, 34)
SELECT id, nomor_undi, name, video_url 
FROM public.bands 
WHERE nomor_undi IN ('10', '010', '23', '023', '34', '034')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) IN (10, 23, 34)
ORDER BY CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer);

-- Cek Vokal Solo (29, 33)
SELECT id, nomor_undi, name, video_url 
FROM public.vocal_solos 
WHERE nomor_undi IN ('29', '029', '33', '033')
   OR CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer) IN (29, 33)
ORDER BY CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer);
