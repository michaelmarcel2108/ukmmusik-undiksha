-- ==========================================================================
-- SCRIPT UPDATE LINK DRIVE / VIDEO PESERTA LOMBA RGC XVII
-- Website UKM Musik Undiksha
-- ==========================================================================
-- Catatan:
-- 1. Script ini mengupdate kolom video_url pada tabel public.bands dan public.vocal_solos.
-- 2. Menggunakan klausa WHERE ganda (nomor_undi dan ILIKE nama) agar aman terhadap format
--    nomor undi dengan atau tanpa angka nol di depan ('3' atau '03').
-- 3. Untuk peserta yang mengirim beberapa kali (re-submit), link terbaru yang digunakan.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- BAGIAN 1: UPDATE LINK PESERTA LOMBA BAND (Tabel: public.bands)
-- Total: 30 Band
-- --------------------------------------------------------------------------

-- No Undi 02: SANKARA BAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1Q4z-RNOrE9aYfWjSIeeRAX8Ha-cB3I-r'
WHERE nomor_undi IN ('2', '02') OR name ILIKE '%SANKARA BAND%';

-- No Undi 03: Late Night Necromancy
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1FJW2O3qtZVjhSJVtqPkdk1m15jubxKU-'
WHERE nomor_undi IN ('3', '03') OR name ILIKE '%Late Night Necromancy%';

-- No Undi 04: Rhythmora Jivana
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1RdsxbbuxFzUiLfta92Jhs1roRUciAcXv'
WHERE nomor_undi IN ('4', '04') OR name ILIKE '%Rhythmora Jivana%';

-- No Undi 05: GemaSwara77
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1w1Ek1T5xy-95BGj7QFldJp-jPknI9Elz'
WHERE nomor_undi IN ('5', '05') OR name ILIKE '%GemaSwara77%';

-- No Undi 06: FivePm
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/147YEPsi588n7-pWPygHB3RAuEPxyCDUq?usp=drive_link'
WHERE nomor_undi IN ('6', '06') OR name ILIKE '%FivePm%';

-- No Undi 07: Wise Monkey
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1FuRfRbkozP3jF6PSgLCZDqRozPzRLntk'
WHERE nomor_undi IN ('7', '07') OR name ILIKE '%Wise Monkey%';

-- No Undi 11: Pemahat Batu Mulia (PBM)
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1NUy5LZiajvjZY2WIF7WJvDhoO6LnqghM/view?usp=drivesdk'
WHERE nomor_undi IN ('11', '011') OR name ILIKE '%Pemahat Batu Mulia%';

-- No Undi 12: BearBand
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1ja58J50V-S5-nZ4UAA8d8UXpIRmLP9LQ?usp=sharing'
WHERE nomor_undi IN ('12', '012') OR name ILIKE '%BearBand%';

-- No Undi 13: BENZO BAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/17ORUbYTFNWd2WQTGRToRGOILmPhoyWuJ'
WHERE nomor_undi IN ('13', '013') OR name ILIKE '%BENZO BAND%';

-- No Undi 14: Five Souls
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1yLogiLqSNdn9K4XQ-lJbxZejJMa1-RuK/view?usp=drivesdk'
WHERE nomor_undi IN ('14', '014') OR name ILIKE '%Five Souls%';

-- No Undi 15: Sengkanaung
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1aGgKJNbilUxXYhJOw1as7KCvnXuTve0T/view?usp=drivesdk'
WHERE nomor_undi IN ('15', '015') OR name ILIKE '%Sengkanaung%';

-- No Undi 16: Shosha-X
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1sYcrShpuR0SOMbQdBpJy-QWyETMNZGAU'
WHERE nomor_undi IN ('16', '016') OR name ILIKE '%Shosha-X%';

-- No Undi 17: MAHASUSVARA NESA
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1feZsu2BOUQJqSgXOOqfSSJ2PNPQ8g6qT'
WHERE nomor_undi IN ('17', '017') OR name ILIKE '%MAHASUSVARA NESA%';

-- No Undi 18: RAHVANA
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1xt2I_Zg79Zj1__yvNKz95U39EuP7qJmV/view?usp=sharing'
WHERE nomor_undi IN ('18', '018') OR name ILIKE '%RAHVANA%';

-- No Undi 19: Sparkle Five
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1sgEWTx40qpRe4YmHKJwQ8HV8Raiq51_w/view?usp=sharing'
WHERE nomor_undi IN ('19', '019') OR name ILIKE '%Sparkle Five%';

