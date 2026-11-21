import JSZip from "jszip";
import { Participant, CardLayoutConfig } from "./types";

// In-memory image cache to avoid refetching during batch render
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    // Only set crossOrigin for external http/https URLs to prevent CORS errors on data: or blob:
    if (!src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => {
      // Don't fail completely if a single photo fails to load
      console.warn(`Gagal memuat gambar: ${src}`, err);
      reject(err);
    };
    img.src = src;
  });
}

// Pre-load font to guarantee canvas rendering with exact font
export async function ensureFontLoaded(fontFamily = "Anton"): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;

  try {
    await Promise.all([
      document.fonts.load(`48px "${fontFamily}"`),
      document.fonts.load(`100px "${fontFamily}"`),
      document.fonts.ready,
    ]);
  } catch (err) {
    console.warn(`Font "${fontFamily}" loading check warning:`, err);
  }
}

export function formatParticipantNumber(no: string | number, padZeros: 0 | 2 | 3): string {
  const str = String(no).trim();
  const num = parseInt(str.replace(/\D/g, ""), 10);

  if (isNaN(num)) return str;

  if (padZeros === 2) {
    return num.toString().padStart(2, "0");
  } else if (padZeros === 3) {
    return num.toString().padStart(3, "0");
  }
  return str;
}

// Draw object-cover image into destination rect
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgRatio = imgW / imgH;
  const destRatio = dw / dh;

  let sx = 0,
    sy = 0,
    sw = imgW,
    sh = imgH;

  if (imgRatio > destRatio) {
    // Image is wider: crop horizontal sides
    sw = imgH * destRatio;
    sx = (imgW - sw) / 2;
  } else {
    // Image is taller: crop top/bottom
    sh = imgW / destRatio;
    sy = (imgH - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

// Generate fallback placeholder for participant without photo
function drawPlaceholderPhoto(
  ctx: CanvasRenderingContext2D,
  participant: Participant,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  ctx.save();
  // Dark gradient background
  const grad = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
  grad.addColorStop(0, "#2a1515");
  grad.addColorStop(1, "#120808");
  ctx.fillStyle = grad;
  ctx.fillRect(dx, dy, dw, dh);

  // Initials
  const initials = participant.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(dx + dw / 2, dy + dh / 2 - 20, Math.min(dw, dh) * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(Math.min(dw, dh) * 0.22)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials || "♫", dx + dw / 2, dy + dh / 2 - 18);

  ctx.restore();
}

/**
 * Main function: Renders a single participant card onto a canvas context
 */
export async function renderCard(
  ctx: CanvasRenderingContext2D,
  participant: Participant,
  config: CardLayoutConfig,
  scale = 1
): Promise<void> {
  const { canvasWidth, canvasHeight, photo, nameText, numberText, templateUrl } = config;

  ctx.save();
  ctx.scale(scale, scale);

  // 1. Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Pre-fetch template image
  let templateImg: HTMLImageElement | null = null;
  if (templateUrl) {
    try {
      templateImg = await getCachedImage(templateUrl);
    } catch {
      console.warn("Template image load failed:", templateUrl);
    }
  }

  // Pre-fetch participant photo
  let photoImg: HTMLImageElement | null = null;
  const photoSrc = participant.foto_blob || participant.foto_url;
  if (photoSrc) {
    try {
      photoImg = await getCachedImage(photoSrc);
    } catch {
      // Photo failed to load; will use placeholder
    }
  }

  // Helper to clip photo frame
  const applyPhotoClip = () => {
    ctx.beginPath();
    const { x, y, width, height, borderRadius, shape } = photo;

    if (shape === "circle") {
      const radius = Math.min(width, height) / 2;
      ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
    } else if (shape === "rounded" && borderRadius > 0) {
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, borderRadius);
      } else {
        // Fallback for older browsers
        ctx.rect(x, y, width, height);
      }
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.closePath();
    ctx.clip();
  };

  const drawPhotoContent = () => {
    ctx.save();
    applyPhotoClip();

    if (photoImg) {
      if (photo.objectFit === "cover") {
        drawImageCover(ctx, photoImg, photo.x, photo.y, photo.width, photo.height);
      } else {
        ctx.drawImage(photoImg, photo.x, photo.y, photo.width, photo.height);
      }
    } else {
      drawPlaceholderPhoto(ctx, participant, photo.x, photo.y, photo.width, photo.height);
    }
    ctx.restore();
  };

  // 2. Draw Photo & Template (order depends on behindTemplate)
  if (photo.behindTemplate) {
    // Photo behind template window
    drawPhotoContent();
    if (templateImg) {
      ctx.drawImage(templateImg, 0, 0, canvasWidth, canvasHeight);
    }
  } else {
    // Template first, then photo on top
    if (templateImg) {
      ctx.drawImage(templateImg, 0, 0, canvasWidth, canvasHeight);
    }
    drawPhotoContent();
  }

  // 3. Ensure Anton Font is ready
  await ensureFontLoaded(nameText.fontFamily || "Anton");

  // 4. Render Name
  const rawName = nameText.uppercase ? participant.nama.toUpperCase() : participant.nama;
  const fontFamily = nameText.fontFamily || "Anton";

  ctx.save();
  ctx.textAlign = nameText.align || "center";
  ctx.textBaseline = "middle";

  // Auto-shrink font if text is wider than maxWidth
  let currentFontSize = nameText.fontSize;
  ctx.font = `${currentFontSize}px "${fontFamily}", Impact, sans-serif`;
  let measuredWidth = ctx.measureText(rawName).width;

  while (measuredWidth > nameText.maxWidth && currentFontSize > 18) {
    currentFontSize -= 2;
    ctx.font = `${currentFontSize}px "${fontFamily}", Impact, sans-serif`;
    measuredWidth = ctx.measureText(rawName).width;
  }

  // Draw glow shadow
  if (nameText.glowBlur > 0) {
    ctx.shadowColor = nameText.glowColor || "#ff7700";
    ctx.shadowBlur = nameText.glowBlur;
    ctx.fillStyle = nameText.color || "#FFFFFF";
    // Draw twice for vibrant neon glow
    ctx.fillText(rawName, nameText.x, nameText.y);
    ctx.fillText(rawName, nameText.x, nameText.y);
  }

  // Draw crisp foreground text
  ctx.shadowBlur = 0;
  ctx.fillStyle = nameText.color || "#FFFFFF";
  ctx.fillText(rawName, nameText.x, nameText.y);
  ctx.restore();

  // 5. Render Number (Nomor Urut)
  const numStr = formatParticipantNumber(participant.no_urut, numberText.padZeros);
  const numFontFamily = numberText.fontFamily || "Anton";

  ctx.save();
  ctx.textAlign = numberText.align || "center";
  ctx.textBaseline = "middle";
  ctx.font = `${numberText.fontSize}px "${numFontFamily}", Impact, sans-serif`;

  // Draw intense glow for number
  if (numberText.glowBlur > 0) {
    ctx.shadowColor = numberText.glowColor || "#ff7700";
    ctx.shadowBlur = numberText.glowBlur;
    ctx.fillStyle = numberText.color || "#FFFFFF";
    ctx.fillText(numStr, numberText.x, numberText.y);
    ctx.fillText(numStr, numberText.x, numberText.y);
  }

  // Crisp foreground
  ctx.shadowBlur = 0;
  ctx.fillStyle = numberText.color || "#FFFFFF";
  ctx.fillText(numStr, numberText.x, numberText.y);
  ctx.restore();

  ctx.restore();
}

/**
 * Render a participant card and return a PNG Blob
 */
export async function renderCardToBlob(
  participant: Participant,
  config: CardLayoutConfig,
  scale = 1
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(config.canvasWidth * scale);
  canvas.height = Math.round(config.canvasHeight * scale);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Gagal menginisialisasi 2D Canvas context");

  await renderCard(ctx, participant, config, scale);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Gagal membuat blob gambar dari canvas"));
    }, "image/png");
  });
}

