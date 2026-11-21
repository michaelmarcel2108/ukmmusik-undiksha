"use client";

import React, { useState } from "react";
import { Participant, CardLayoutConfig } from "./types";
import { exportBatchToZip, renderCardToBlob, formatParticipantNumber } from "./canvasRenderer";
import { 
  Archive, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileCheck, 
  HardDriveDownload,
  AlertTriangle 
} from "lucide-react";

interface Props {
  participants: Participant[];
  config: CardLayoutConfig;
  activeParticipant: Participant | null;
}

export default function BatchExporter({ participants, config, activeParticipant }: Props) {
  const [scale, setScale] = useState<number>(1); // 1 = 768x1024, 2 = 1536x2048
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleStartBatchExport = async () => {
    if (participants.length === 0) {
      alert("Belum ada peserta untuk diekspor!");
      return;
    }

    setIsExporting(true);
    setIsFinished(false);
    setProgress({ current: 0, total: participants.length, name: "Memulai proses render..." });

    try {
      const zipBlob = await exportBatchToZip(participants, config, {
        scale,
        onProgress: (current, total, name) => {
          setProgress({ current, total, name });
        },
      });

      // Trigger browser download of ZIP
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `Kartu_Peserta_${config.templateType.toUpperCase()}_(${participants.length}_peserta)_${dateStr}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsFinished(true);
    } catch (err: any) {
      alert("Gagal melakukan batch render ZIP: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadActiveSingle = async () => {
    if (!activeParticipant) return;
    try {
      const blob = await renderCardToBlob(activeParticipant, config, scale);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const padNum = formatParticipantNumber(activeParticipant.no_urut, 3);
      const safeName = activeParticipant.nama.replace(/\s+/g, "_");
      a.href = url;
      a.download = `${padNum}_${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh kartu: " + String(err));
    }
  };

  const percent = progress && progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="space-y-6 text-sm text-foreground">
      {/* 1. Pengaturan Resolusi Render */}
      <div className="p-4 bg-background/60 rounded-2xl border border-border space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-ukmred block">
          Resolusi & Kualitas Gambar
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setScale(1)}
            disabled={isExporting}
            className={`p-3 rounded-xl border text-left transition-all ${
              scale === 1
                ? "bg-ukmred/15 border-ukmred text-foreground shadow-sm"
                : "bg-card border-border hover:border-foreground/30 text-foreground/70"
            }`}
          >
            <div className="font-bold text-xs flex items-center gap-1.5">
              Standar 1× (768 × 1024)
            </div>
            <div className="text-[10px] text-foreground/50 mt-0.5">
              Cepat & hemat memori, ideal untuk preview & web
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScale(2)}
            disabled={isExporting}
            className={`p-3 rounded-xl border text-left transition-all ${
              scale === 2
                ? "bg-ukmred/15 border-ukmred text-foreground shadow-sm"
                : "bg-card border-border hover:border-foreground/30 text-foreground/70"
            }`}
          >
            <div className="font-bold text-xs flex items-center gap-1.5 text-orange-400">
              <Sparkles size={13} /> Ultra HD 2× (1536 × 2048)
            </div>
            <div className="text-[10px] text-foreground/50 mt-0.5">
              Ketajaman tinggi, sangat ideal untuk cetak ID Card
            </div>
          </button>
        </div>
      </div>

      {/* 2. Informasi Batch & Penamaan File */}
      <div className="p-4 bg-card/60 rounded-2xl border border-border space-y-2 text-xs">
        <div className="font-semibold text-foreground/90 flex items-center gap-2">
          <FileCheck size={15} className="text-ukmred" />
          Format Penamaan Otomatis dalam ZIP:
        </div>
        <div className="font-mono text-[11px] bg-background/80 p-2.5 rounded-xl border border-border/80 text-foreground/70 space-y-1">
          <div>📁 Kartu_Peserta_{config.templateType.toUpperCase()}.zip</div>
          <div className="pl-4 text-foreground/60">├── 001_Sound_Of_Blue.png</div>
          <div className="pl-4 text-foreground/60">├── 002_Late_Night_Necromancy.png</div>
          <div className="pl-4 text-foreground/40">└── ... hingga 099_Nama_Peserta.png</div>
        </div>
      </div>

      {/* 3. Progress Bar & Status (Aktif saat proses berjalan) */}
      {isExporting && progress && (
        <div className="p-5 bg-card rounded-2xl border border-ukmred/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <Loader2 size={16} className="text-ukmred animate-spin" />
              Mengekspor {progress.current} dari {progress.total} Kartu...
            </span>
            <span className="font-mono font-bold text-ukmred text-sm">{percent}%</span>
          </div>

          {/* Bar */}
          <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border">
            <div
              className="bg-gradient-to-r from-ukmred to-orange-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="text-[11px] text-foreground/60 truncate">
            Sedang memproses: <span className="text-foreground font-semibold">{progress.name}</span>
          </div>
        </div>
      )}

      {/* 4. Notifikasi Selesai */}
      {isFinished && (
        <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/30 flex items-center gap-3 text-green-400 text-xs">
          <CheckCircle2 size={20} className="shrink-0" />
          <div>
            <div className="font-bold">Batch Export Berhasil!</div>
            <div>File ZIP berisi {participants.length} kartu peserta telah diunduh ke komputer Anda.</div>
          </div>
        </div>
      )}

      {/* 5. Tombol Eksekusi Utama */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleStartBatchExport}
          disabled={isExporting || participants.length === 0}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-ukmred via-red-600 to-orange-600 hover:from-ukmred-dark hover:to-orange-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-ukmred/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isExporting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sedang Membuat File ZIP ({percent}%)...
            </>
          ) : (
            <>
              <Archive size={18} />
              Generate & Unduh {participants.length} Kartu (.ZIP)
            </>
          )}
        </button>

        {/* Shortcut Download Single */}
        {activeParticipant && (
          <button
            type="button"
            onClick={handleDownloadActiveSingle}
            disabled={isExporting}
            className="w-full py-2.5 px-4 bg-card hover:bg-card/80 border border-border rounded-xl text-xs font-semibold text-foreground/75 hover:text-foreground flex items-center justify-center gap-2 transition-all"
          >
            <HardDriveDownload size={14} />
            Unduh Hanya Kartu #{formatParticipantNumber(activeParticipant.no_urut, 2)} ({activeParticipant.nama})
          </button>
        )}
      </div>

      {participants.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-amber-400/80 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <AlertTriangle size={15} className="shrink-0" />
          <span>Daftar peserta masih kosong. Silakan generate dummy data atau upload CSV pada tab &quot;Data Peserta&quot;.</span>
        </div>
      )}
    </div>
  );
}