-- No Undi 20: SOEDARSO
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1rlavgmocP_wCeKrc3xRCzq9dpNCKuVAH/view?usp=drivesdk'
WHERE nomor_undi IN ('20', '020') OR name ILIKE '%SOEDARSO%';

-- No Undi 21: SEVENOVA BAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1ZrsMIUeF6r3K0d1nETRKF_i_hnFZUQim'
WHERE nomor_undi IN ('21', '021') OR name ILIKE '%SEVENOVA BAND%';

-- No Undi 24: Molecool band
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1NQRLy0MuqajlSUOlEprtEpEuvr1DkOhE/view?usp=drivesdk'
WHERE nomor_undi IN ('24', '024') OR name ILIKE '%Molecool band%';

-- No Undi 26: The Character Rock
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1ouFI2ldO4NmZOelrvq56d6c3iKLoJa_E?usp=sharing'
WHERE nomor_undi IN ('26', '026') OR name ILIKE '%The Character Rock%';

-- No Undi 27: ARCTIC BAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/13GIprpobfw112oT4mJ7Wmkr60MPoRsD3/view?usp=drivesdk'
WHERE nomor_undi IN ('27', '027') OR name ILIKE '%ARCTIC BAND%';

-- No Undi 28: DK481
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1w-SNomymDdIDj33LBcfG5QiDpfnELdoW'
WHERE nomor_undi IN ('28', '028') OR name ILIKE '%DK481%';

-- No Undi 29: UKM Rumah Seni FK UNAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1CrHCfeLL_414sCDUWpbtRz_W2Nf9_ZTa?usp=sharing'
WHERE nomor_undi IN ('29', '029') OR name ILIKE '%UKM Rumah Seni FK UNAND%';

-- No Undi 30: LINJING
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/17l8rYqNtPOfJSlH_uHR-jlhygeklGrJ4'
WHERE nomor_undi IN ('30', '030') OR name ILIKE '%LINJING%';

-- No Undi 31: Weda-19
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1hJDb3iqsN2U7X-bUvSLfmsIgeqDcYmUj/view?usp=sharing'
WHERE nomor_undi IN ('31', '031') OR name ILIKE '%Weda-19%';

-- No Undi 32: ASKARSA BAND
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1ItMSV5LetWYC2g-0TqBkSlx9cJrj6hJr?usp=drive_link'
WHERE nomor_undi IN ('32', '032') OR name ILIKE '%ASKARSA BAND%';

-- No Undi 35: Concordia
UPDATE public.bands
SET video_url = 'https://drive.google.com/file/d/1Oau77qewP5n0HsLZFpyVKzNLc8r1XlC9/view?usp=drivesdk'
WHERE nomor_undi IN ('35', '035') OR name ILIKE '%Concordia%';

-- No Undi 36: UKM BAND UNMUL
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/15mCJpshrosSQg_h_uomuI5oJ46EuTYVn'
WHERE nomor_undi IN ('36', '036') OR name ILIKE '%UKM BAND UNMUL%';

-- No Undi 37: The Sandals
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1_4zT7O5zjmuLboTOjWZDqy-Q_ciJgjU9'
WHERE nomor_undi IN ('37', '037') OR name ILIKE '%The Sandals%';

-- No Undi 38: Plaster Band
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1_vKpWRgkZDLvLgk05_8vKCyR57EsLotd?usp=sharing'
WHERE nomor_undi IN ('38', '038') OR name ILIKE '%Plaster Band%';

-- No Undi 40: Sound Of blue
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/1rvCBEc2W6QNx2gSV0VzsGvi-_kVCwsUH?usp=sharing'
WHERE nomor_undi IN ('40', '040') OR name ILIKE '%Sound Of blue%';


-- --------------------------------------------------------------------------
-- BAGIAN 2: UPDATE LINK PESERTA VOKAL SOLO (Tabel: public.vocal_solos)
-- Total: 44 Peserta Vokal
-- --------------------------------------------------------------------------

-- No Undi 01: Putu Dinda Filia Kencana
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1xkz4ECpGcaEbi6kUIzVb_h0ndVhGIEUr'
WHERE nomor_undi IN ('1', '01') OR name ILIKE '%Putu Dinda Filia Kencana%';

-- No Undi 02: NI PUTU CELSIANI
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1-bY3H3DGaVVKVLLri_Dg6laYW76-tmai'
WHERE nomor_undi IN ('2', '02') OR name ILIKE '%NI PUTU CELSIANI%';

