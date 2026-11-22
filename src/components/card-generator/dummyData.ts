import { Participant } from "./types";

// DATA RESMI LOMBA BAND (Hanya yang mengirimkan video - 33 Band)
// Tidak mengirim video: No 1, 8, 9, 22, 25, 33, 39
export const OFFICIAL_BANDS_WITH_VIDEO = [
  { no: 2, nama: "SANKARA BAND" },
  { no: 3, nama: "Late Night Necromancy" },
  { no: 4, nama: "RHYTHMORA JIVANA" },
  { no: 5, nama: "GemaSwara77" },
  { no: 6, nama: "FivePm" },
  { no: 7, nama: "Wise Monkey" },
  { no: 10, nama: "RESTORASI MUSIC" },
  { no: 11, nama: "Pemahat Batu Mulia (PBM)" },
  { no: 12, nama: "BEAR BAND" },
  { no: 13, nama: "BENZO" },
  { no: 14, nama: "FIVE SOULS" },
  { no: 15, nama: "BAND SENGKANAUNG" },
  { no: 16, nama: "SHOSHA X" },
  { no: 17, nama: "MAHASUSVARA NESA" },
  { no: 18, nama: "RAHVANA BAND" },
  { no: 19, nama: "SPARKLE FIVE" },
  { no: 20, nama: "SOEDARSO BAND" },
  { no: 21, nama: "BAND SEVENOVA" },
  { no: 23, nama: "Fattar Davino" },
  { no: 24, nama: "Molecool" },
  { no: 26, nama: "THE CHARACTER ROCK" },
  { no: 27, nama: "ARCTIC BAND" },
  { no: 28, nama: "DK481" },
  { no: 29, nama: "UKM Rumah Seni FK UNAND" },
  { no: 30, nama: "LINJING" },
  { no: 31, nama: "Weda 19" },
  { no: 32, nama: "ASKARASA BAND" },
  { no: 34, nama: "Dimas Sastra" },
  { no: 35, nama: "CONCORDIA" },
  { no: 36, nama: "UKM BAND UNMUL" },
  { no: 37, nama: "THE SANDALS" },
  { no: 38, nama: "PLASTER BAND" },
  { no: 40, nama: "SOUND OF BLUE" },
];

// DATA RESMI LOMBA VOKAL SOLO (Hanya yang mengirimkan video - 45 Peserta)
// Tidak mengirim video: No 7, 26, 48
export const OFFICIAL_VOCALS_WITH_VIDEO = [
  { no: 1, nama: "Putu Dinda Filia Kencana" },
  { no: 2, nama: "NI PUTU CELSIANI" },
  { no: 3, nama: "Amandya Oka" },
  { no: 4, nama: "Putu Sofia Chandra Kirana" },
  { no: 5, nama: "Hani" },
  { no: 6, nama: "Neora Chazaya Haleema Variz" },
  { no: 8, nama: "Ni Made Adelia Pratiwi" },
  { no: 9, nama: "Ceicilia Semarchis Adelwise Deu" },
  { no: 10, nama: "Kadek Cleren Valentina Devanto" },
  { no: 11, nama: "Ni Made Frida Suchisma" },
  { no: 12, nama: "I DEWA AYU SIPTA RUPA RENANTA" },
  { no: 13, nama: "Ida Ayu Athalia Putri Amanda Iswara" },
  { no: 14, nama: "KADEK RENA VERAYANI" },
  { no: 15, nama: "Nandini Kumala Dewantari" },
  { no: 16, nama: "Ni Ketut Juli Arita Dewi" },
  { no: 17, nama: "Kadek Wahyudhi Artha" },
  { no: 18, nama: "Kadek Ajun Puspita Dewi" },
  { no: 19, nama: "Gusti Ayu Putu Eka Suryantini" },
  { no: 20, nama: "Elisabet Muniarti" },
  { no: 21, nama: "Ni Putu Puji Sarini" },
  { no: 22, nama: "Putu Epi Yunita Dewi" },
  { no: 23, nama: "Hasfwany Khuspa Dinata" },
  { no: 24, nama: "DEBORA GRACE ULI SUDIBYO" },
  { no: 25, nama: "Harmonie Eleanor Victoria Siregar" },
  { no: 27, nama: "Pratiwi Puspita Sari" },
  { no: 28, nama: "Izzatunnada anjani" },
  { no: 29, nama: "ALDIAN SATRIA NUR SASONGKO" },
  { no: 30, nama: "Kadek Nuraeni" },
  { no: 31, nama: "NI KADEK JUNI PUSPITA DEWI" },
  { no: 32, nama: "Evalyne Princessa" },
  { no: 33, nama: "Made Devika" },
  { no: 34, nama: "ADHISA HAYYU WARDHANI" },
  { no: 35, nama: "Aril Hidayat" },
  { no: 36, nama: "Istiqomah" },
  { no: 37, nama: "Ni Kadek Citra Lestari" },
  { no: 38, nama: "Ni Luh Tania Paramita" },
  { no: 39, nama: "I Gede Edy Artawan" },
  { no: 40, nama: "Ni Luh Putu Queenida Pramusti" },
  { no: 41, nama: "I Gusti Ayu Reva Avantika" },
  { no: 42, nama: "Ni Putu Windie Fredella Anggarani" },
  { no: 43, nama: "Ni Kadek Wienda Adelia Dwiswari" },
  { no: 44, nama: "Medina" },
  { no: 45, nama: "Miltiadens Tamu Ambu" },
  { no: 46, nama: "Luh Sangayun Dewi" },
  { no: 47, nama: "Faskho Orlando Shoya" },
];

function generateSvgPlaceholder(name: string, no: number, category: "band" | "vocal", bgHue: number): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "♫";

  const padNo = no.toString().padStart(2, "0");
  const label = category === "band" ? "BAND" : "VOKAL SOLO";

  const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${bgHue},70%,25%)"/>
      <stop offset="100%" stop-color="hsl(${(bgHue + 40) % 360},80%,15%)"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <circle cx="300" cy="170" r="75" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
  <text x="300" y="195" font-family="Arial,sans-serif" font-size="65" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
  <text x="300" y="310" font-family="Arial,sans-serif" font-size="28" font-weight="600" fill="rgba(255,255,255,0.85)" text-anchor="middle">${name}</text>
  <text x="300" y="345" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,200,50,0.9)" text-anchor="middle">#${padNo} • ${label}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgRaw)}`;
}

// Menghasilkan daftar peserta resmi yang telah tervalidasi mengumpulkan video
export function getOfficialParticipants(category: "band" | "vocal" = "band"): Participant[] {
  const list = category === "band" ? OFFICIAL_BANDS_WITH_VIDEO : OFFICIAL_VOCALS_WITH_VIDEO;

  return list.map((item, idx) => {
    const bgHue = (idx * 31) % 360;
    return {
      id: `official-${category}-${item.no}`,
      no_urut: item.no,
      nama: item.nama,
      foto_url: generateSvgPlaceholder(item.nama, item.no, category, bgHue),
      kategori: category,
    };
  });
}

// Backward compatibility alias
export function generateDummyParticipants(count = 99, category: "band" | "vocal" = "band"): Participant[] {
  return getOfficialParticipants(category);
}
