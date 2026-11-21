"use client";

import React, { useEffect, useRef, useState } from "react";
import { Participant, CardLayoutConfig } from "./types";
import { renderCard, renderCardToBlob, formatParticipantNumber } from "./canvasRenderer";
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2, Image as ImageIcon } from "lucide-react";

interface Props {
  participant: Participant | null;
  config: CardLayoutConfig;
  allParticipants: Participant[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onUploadPhoto?: (file: File) => void;
}

export default function CardCanvasPreview({
  participant,
  config,
  allParticipants,
  currentIndex,
  onSelectIndex,
  onUploadPhoto,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(0.7); // 70% default preview fit
  const [isRendering, setIsRendering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Re-render canvas whenever participant, config, or zoom changes
  useEffect(() => {
    if (!canvasRef.current || !participant) return;

    let isCancelled = false;
    setIsRendering(true);

    const canvas = canvasRef.current;
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      renderCard(ctx, participant, config, 1)
        .catch((err) => console.error("Render preview error:", err))
        .finally(() => {
          if (!isCancelled) setIsRendering(false);
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [participant, config]);

  const handleDownloadSingle = async () => {
    if (!participant) return;
    setIsDownloading(true);
    try {
      const blob = await renderCardToBlob(participant, config, 2); // 2x resolution
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const padNum = formatParticipantNumber(participant.no_urut, 3);
      const safeName = participant.nama.replace(/\s+/g, "_");
      a.href = url;
      a.download = `${padNum}_${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh kartu: " + String(err));
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) onSelectIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < allParticipants.length - 1) onSelectIndex(currentIndex + 1);
  };

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md rounded-2xl border border-border overflow-hidden">
      {/* Top Bar Navigation & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-card/90">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-2 rounded-xl bg-background/80 hover:bg-background border border-border disabled:opacity-40 disabled:cursor-not-allowed text-foreground transition-all"
            title="Peserta Sebelumnya (Prev)"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Direct index switcher */}
          <div className="flex items-center gap-2">
            <select
              value={currentIndex}
              onChange={(e) => onSelectIndex(Number(e.target.value))}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:border-ukmred"
            >
              {allParticipants.map((p, idx) => (
                <option key={p.id || idx} value={idx}>
                  #{formatParticipantNumber(p.no_urut, 2)} - {p.nama}
                </option>
              ))}
            </select>
            <span className="text-xs text-foreground/50 font-medium">
              ({currentIndex + 1} dari {allParticipants.length})
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= allParticipants.length - 1}
            className="p-2 rounded-xl bg-background/80 hover:bg-background border border-border disabled:opacity-40 disabled:cursor-not-allowed text-foreground transition-all"
            title="Peserta Berikutnya (Next)"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Zoom Controls & Single Download */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-background/80 border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.35, z - 0.1))}
              className="p-1 hover:bg-card rounded-lg text-foreground/70 hover:text-foreground transition-colors"
              title="Perkecil"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-mono font-semibold px-1 text-foreground/80 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1 hover:bg-card rounded-lg text-foreground/70 hover:text-foreground transition-colors"
              title="Perbesar"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoom(0.68)}
              className="p-1 hover:bg-card rounded-lg text-foreground/70 hover:text-foreground transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Quick upload photo for current active card */}
          {participant && onUploadPhoto && (
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-background/90 hover:bg-background border border-border hover:border-ukmred/60 text-foreground/80 hover:text-foreground rounded-xl text-xs font-semibold cursor-pointer transition-all">
              <ImageIcon size={14} className="text-ukmred" />
              Ganti Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUploadPhoto(f);
                }}
              />
            </label>
          )}

          <button
            onClick={handleDownloadSingle}
            disabled={isDownloading || !participant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ukmred hover:bg-ukmred-dark text-white rounded-xl text-xs font-semibold shadow-lg shadow-ukmred/20 transition-all disabled:opacity-50"
          >
            <Download size={14} />
            {isDownloading ? "Mengekspor..." : "Unduh PNG"}
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace Container */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/40 min-h-[480px]">
        {participant ? (
          <div
            className="relative shadow-2xl rounded-2xl transition-transform duration-100 ease-out border border-white/10"
            style={{
              width: `${config.canvasWidth * zoom}px`,
              height: `${config.canvasHeight * zoom}px`,
            }}
          >
            {isRendering && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-xs rounded-2xl">
                <div className="w-8 h-8 border-3 border-ukmred border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-full block rounded-2xl"
              style={{
                width: `${config.canvasWidth * zoom}px`,
                height: `${config.canvasHeight * zoom}px`,
              }}
            />
          </div>
        ) : (
          <div className="text-center text-foreground/40 p-8">
            <p>Belum ada data peserta yang dipilih.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border bg-card/90 flex flex-wrap items-center justify-between text-xs text-foreground/60">
        <div className="flex items-center gap-3">
          <span>
            Kanvas: <strong className="text-foreground">{config.canvasWidth} × {config.canvasHeight} px</strong>
          </span>
          <span>•</span>
          <span>
            Template: <strong className="text-foreground">{config.name}</strong>
          </span>
          <span>•</span>
          <span>
            Font: <strong className="text-foreground font-anton">ANTON</strong>
          </span>
        </div>
        <div className="text-foreground/50">
          Peserta Aktif: <span className="text-ukmred font-bold font-anton text-sm">{participant?.nama || "-"}</span>
        </div>
      </div>
    </div>
  );
}