-- No Undi 03: Amandya Oka
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1eAObMUNUw1tkfGLSjWlpcue2alH1j4fA'
WHERE nomor_undi IN ('3', '03') OR name ILIKE '%Amandya Oka%';

-- No Undi 04: Putu Sofia Chandra Kirana
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/15tPGIu4LQuKBDWEVHJiPwnJSP_JWujeK'
WHERE nomor_undi IN ('4', '04') OR name ILIKE '%Putu Sofia Chandra Kirana%';

-- No Undi 05: Hani
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1_pfxXtbdaNT48z29Is-2wITHsdOAxLLL'
WHERE nomor_undi IN ('5', '05') OR name ILIKE '%Hani%';

-- No Undi 06: Neora Chazaya Haleema Variz
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1PyrmQZB9PtfoS8cmGN61wW5G5D2dDly3?usp=drive_link'
WHERE nomor_undi IN ('6', '06') OR name ILIKE '%Neora Chazaya Haleema Variz%';

-- No Undi 08: Ni Made Adelia Pratiwi
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/13zevzpUmunb9i1wSJRwWJe_FeTe7Kn5_'
WHERE nomor_undi IN ('8', '08') OR name ILIKE '%Ni Made Adelia Pratiwi%';

-- No Undi 09: Ceicilia Semarchis Adelwise Deu
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1wGeffTG5rvc2_sQ-A1j4mldWPOIBqOzk'
WHERE nomor_undi IN ('9', '09') OR name ILIKE '%Ceicilia Semarchis Adelwise Deu%';

-- No Undi 10: Kadek Cleren Valentina Devanto
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1xHg5OKUybM7FtEdAyTQUNZn0FDvWTWgl/view?usp=drivesdk'
WHERE (nomor_undi IN ('10', '010') AND name ILIKE '%Cleren%') OR name ILIKE '%Kadek Cleren%';

-- No Undi 11: Ni Made Frida Suchisma
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1jgARgjjnozFZZHf3b4qPwomIvh0aHr0p'
WHERE nomor_undi IN ('11', '011') OR name ILIKE '%Ni Made Frida Suchisma%';

-- No Undi 12: I DEWA AYU SIPTA RUPA RENANTA
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1KLpHvF5CvPebvL5rjEGSmB7OJU6we4_a'
WHERE nomor_undi IN ('12', '012') OR name ILIKE '%I DEWA AYU SIPTA RUPA RENANTA%';

-- No Undi 13: Ida Ayu Athalia Putri Amanda Iswara
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1keUREvPNhNgg46AeHUrgVg55pi6JPNVS?usp=sharing'
WHERE nomor_undi IN ('13', '013') OR name ILIKE '%Ida Ayu Athalia Putri Amanda Iswara%';

-- No Undi 14: Kadek rena verayani
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1KG1BPYmGBi7vQ-YQkK4xhdlGPnIkFm-K'
WHERE nomor_undi IN ('14', '014') OR name ILIKE '%Kadek rena verayani%';

-- No Undi 15: Nandini Kumala Dewantari
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1b0t9oOqxGqK2CG2WOldsI7t9iBt3o-h1?usp=sharing'
WHERE nomor_undi IN ('15', '015') OR name ILIKE '%Nandini Kumala Dewantari%';

-- No Undi 16: Ni Ketut Juli Arita Dewi
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1nDRVZgYojDktAfIBB2MQ00DGHbhEfa-g'
WHERE nomor_undi IN ('16', '016') OR name ILIKE '%Ni Ketut Juli Arita Dewi%';

-- No Undi 17: Kadek Wahyudhi Artha
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1ZrUXCsmvFnO1pq6cFGxZ6BberQrjt45u'
WHERE nomor_undi IN ('17', '017') OR name ILIKE '%Kadek Wahyudhi Artha%';

-- No Undi 18: Ajun Puspita
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1Yd5eULGi84YLFr9MjqP3seX5PMYI_nkB'
WHERE nomor_undi IN ('18', '018') OR name ILIKE '%Ajun Puspita%';

-- No Undi 19: Gusti Ayu Putu Eka Suryantini
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1ioyJ0hs4uBegHNACZCFbsky3S1XFDTEO/view?usp=drive_link'
WHERE nomor_undi IN ('19', '019') OR name ILIKE '%Gusti Ayu Putu Eka Suryantini%';

