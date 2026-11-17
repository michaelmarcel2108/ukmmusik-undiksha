// Petunjuk Teknis Rock Goes To Campus XVII (RGC XVII)
// UKM Musik Universitas Pendidikan Ganesha

export const BAND_SONGS = [
  "Topeng – Noah",
  "Aku Milikmu – Dewa 19",
  "Karena Kamu – Geisha",
  "Pelan-Pelan Saja – Kotak",
  "Dia – Rocket Rockers",
  "Move On – Stand Here Alone",
];

export const VOCAL_SONGS = [
  "Bawa Dia Kembali – Mahalini",
  "My Heart – Aca Septriasa",
  "Cinta Karena Cinta – Judika",
  "Tunggu Apa Lagi – Nyoman Paul",
  "Teh Hijau – Tulus",
  "Selimut Hati – Dewa 19",
];

export interface BandCriteriaConfig {
  key: "musikalitas" | "aransemen" | "vokal" | "instrumen" | "kekompakan" | "audio" | "penampilan";
  label: string;
  weight: number; // in percent, e.g. 20
  weightDecimal: number; // 0.20
  description: string;
}

export const BAND_CRITERIA: BandCriteriaConfig[] = [
  {
    key: "musikalitas",
    label: "Musikalitas dan Harmoni",
    weight: 20,
    weightDecimal: 0.20,
    description: "Kemampuan menyajikan musik secara selaras, mencakup ketepatan nada, tempo, ritme, dinamika, serta kesesuaian antarunsur musik.",
  },
  {
    key: "aransemen",
    label: "Kreativitas dan Aransemen",
    weight: 20,
    weightDecimal: 0.20,
    description: "Kreativitas dalam mengembangkan lagu, variasi aransemen, interpretasi lagu, eksplorasi musik, serta keunikan tanpa menghilangkan karakter asli lagu.",
  },
  {
    key: "vokal",
    label: "Kualitas Vokal",
    weight: 15,
    weightDecimal: 0.15,
    description: "Kemampuan vokalis menyanyikan lagu, ketepatan nada, teknik vokal, artikulasi, penghayatan, serta kesesuaian vokal dengan iringan musik.",
  },
  {
    key: "instrumen",
    label: "Kualitas Instrumen",
    weight: 15,
    weightDecimal: 0.15,
    description: "Kemampuan memainkan alat musik sesuai perannya, ketepatan teknik, penguasaan instrumen, kejelasan, dan kesesuaian dengan aransemen.",
  },
  {
    key: "kekompakan",
    label: "Kekompakan Band",
    weight: 10,
    weightDecimal: 0.10,
    description: "Kerja sama antarpersonel band, keselarasan permainan, koordinasi, ketepatan perpindahan bagian lagu, serta menjaga tempo & dinamika bersama.",
  },
  {
    key: "audio",
    label: "Teknis Audio",
    weight: 10,
    weightDecimal: 0.10,
    description: "Kualitas audio dalam video penampilan, kejernihan suara, keseimbangan volume vokal dan instrumen, minim gangguan suara.",
  },
  {
    key: "penampilan",
    label: "Performance dan Visual",
    weight: 10,
    weightDecimal: 0.10,
    description: "Penguasaan panggung, ekspresi, penghayatan lagu, serta penyampaian karakter & suasana lagu melalui penampilan visual.",
  },
];

export interface VocalCriteriaConfig {
  key: "intonasi" | "teknik" | "penghayatan" | "artikulasi" | "penampilan" | "kreativitas";
  label: string;
  weight: number;
  weightDecimal: number;
  description: string;
}

export const VOCAL_CRITERIA: VocalCriteriaConfig[] = [
  {
    key: "intonasi",
    label: "Ketepatan Nada & Intonasi",
    weight: 30,
    weightDecimal: 0.30,
    description: "Kemampuan menyanyikan nada secara tepat sesuai melodi lagu, menjaga kestabilan intonasi, serta meminimalkan kesalahan nada.",
  },
  {
    key: "teknik",
    label: "Teknik Vokal & Pernapasan",
    weight: 25,
    weightDecimal: 0.25,
    description: "Pengaturan pernapasan, pengendalian suara, artikulasi nada, penggunaan resonansi, serta kestabilan suara awal hingga akhir lagu.",
  },
  {
    key: "penghayatan",
    label: "Penghayatan & Ekspresi",
    weight: 20,
    weightDecimal: 0.20,
    description: "Kemampuan memahami dan menyampaikan makna lagu melalui penghayatan, penjiwaan, serta ekspresi yang sesuai dengan suasana lagu.",
  },
  {
    key: "artikulasi",
    label: "Artikulasi & Pelafalan",
    weight: 10,
    weightDecimal: 0.10,
    description: "Kejelasan pengucapan lirik, ketepatan pelafalan kata, serta kemampuan menyampaikan lirik agar mudah dipahami pendengar.",
  },
  {
    key: "penampilan",
    label: "Penampilan & Panggung",
    weight: 10,
    weightDecimal: 0.10,
    description: "Kepercayaan diri, sikap, bahasa tubuh, kontak mata, serta penampilan yang menarik dan sesuai dengan karakter lagu.",
  },
  {
    key: "kreativitas",
    label: "Kreativitas & Interpretasi",
    weight: 5,
    weightDecimal: 0.05,
    description: "Memberikan interpretasi khas pada lagu, variasi dinamika, improvisasi yang sesuai, tanpa menghilangkan karakter aslinya.",
  },
];

export function calculateBandScores(values: {
  musikalitas?: number | string;
  aransemen?: number | string;
  vokal?: number | string;
  instrumen?: number | string;
  kekompakan?: number | string;
  audio?: number | string;
  penampilan?: number | string;
}) {
  const m = Number(values.musikalitas) || 0;
  const a = Number(values.aransemen) || 0;
  const v = Number(values.vokal) || 0;
  const i = Number(values.instrumen) || 0;
  const k = Number(values.kekompakan) || 0;
  const au = Number(values.audio) || 0;
  const p = Number(values.penampilan) || 0;

  const rawTotal = m + a + v + i + k + au + p;
  const weightedTotal = Number(
    (
      m * 0.20 +
      a * 0.20 +
      v * 0.15 +
      i * 0.15 +
      k * 0.10 +
      au * 0.10 +
      p * 0.10
    ).toFixed(2)
  );

  return { rawTotal, weightedTotal };
}

export function calculateVocalScores(values: {
  intonasi?: number | string;
  teknik?: number | string;
  penghayatan?: number | string;
  artikulasi?: number | string;
  penampilan?: number | string;
  kreativitas?: number | string;
}) {
  const intonasi = Number(values.intonasi) || 0;
  const teknik = Number(values.teknik) || 0;
  const penghayatan = Number(values.penghayatan) || 0;
  const artikulasi = Number(values.artikulasi) || 0;
  const penampilan = Number(values.penampilan) || 0;
  const kreativitas = Number(values.kreativitas) || 0;

  const rawTotal = intonasi + teknik + penghayatan + artikulasi + penampilan + kreativitas;
  const weightedTotal = Number(
    (
      intonasi * 0.30 +
      teknik * 0.25 +
      penghayatan * 0.20 +
      artikulasi * 0.10 +
      penampilan * 0.10 +
      kreativitas * 0.05
    ).toFixed(2)
  );

  return { rawTotal, weightedTotal };
}
