"use client";

import React, { useRef } from "react";
import { CardLayoutConfig, Participant, PRESET_BAND, PRESET_VOCAL } from "./types";
import { 
  RotateCcw, 
  Download, 
  Upload, 
  Layers, 
  Image as ImageIcon, 
  Type, 
  Hash, 
  Sparkles,
  Music,
  Mic2
} from "lucide-react";

interface Props {
  config: CardLayoutConfig;
  onChangeConfig: (newConfig: CardLayoutConfig) => void;
  onSelectPreset: (preset: CardLayoutConfig) => void;
  activeParticipant?: Participant | null;
  onUploadPhotoForActive?: (file: File) => void;
}

export default function LayoutEditor({ 
  config, 
  onChangeConfig, 
  onSelectPreset,
  activeParticipant,
  onUploadPhotoForActive
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonImportRef = useRef<HTMLInputElement | null>(null);

  // Handle custom template upload
  const handleCustomTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onChangeConfig({
        ...config,
        id: "custom-" + Date.now(),
        name: `Custom (${file.name})`,
        templateType: "custom",
        templateUrl: url,
        canvasWidth: img.naturalWidth || 768,
        canvasHeight: img.naturalHeight || 1024,
      });
    };
    img.src = url;
  };

  // Export config as JSON
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `config_kartu_${config.templateType}.json`;
    a.click();
  };

  // Import config from JSON
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.photo && parsed.nameText && parsed.numberText) {
          onChangeConfig(parsed);
          alert("Konfigurasi layout berhasil diimpor!");
        } else {
          alert("Format file konfigurasi tidak valid.");
        }
      } catch (err) {
        alert("Gagal membaca file JSON: " + String(err));
      }
    };
    reader.readAsText(file);
  };

  const updatePhoto = (key: keyof CardLayoutConfig["photo"], val: any) => {
    onChangeConfig({
      ...config,
      photo: { ...config.photo, [key]: val },
    });
  };

  const updateName = (key: keyof CardLayoutConfig["nameText"], val: any) => {
    onChangeConfig({
      ...config,
      nameText: { ...config.nameText, [key]: val },
    });
  };

  const updateNumber = (key: keyof CardLayoutConfig["numberText"], val: any) => {
    onChangeConfig({
      ...config,
      numberText: { ...config.numberText, [key]: val },
    });
  };

  return (
    <div className="space-y-6 text-sm text-foreground">
      {/* 1. Pemilihan Template Background */}
      <div className="p-4 bg-background/60 rounded-2xl border border-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ukmred flex items-center gap-1.5">
            <Layers size={14} /> Template Background Canva
          </label>
          <span className="text-xs text-foreground/50">{config.canvasWidth} × {config.canvasHeight} px</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Preset Band */}
          <button
            type="button"
            onClick={() => onSelectPreset(PRESET_BAND)}
            className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
              config.templateType === "band"
                ? "bg-ukmred/15 border-ukmred text-foreground shadow-sm"
                : "bg-card border-border hover:border-foreground/30 text-foreground/70"
            }`}
          >
            <div className={`p-2 rounded-lg ${config.templateType === "band" ? "bg-ukmred text-white" : "bg-border text-foreground/60"}`}>
              <Music size={18} />
            </div>
            <div>
              <div className="font-bold text-xs">Lomba Band</div>
              <div className="text-[10px] text-foreground/50">Template Resmi Band</div>
            </div>
          </button>

          {/* Preset Vokal Solo */}
          <button
            type="button"
            onClick={() => onSelectPreset(PRESET_VOCAL)}
            className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
              config.templateType === "vocal"
                ? "bg-ukmred/15 border-ukmred text-foreground shadow-sm"
                : "bg-card border-border hover:border-foreground/30 text-foreground/70"
            }`}
          >
            <div className={`p-2 rounded-lg ${config.templateType === "vocal" ? "bg-ukmred text-white" : "bg-border text-foreground/60"}`}>
              <Mic2 size={18} />
            </div>
            <div>
              <div className="font-bold text-xs">Lomba Vokal Solo</div>
              <div className="text-[10px] text-foreground/50">Template Resmi Vokal</div>
            </div>
          </button>
        </div>

        {/* Custom Template Upload */}
        <div className="pt-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomTemplateUpload}
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-xl bg-card hover:bg-card/80 border border-dashed border-border hover:border-ukmred/60 text-xs font-semibold text-foreground/70 hover:text-foreground flex items-center justify-center gap-2 transition-all"
          >
            <Upload size={14} /> Upload Template Custom (PNG/JPG Canva)
          </button>
        </div>
      </div>

      {/* 2. Pengaturan Foto Peserta */}
      <div className="p-4 bg-background/60 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ukmred flex items-center gap-1.5">
            <ImageIcon size={14} /> 1. Posisi &amp; Ukuran Foto
          </label>
          <span className="text-[11px] text-foreground/40 font-mono">
            {config.photo.width} × {config.photo.height}
          </span>
        </div>

        {/* Quick upload photo for currently viewed participant */}
        {activeParticipant && (
          <div className="p-3 bg-card rounded-xl border border-border flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center">
                {activeParticipant.foto_blob || activeParticipant.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={activeParticipant.foto_blob || activeParticipant.foto_url} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <ImageIcon size={16} className="text-foreground/40" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate text-foreground">
                  {activeParticipant.nama}
                </div>
                <div className="text-[10px] text-foreground/50">
                  {activeParticipant.foto_blob || activeParticipant.foto_url ? "Foto Terpasang" : "Belum Ada Foto"}
                </div>
              </div>
            </div>

            <label className="px-3 py-1.5 bg-ukmred hover:bg-ukmred-dark text-white rounded-lg text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 transition-all shadow-sm shadow-ukmred/30">
              <Upload size={13} />
              Ganti Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadPhotoForActive) onUploadPhotoForActive(file);
                }}
              />
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi X (Horizontal)</label>
            <input
              type="number"
              value={config.photo.x}
              onChange={(e) => updatePhoto("x", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi Y (Vertikal)</label>
            <input
              type="number"
              value={config.photo.y}
              onChange={(e) => updatePhoto("y", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Lebar (Width)</label>
            <input
              type="number"
              value={config.photo.width}
              onChange={(e) => updatePhoto("width", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Tinggi (Height)</label>
            <input
              type="number"
              value={config.photo.height}
              onChange={(e) => updatePhoto("height", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Sudut Melengkung (Radius)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.photo.borderRadius}
              onChange={(e) => updatePhoto("borderRadius", Number(e.target.value))}
              className="w-full accent-ukmred"
            />
            <div className="text-[10px] text-foreground/50 text-right">{config.photo.borderRadius}px</div>
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Bentuk Clipping</label>
            <select
              value={config.photo.shape}
              onChange={(e) => updatePhoto("shape", e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="rounded">Rounded Rectangle</option>
              <option value="rectangle">Persegi Tegak</option>
              <option value="circle">Lingkaran</option>
            </select>
          </div>
        </div>

        {/* Layer Order */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-xs text-foreground/70">Render di Balik Jendela Template</span>
          <input
            type="checkbox"
            checked={config.photo.behindTemplate}
            onChange={(e) => updatePhoto("behindTemplate", e.target.checked)}
            className="w-4 h-4 accent-ukmred rounded"
          />
        </div>
      </div>

      {/* 3. Pengaturan Nama Peserta */}
      <div className="p-4 bg-background/60 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ukmred flex items-center gap-1.5">
            <Type size={14} /> 2. Tipografi Nama Peserta (Font Anton)
          </label>
          <span className="text-[11px] text-foreground/40 font-mono font-anton">
            Size: {config.nameText.fontSize}px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi X (Center)</label>
            <input
              type="number"
              value={config.nameText.x}
              onChange={(e) => updateName("x", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi Y (Center)</label>
            <input
              type="number"
              value={config.nameText.y}
              onChange={(e) => updateName("y", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Ukuran Font</label>
            <input
              type="number"
              value={config.nameText.fontSize}
              onChange={(e) => updateName("fontSize", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Batas Maksimal Lebar</label>
            <input
              type="number"
              value={config.nameText.maxWidth}
              onChange={(e) => updateName("maxWidth", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Warna Teks</label>
            <input
              type="color"
              value={config.nameText.color}
              onChange={(e) => updateName("color", e.target.value)}
              className="w-full h-8 bg-card border border-border rounded-lg p-0.5 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Warna Glow</label>
            <input
              type="color"
              value={config.nameText.glowColor}
              onChange={(e) => updateName("glowColor", e.target.value)}
              className="w-full h-8 bg-card border border-border rounded-lg p-0.5 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Intensitas Glow</label>
            <input
              type="range"
              min="0"
              max="40"
              value={config.nameText.glowBlur}
              onChange={(e) => updateName("glowBlur", Number(e.target.value))}
              className="w-full accent-ukmred mt-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-xs text-foreground/70">Otomatis Huruf Besar (UPPERCASE)</span>
          <input
            type="checkbox"
            checked={config.nameText.uppercase}
            onChange={(e) => updateName("uppercase", e.target.checked)}
            className="w-4 h-4 accent-ukmred rounded"
          />
        </div>
      </div>

      {/* 4. Pengaturan Nomor Urut */}
      <div className="p-4 bg-background/60 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ukmred flex items-center gap-1.5">
            <Hash size={14} /> 3. Tipografi Nomor Urut (Font Anton)
          </label>
          <span className="text-[11px] text-foreground/40 font-mono font-anton">
            Size: {config.numberText.fontSize}px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi X (Center)</label>
            <input
              type="number"
              value={config.numberText.x}
              onChange={(e) => updateNumber("x", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Posisi Y (Center)</label>
            <input
              type="number"
              value={config.numberText.y}
              onChange={(e) => updateNumber("y", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Ukuran Font Nomor</label>
            <input
              type="number"
              value={config.numberText.fontSize}
              onChange={(e) => updateNumber("fontSize", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Format Digit Nomor</label>
            <select
              value={config.numberText.padZeros}
              onChange={(e) => updateNumber("padZeros", Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-xs"
            >
              <option value={2}>2 Digit (01, 02.. 99)</option>
              <option value={3}>3 Digit (001.. 099)</option>
              <option value={0}>Sesuai Input Asli</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Warna Nomor</label>
            <input
              type="color"
              value={config.numberText.color}
              onChange={(e) => updateNumber("color", e.target.value)}
              className="w-full h-8 bg-card border border-border rounded-lg p-0.5 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Warna Glow</label>
            <input
              type="color"
              value={config.numberText.glowColor}
              onChange={(e) => updateNumber("glowColor", e.target.value)}
              className="w-full h-8 bg-card border border-border rounded-lg p-0.5 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Intensitas Glow</label>
            <input
              type="range"
              min="0"
              max="50"
              value={config.numberText.glowBlur}
              onChange={(e) => updateNumber("glowBlur", Number(e.target.value))}
              className="w-full accent-ukmred mt-2"
            />
          </div>
        </div>
      </div>

      {/* 5. Preset & Configuration Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSelectPreset(config.templateType === "vocal" ? PRESET_VOCAL : PRESET_BAND)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-card/80 border border-border text-xs text-foreground/80 transition-colors"
        >
          <RotateCcw size={14} /> Reset ke Presisi Canva
        </button>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={jsonImportRef}
            onChange={handleImportConfig}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => jsonImportRef.current?.click()}
            className="p-1.5 rounded-xl bg-card hover:bg-card/80 border border-border text-xs text-foreground/70 hover:text-foreground transition-colors"
            title="Import Config JSON"
          >
            <Upload size={14} />
          </button>
          <button
            type="button"
            onClick={handleExportConfig}
            className="p-1.5 rounded-xl bg-card hover:bg-card/80 border border-border text-xs text-foreground/70 hover:text-foreground transition-colors"
            title="Export Config JSON"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
