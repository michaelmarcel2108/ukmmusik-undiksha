"use client";

import React, { useState, useEffect } from "react";
import { 
  CardLayoutConfig, 
  Participant, 
  PRESET_BAND, 
  PRESET_VOCAL 
} from "./types";
import { generateDummyParticipants } from "./dummyData";
import CardCanvasPreview from "./CardCanvasPreview";
import LayoutEditor from "./LayoutEditor";
import ParticipantManager from "./ParticipantManager";
import BatchExporter from "./BatchExporter";
import { 
  Sliders, 
  Users, 
  Archive, 
  Sparkles, 
  Music, 
  Mic2, 
  Layers 
} from "lucide-react";

export default function CardGeneratorView({ defaultCategory = "band" }: { defaultCategory?: "band" | "vocal" }) {
  const [category, setCategory] = useState<"band" | "vocal">(defaultCategory);
  const [config, setConfig] = useState<CardLayoutConfig>(defaultCategory === "vocal" ? PRESET_VOCAL : PRESET_BAND);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"layout" | "participants" | "export">("layout");

  // Initialize with 99 dummy participants and load saved config from localStorage on mount
  useEffect(() => {
    // 1. Load participants
    const initialParticipants = generateDummyParticipants(99, category);
    setParticipants(initialParticipants);

    // 2. Load cached config if exists
    try {
      const saved = localStorage.getItem(`rgc_card_config_v2_${category}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.photo && parsed.nameText) {
          setConfig(parsed);
          return;
        }
      }
    } catch {
      // ignore localStorage errors
    }

    setConfig(category === "vocal" ? PRESET_VOCAL : PRESET_BAND);
  }, [category]);

  // Handle category switch
  const handleSwitchCategory = (cat: "band" | "vocal") => {
    setCategory(cat);
    const newPreset = cat === "vocal" ? PRESET_VOCAL : PRESET_BAND;
    setConfig(newPreset);
    const newParticipants = generateDummyParticipants(99, cat);
    setParticipants(newParticipants);
    setCurrentIndex(0);
  };

  // Handle config updates & persist to localStorage
  const handleConfigChange = (newConfig: CardLayoutConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(`rgc_card_config_v2_${category}`, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const activeParticipant = participants[currentIndex] || null;

  // Handle upload photo for current active participant
  const handleUploadPhotoForActive = (file: File) => {
    if (!activeParticipant) return;
    const url = URL.createObjectURL(file);
    const updated = [...participants];
    updated[currentIndex] = {
      ...updated[currentIndex],
      foto_blob: url,
    };
    setParticipants(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="p-6 bg-gradient-to-r from-card via-card/90 to-background rounded-3xl border border-border shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ukmred">
            <Sparkles size={15} />
            Sistem Otomasi ID Card &amp; Display Canva
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Generator Kartu Peserta RGC XVII
          </h1>
          <p className="text-xs md:text-sm text-foreground/60 mt-1 max-w-2xl">
            Otomatisasi pembuatan 99 kartu peserta lomba dengan background template Canva, tipografi font Anton, dan ekspor ZIP beresolusi tinggi.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex bg-background/80 p-1.5 rounded-2xl border border-border shadow-inner">
          <button
            type="button"
            onClick={() => handleSwitchCategory("band")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === "band"
                ? "bg-ukmred text-white shadow-lg shadow-ukmred/30"
                : "text-foreground/70 hover:text-foreground hover:bg-card"
            }`}
          >
            <Music size={15} />
            Lomba Band
          </button>
          <button
            type="button"
            onClick={() => handleSwitchCategory("vocal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === "vocal"
                ? "bg-ukmred text-white shadow-lg shadow-ukmred/30"
                : "text-foreground/70 hover:text-foreground hover:bg-card"
            }`}
          >
            <Mic2 size={15} />
            Lomba Vokal Solo
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Control Panel (5 cols on lg) */}
        <div className="lg:col-span-5 bg-card/60 backdrop-blur-md rounded-3xl border border-border overflow-hidden shadow-lg flex flex-col">
          {/* Tabs Navigation */}
          <div className="flex border-b border-border bg-card/90 p-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "layout"
                  ? "bg-ukmred text-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Sliders size={14} />
              Desain &amp; Presisi
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("participants")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "participants"
                  ? "bg-ukmred text-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Users size={14} />
              Data Peserta ({participants.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("export")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "export"
                  ? "bg-ukmred text-white shadow-sm"
                  : "text-foreground/60 hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Archive size={14} />
              Ekspor ZIP
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-5 max-h-[720px] overflow-y-auto">
            {activeTab === "layout" && (
              <LayoutEditor
                config={config}
                onChangeConfig={handleConfigChange}
                onSelectPreset={handleConfigChange}
                activeParticipant={activeParticipant}
                onUploadPhotoForActive={handleUploadPhotoForActive}
              />
            )}

            {activeTab === "participants" && (
              <ParticipantManager
                participants={participants}
                onChangeParticipants={setParticipants}
                currentIndex={currentIndex}
                onSelectIndex={setCurrentIndex}
                category={category}
              />
            )}

            {activeTab === "export" && (
              <BatchExporter
                participants={participants}
                config={config}
                activeParticipant={activeParticipant}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Canvas Preview (7 cols on lg) */}
        <div className="lg:col-span-7 sticky top-6">
          <CardCanvasPreview
            participant={activeParticipant}
            config={config}
            allParticipants={participants}
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
            onUploadPhoto={handleUploadPhotoForActive}
          />
        </div>
      </div>
    </div>
  );
}