/**
 * Batch render all participants and zip into a single .zip file
 */
export async function exportBatchToZip(
  participants: Participant[],
  config: CardLayoutConfig,
  options: {
    scale?: number;
    onProgress?: (current: number, total: number, participantName: string) => void;
  } = {}
): Promise<Blob> {
  const scale = options.scale || 1;
  const zip = new JSZip();
  const total = participants.length;

  // Pre-load font before batch
  await ensureFontLoaded(config.nameText.fontFamily || "Anton");

  // Reusable offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(config.canvasWidth * scale);
  canvas.height = Math.round(config.canvasHeight * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Gagal membuat Canvas untuk batch render");

  for (let i = 0; i < total; i++) {
    const p = participants[i];

    if (options.onProgress) {
      options.onProgress(i + 1, total, p.nama);
    }

    // Render to canvas
    await renderCard(ctx, p, config, scale);

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas blob error"))), "image/png");
    });

    // Clean file name: "001_Nama_Peserta.png"
    const padNum = formatParticipantNumber(p.no_urut, 3);
    const safeName = p.nama
      .replace(/[\\/:*?"<>|]/g, "_")
      .trim()
      .replace(/\s+/g, "_");
    const fileName = `${padNum}_${safeName}.png`;

    zip.file(fileName, blob);

    // Yield execution every 3 cards to keep browser UI responsive
    if (i % 3 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // Generate ZIP
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