-- No Undi 20: Elisabet Muniarti
-- (Link alternatif jika diperlukan: https://drive.google.com/file/d/1wWZy4pQD5yGXGbPYDu16Q5oO63pgZ1vV/view?usp=drivesdk)
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1yzH9NIRHJfDl4xtzRq7eXKieVocmmCve/view?usp=drivesdk'
WHERE nomor_undi IN ('20', '020') OR name ILIKE '%Elisabet Muniarti%';

-- No Undi 21: Ni Putu Puji Sarini
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1UbDa-VTkvV62K9hRDnKgns4w7vw6exoj'
WHERE nomor_undi IN ('21', '021') OR name ILIKE '%Ni Putu Puji Sarini%';

-- No Undi 22: Putu Epi Yunita Dewi
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1W-mxTm96XJTt4gsO4UIe2533A5SLUWiI'
WHERE nomor_undi IN ('22', '022') OR name ILIKE '%putu epi yunita dewi%';

-- No Undi 23: Hasfwany Khuspa Dinata
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1EtMP-L7Zulw8D4haiPfOiloRaX6JRGpM'
WHERE nomor_undi IN ('23', '023') OR name ILIKE '%Hasfwany Khuspa Dinata%';

-- No Undi 24: Debora Grace Uli Sudibyo
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1rvIvhg6PQGk2kW7sEBnLVAmyrXbO0log/view?usp=sharing'
WHERE (nomor_undi IN ('24', '024') AND name ILIKE '%Debora%') OR name ILIKE '%Debora Grace%';

-- No Undi 25: Harmonie Eleanor Victoria Siregar
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1Pguv37Ddlm1MKZvk3Q3hEy1xsc8Q5oDH'
WHERE nomor_undi IN ('25', '025') OR name ILIKE '%Harmonie Eleanor Victoria Siregar%';

-- No Undi 27: Pratiwi Puspita Sari
-- (Link alternatif part 2: https://drive.google.com/file/d/1DBncjCOpNvjqTP0goeLBFZbAygBe71er/view?usp=drivesdk)
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/16dXKOBL64KIxF5CiGJKL3dWD4VjqLTAB/view?usp=drivesdk'
WHERE nomor_undi IN ('27', '027') OR name ILIKE '%Pratiwi Puspita Sari%';

-- No Undi 28: Izzatunnada Anjani
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1fWbvziWDiyI1Q44n-jQuulbBPHHxq_iT'
WHERE nomor_undi IN ('28', '028') OR name ILIKE '%izzatunnada anjani%';

-- No Undi 30: Kadek Nuraeni
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1Dljz5nAOzcxEklZVva2M597D386KqRsy'
WHERE nomor_undi IN ('30', '030') OR name ILIKE '%Kadek Nuraeni%';

-- No Undi 31: Ni Kadek Juni Puspita Dewi
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1dp-vIQ5uE7U2UhGsFXgSWbi5q6WSM7QO/view?usp=drivesdk'
WHERE nomor_undi IN ('31', '031') OR name ILIKE '%Ni kadek juni puspita dewi%';

-- No Undi 32: Evalyne Princessa
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/16rukD6aqKTMiCBaskT8tgLnzOspKFWST'
WHERE nomor_undi IN ('32', '032') OR name ILIKE '%Evalyne Princessa%';

-- No Undi 34: ADHISA HAYYU WARDHANI
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1JVnzSyLPo7ytrYIbjzsQSeP2SIexk57O?usp=drive_link'
WHERE nomor_undi IN ('34', '034') OR name ILIKE '%ADHISA HAYYU WARDHANI%';

-- No Undi 35: Aril Hidayat
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1jnIy5VuakfQnA6Ef9tDjq5xSB6SmeNvR?usp=drive_link'
WHERE nomor_undi IN ('35', '035') OR name ILIKE '%Aril Hidayat%';

-- No Undi 36: Istiqomah
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1aq06b0RZrzIXYJPJkfHQJbuo4C70MzMn?usp=drive_link'
WHERE nomor_undi IN ('36', '036') OR name ILIKE '%Istiqomah%';

-- No Undi 37: Ni Kadek Citra Lestari
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1NLakkwvyr-pCpPOLHgMacEtvsVKKYO0-?usp=drive_link'
WHERE nomor_undi IN ('37', '037') OR name ILIKE '%Ni Kadek Citra Lestari%';

-- No Undi 38: Ni Luh Tania Paramita
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1kfVJgNpky6xBTnA50LFE4-jHMIVK8jxQ?usp=drive_link'
WHERE nomor_undi IN ('38', '038') OR name ILIKE '%Ni Luh Tania Paramita%';

-- No Undi 39: I Gede Edy Artawan
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1b7PWk-W4E26WkBqnodb4a6BzVwJNsv4T?usp=drive_link'
WHERE nomor_undi IN ('39', '039') OR name ILIKE '%I Gede Edy Artawan%';

-- No Undi 40: Ni Luh Putu Queenida Pramusti
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1eXVu93WtbgjVJqO5--VThGloQp1e0zTt?usp=drive_link'
WHERE nomor_undi IN ('40', '040') OR name ILIKE '%Ni Luh Putu Queenida Pramusti%';

-- No Undi 41: I Gusti Ayu Reva Avantika
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1QtZErGACvmP6MDtKImmChOagNi0wojgg'
WHERE nomor_undi IN ('41', '041') OR name ILIKE '%I Gusti Ayu Reva Avantika%';

-- No Undi 42: Ni Putu Windie Fredella Anggarani
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1tncumqHn5hoNg8HKTLED2LTcB-tbbnMv/view?usp=drivesdk'
WHERE nomor_undi IN ('42', '042') OR name ILIKE '%Ni Putu Windie Fredella Anggarani%';

-- No Undi 43: Adelia
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1Ajai-5SBDpGGxzh3NfeKppegrLLhhYzf'
WHERE nomor_undi IN ('43', '043') OR name ILIKE '%Adelia%';

-- No Undi 44: Medina Munawwaroti Ahmad
UPDATE public.vocal_solos
SET video_url = 'https://bit.ly/44_MedinaMunawwarotiAhmad_CintaKarenaCinta_jdka'
WHERE nomor_undi IN ('44', '044') OR name ILIKE '%Medina Munawwaroti Ahmad%';

-- No Undi 45: Miltiadens Tamu Ambu
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/1Jk9gpjn4gWhWz6Dvcb-uCM0PsW-bM2uQ?usp=drive_link'
WHERE nomor_undi IN ('45', '045') OR name ILIKE '%Miltiadens Tamu Ambu%';

-- No Undi 46: Luh Sangayun Dewi
-- (Link alternatif: https://bit.ly/46LuhSangayunDewiBawaDiaKembali)
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/file/d/1UwB5Gj8_tI9zYy6-RJTCtW3kICUO0A7c/view?usp=sharing'
WHERE nomor_undi IN ('46', '046') OR name ILIKE '%luh sangayun dewi%';

-- No Undi 47: Faskho Orlando Shoya
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/18MroCmseWnNZ--onAXazSs531wSBkNTB?usp=drive_link'
WHERE nomor_undi IN ('47', '047') OR name ILIKE '%Faskho Orlando Shoya%';


-- --------------------------------------------------------------------------
-- BAGIAN 3: KASUS KHUSUS & SUBMISSION TAMBAHAN
-- --------------------------------------------------------------------------

-- 3a. 'RESTORASI MUSIC' mengisi form vokal dengan No 10:
-- Jika tersimpan di tabel vocal_solos:
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/10lCbd13h_FzIJpCcHmOao-FBQwvmmsPU?usp=drive_link'
WHERE name ILIKE '%RESTORASI%' OR (nomor_undi IN ('10', '010') AND name ILIKE '%RESTORASI%');

-- Jika sebenarnya peserta band dan tersimpan di tabel bands:
UPDATE public.bands
SET video_url = 'https://drive.google.com/drive/folders/10lCbd13h_FzIJpCcHmOao-FBQwvmmsPU?usp=drive_link'
WHERE name ILIKE '%RESTORASI%';

-- 3b. 'Molecool Band' sempat mengumpulkan di form vokal (No 24) sebelum form band:
-- Jika di database tersimpan juga di vocal_solos:
UPDATE public.vocal_solos
SET video_url = 'https://drive.google.com/drive/folders/10tJhdLjFMdPH6vDkU2HmHyZtQVDOn4Eu'
WHERE name ILIKE '%Molecool%';


-- ==========================================================================
-- VERIFIKASI HASIL IMPORT LINK
-- Jalankan query berikut untuk memastikan semua peserta sudah memiliki link
-- ==========================================================================
-- Cek Band yang link videonya masih belum terisi:
SELECT nomor_undi, name, video_url 
FROM public.bands 
WHERE video_url IS NULL OR video_url = '' 
ORDER BY CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer);

-- Cek Vokal Solo yang link videonya masih belum terisi:
SELECT nomor_undi, name, video_url 
FROM public.vocal_solos 
WHERE video_url IS NULL OR video_url = '' 
ORDER BY CAST(NULLIF(regexp_replace(nomor_undi, '\D', '', 'g'), '') AS integer);
