export interface Participant {
  id: string;
  no_urut: string | number;
  nama: string;
  foto_url?: string;
  foto_blob?: string; // Data URL or object URL for locally uploaded image
  kategori?: "band" | "vocal" | string;
}

export interface PhotoLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  shape: "rounded" | "rectangle" | "circle";
  objectFit: "cover" | "contain";
  behindTemplate: boolean; // Render behind template frame window
}

export interface TextLayout {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  glowColor: string;
  glowBlur: number;
  align: "center" | "left" | "right";
  uppercase: boolean;
  maxWidth: number;
  fontFamily: string;
}

export interface NumberLayout {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  glowColor: string;
  glowBlur: number;
  align: "center" | "left" | "right";
  padZeros: 0 | 2 | 3; // 0 = as-is, 2 = 01..99, 3 = 001..099
  fontFamily: string;
}

export interface CardLayoutConfig {
  id: string;
  name: string;
  templateType: "band" | "vocal" | "custom";
  templateUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  photo: PhotoLayout;
  nameText: TextLayout;
  numberText: NumberLayout;
}

// Preset untuk Lomba Band
export const PRESET_BAND: CardLayoutConfig = {
  id: "preset-band",
  name: "Lomba Band (Default Canva)",
  templateType: "band",
  templateUrl: "/templates/card-generator/template_band.png",
  canvasWidth: 768,
  canvasHeight: 1024,
  photo: {
    x: 93,
    y: 312,
    width: 582,
    height: 319,
    borderRadius: 28,
    shape: "rounded",
    objectFit: "cover",
    behindTemplate: true,
  },
  nameText: {
    x: 384,
    y: 770,
    fontSize: 52,
    color: "#FFFFFF",
    glowColor: "#ff7700",
    glowBlur: 14,
    align: "center",
    uppercase: true,
    maxWidth: 550,
    fontFamily: "Anton",
  },
  numberText: {
    x: 384,
    y: 900,
    fontSize: 110,
    color: "#FFFFFF",
    glowColor: "#ff7700",
    glowBlur: 22,
    align: "center",
    padZeros: 2,
    fontFamily: "Anton",
  },
};

// Preset untuk Lomba Vokal Solo
export const PRESET_VOCAL: CardLayoutConfig = {
  id: "preset-vocal",
  name: "Lomba Vokal Solo (Default Canva)",
  templateType: "vocal",
  templateUrl: "/templates/card-generator/template_vocal.png",
  canvasWidth: 768,
  canvasHeight: 1024,
  photo: {
    x: 93,
    y: 312,
    width: 582,
    height: 319,
    borderRadius: 28,
    shape: "rounded",
    objectFit: "cover",
    behindTemplate: true,
  },
  nameText: {
    x: 384,
    y: 770,
    fontSize: 52,
    color: "#FFFFFF",
    glowColor: "#ff7700",
    glowBlur: 14,
    align: "center",
    uppercase: true,
    maxWidth: 550,
    fontFamily: "Anton",
  },
  numberText: {
    x: 384,
    y: 900,
    fontSize: 110,
    color: "#FFFFFF",
    glowColor: "#ff7700",
    glowBlur: 22,
    align: "center",
    padZeros: 2,
    fontFamily: "Anton",
  },
};
