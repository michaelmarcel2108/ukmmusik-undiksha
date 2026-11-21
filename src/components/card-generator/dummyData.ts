import { Participant } from "./types";

const DUMMY_BAND_NAMES = [
  "Sankara Band", "Late Night Necromancy", "Rhythmora Jivana", "GemaSwara77", "FivePm",
  "Wise Monkey", "Pemahat Batu Mulia", "BearBand", "Benzo Band", "Five Souls",
  "Sengkanaung", "Shosha-X", "Mahasusvara Nesa", "Rahvana", "Sparkle Five",
  "Soedarso", "Sevenova Band", "Molecool Band", "The Character Rock", "Arctic Band",
  "DK481", "Rumah Seni UNAND", "Linjing", "Weda-19", "Askarsa Band",
  "Concordia", "UKM Band Unmul", "The Sandals", "Plaster Band", "Sound Of Blue",
  "Velvet Thunder", "Cosmic Drift", "Midnight Mirage", "Crimson Eclipse", "Neon Symphony",
  "Aura Resonance", "Echo Horizon", "Starlight Pulse", "Static Void", "Lunar Waves",
  "Solstice Flame", "Vanguard Pulse", "Vortex Theory", "Phantom Anthem", "Acoustic Mirage",
  "Iron Melody", "Astral Knights", "Sonic Reverie", "Rebel Frequency", "Titan Roar",
  "Cascade Horizon", "Serenade X", "Obsidian Core", "Apex Rhythm", "Hyperion Groove",
  "Solar Flare", "Eclipse Syndicate", "Oasis Dream", "Nova Protocol", "Zenith Wave",
  "Terra Nova", "Pulse Horizon", "Quantum Strings", "Symphony 9", "Dark Nebula",
  "Wildfire Groove", "Silver Lining", "Alpha Stage", "Omega Beat", "Horizon Echo",
  "Mirage Avenue", "Blaze Union", "Radiant Beat", "Vivid Resonance", "Thunder Sound",
  "Cosmo Knights", "Prism Wave", "Infinity Drive", "Stratos Beat", "Velvet Storm",
  "Aero Dynamic", "Mystic Harmony", "Neon Genesis", "Sonic Blast", "Eclipse Aura",
  "Crimson Wave", "Solar Anthem", "Titan Rhythm", "Midnight Pulse", "Hyper Beat",
  "Zenith Groove", "Oasis Beat", "Vanguard Rock", "Phantom Rhythm", "Static Sound",
  "Lunar Groove", "Nova Sound", "Echo Beat", "Final Symphony"
];

const DUMMY_VOCAL_NAMES = [
  "Putu Dinda Filia Kencana", "Ni Putu Celsiani", "Amandya Oka", "Putu Sofia Chandra Kirana", "Hani",
  "Neora Chazaya Haleema Variz", "Ni Made Adelia Pratiwi", "Ceicilia Semarchis Adelwise", "Kadek Cleren Valentina",
  "Ni Made Frida Suchisma", "I Dewa Ayu Sipta Rupa", "Ida Ayu Athalia Putri", "Kadek Rena Verayani",
  "Nandini Kumala Dewantari", "Ni Ketut Juli Arita Dewi", "Kadek Wahyudhi Artha", "Ajun Puspita",
  "Gusti Ayu Putu Eka Suryantini", "Elisabet Muniarti", "Ni Putu Puji Sarini", "Putu Epi Yunita Dewi",
  "Hasfwany Khuspa Dinata", "Debora Grace Uli Sudibyo", "Harmonie Eleanor Victoria", "Pratiwi Puspita Sari",
  "Izzatunnada Anjani", "Kadek Nuraeni", "Ni Kadek Juni Puspita", "Evalyne Princessa", "Adhisa Hayyu Wardhani",
  "Aril Hidayat", "Istiqomah", "Ni Kadek Citra Lestari", "Ni Luh Tania Paramita", "I Gede Edy Artawan",
  "Ni Luh Putu Queenida", "I Gusti Ayu Reva Avantika", "Ni Putu Windie Fredella", "Adelia", "Medina Munawwaroti Ahmad",
  "Miltiadens Tamu Ambu", "Luh Sangayun Dewi", "Faskho Orlando Shoya", "Budi Santoso", "Siti Aminah",
  "Rizky Ramadhan", "Dewi Lestari", "Agus Pratama", "Nadia Safitri", "Indra Kusuma",
  "Maya Anggraini", "Fajar Nugraha", "Aulia Rahma", "Dimas Setiawan", "Rina Marlina",
  "Eko Prasetyo", "Putri Wulandari", "Bayu Saputra", "Tiara Anugrah", "Yoga Pratama",
  "Larasati Dewi", "Aris Munandar", "Wulan Guritno", "Bambang Pamungkas", "Fitri Handayani",
  "Hendra Wijaya", "Gita Gutawa", "Doni Salman", "Sarah Sechan", "Kevin Julio",
  "Jessica Mila", "Reza Rahadian", "Maudy Ayunda", "Afgan Syahreza", "Isyana Sarasvati",
  "Tulus Rusydi", "Raisa Andriana", "Glenn Fredly", "Judika Sihotang", "Rossa Roslaina",
  "Lyodra Ginting", "Tiara Andini", "Ziva Magnolya", "Keisya Levronka", "Mahalini Raharja",
  "Feby Putri", "Nabila Taqiyyah", "Salma Salsabil", "Rony Parulian", "Nyoman Paul",
  "Anggi Marito", "Mark Natama", "Novia Bachmid", "Mirabeth Sonia", "Samuel Cipta",
  "Agseisa Galuh", "Ainun Irsani", "Richard Jeremy", "Olivia Pardede"
];

// Curated high quality avatars for participants
export function generateDummyParticipants(count = 99, category: "band" | "vocal" = "band"): Participant[] {
  const names = category === "band" ? DUMMY_BAND_NAMES : DUMMY_VOCAL_NAMES;
  
  return Array.from({ length: count }, (_, i) => {
    const no = i + 1;
    const name = names[i % names.length] || `Peserta ${no}`;
    
    // Aesthetic colored placeholder or music avatar
    const bgHue = (i * 27) % 360;
    const initials = name
      .split(" ")
      .slice(0, 2)
      .map(w => w[0])
      .join("")
      .toUpperCase();
      
    // Use properly URL-encoded SVG data URI placeholder for instant offline rendering without CORS or parsing errors
    const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${bgHue},70%,25%)"/><stop offset="100%" stop-color="hsl(${(bgHue + 40) % 360},80%,15%)"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="170" r="75" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4"/><text x="300" y="195" font-family="Arial,sans-serif" font-size="65" font-weight="bold" fill="white" text-anchor="middle">${initials}</text><text x="300" y="310" font-family="Arial,sans-serif" font-size="28" font-weight="600" fill="rgba(255,255,255,0.85)" text-anchor="middle">${name}</text><text x="300" y="345" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,200,50,0.9)" text-anchor="middle">#${no.toString().padStart(2, "0")} • ${category === "band" ? "BAND" : "VOKAL SOLO"}</text></svg>`;
    const svgAvatar = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgRaw)}`;

    return {
      id: `dummy-${category}-${no}`,
      no_urut: no,
      nama: name,
      foto_url: svgAvatar,
      kategori: category,
    };
  });
}
