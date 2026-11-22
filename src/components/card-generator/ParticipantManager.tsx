"use client";

import React, { useRef, useState } from "react";
import { Participant } from "./types";
import { generateDummyParticipants, getOfficialParticipants } from "./dummyData";
import { formatParticipantNumber } from "./canvasRenderer";
import { createClient } from "@/utils/supabase/client";
import {
  Users,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Database,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Props {
  participants: Participant[];
  onChangeParticipants: (newList: Participant[]) => void;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  category: "band" | "vocal";
}

export default function ParticipantManager({
  participants,
  onChangeParticipants,
  currentIndex,
  onSelectIndex,
  category,
}: Props) {
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Participant>>({});
  const [isPullingDb, setIsPullingDb] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const batchPhotoRef = useRef<HTMLInputElement | null>(null);

  // 1. Muat Peserta Resmi yang Mengirim Video (Berdasarkan PDF & Database)
  const handleGenerate99 = () => {
    const list = getOfficialParticipants(category);
    onChangeParticipants(list);
    onSelectIndex(0);
    setStatusMsg({
      text: `Berhasil memuat ${list.length} data peserta resmi ${category === "band" ? "Lomba Band" : "Lomba Vokal Solo"} yang telah mengirim video!`,
      type: "success",
    });
  };

  // 2. Tarik Data dari Database Supabase (Hanya yang mengirimkan video_url)
  const handlePullFromDb = async () => {
    setIsPullingDb(true);
    setStatusMsg(null);
    try {
      const supabase = createClient();
      const tableName = category === "band" ? "bands" : "vocal_solos";
      // Filter hanya peserta yang sudah mengisi video_url (tidak null dan tidak kosong)
      const { data, error } = await supabase
        .from(tableName)
        .select("id, nomor_undi, name, video_url")
        .not("video_url", "is", null)
        .neq("video_url", "")
        .order("nomor_undi", { ascending: true, nullsFirst: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setStatusMsg({ text: `Tidak ada data peserta dengan video_url di tabel '${tableName}'.`, type: "error" });
        return;
      }

      const mapped: Participant[] = data.map((d: any, idx: number) => {
        const no = d.nomor_undi || String(idx + 1);
        const name = d.name || `Peserta ${no}`;
        return {
          id: d.id || `db-${idx}`,
          no_urut: no,
          nama: name,
          kategori: category,
        };
      });

      onChangeParticipants(mapped);
      onSelectIndex(0);
      setStatusMsg({
        text: `Berhasil mengimpor ${mapped.length} peserta resmi dengan video dari database (${tableName})!`,
        type: "success",
      });
    } catch (err: any) {
      setStatusMsg({ text: "Gagal menarik data database: " + err.message, type: "error" });
    } finally {
      setIsPullingDb(false);
    }
  };

  // 3. Upload CSV / JSON
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            const mapped: Participant[] = parsed.map((item, idx) => ({
              id: item.id || `upload-${idx}`,
              no_urut: item.no_urut || item.nomor || idx + 1,
              nama: item.nama || item.name || `Peserta ${idx + 1}`,
              foto_url: item.foto_url || item.foto || "",
              kategori: category,
            }));
            onChangeParticipants(mapped);
            onSelectIndex(0);
            setStatusMsg({ text: `Berhasil mengimpor ${mapped.length} peserta dari JSON!`, type: "success" });
          }
        } else {
          // Parse CSV
          const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            const header = lines[0].toLowerCase();
            const delimiter = header.includes(";") ? ";" : ",";
            const dataLines = lines.slice(1);

            const mapped: Participant[] = dataLines.map((line, idx) => {
              const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
              // Heuristic detection: [no, nama, foto] or [nama, no]
              let no = String(idx + 1);
              let nama = `Peserta ${idx + 1}`;
              let foto = "";

              if (cols.length >= 2) {
                if (/^\d+$/.test(cols[0])) {
                  no = cols[0];
                  nama = cols[1];
                  foto = cols[2] || "";
                } else if (/^\d+$/.test(cols[1])) {
                  nama = cols[0];
                  no = cols[1];
                  foto = cols[2] || "";
                } else {
                  nama = cols[0];
                  no = cols[1] || String(idx + 1);
                }
              } else if (cols.length === 1 && cols[0]) {
                nama = cols[0];
              }

              return {
                id: `csv-${idx}-${Date.now()}`,
                no_urut: no,
                nama,
                foto_url: foto,
                kategori: category,
              };
            });

            onChangeParticipants(mapped);
            onSelectIndex(0);
            setStatusMsg({ text: `Berhasil mengimpor ${mapped.length} peserta dari CSV!`, type: "success" });
          }
        }
      } catch (err) {
        setStatusMsg({ text: "Gagal memproses file: " + String(err), type: "error" });
      }
    };
    reader.readAsText(file);
  };

  // 4. Batch Upload Foto Lokal (mencocokkan ke no_urut atau nama file)
  const handleBatchPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let matchedCount = 0;
    const updated = [...participants];

    Array.from(files).forEach((file) => {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "").trim();
      const numMatch = fileNameWithoutExt.match(/\d+/);
      const url = URL.createObjectURL(file);

      // Match by number first
      let matchedIdx = -1;
      if (numMatch) {
        const fileNum = parseInt(numMatch[0], 10);
        matchedIdx = updated.findIndex((p) => {
          const pNum = parseInt(String(p.no_urut).replace(/\D/g, ""), 10);
          return pNum === fileNum;
        });
      }

      // If not matched by number, match by name similarity
      if (matchedIdx === -1) {
        matchedIdx = updated.findIndex((p) =>
          p.nama.toLowerCase().includes(fileNameWithoutExt.toLowerCase()) ||
          fileNameWithoutExt.toLowerCase().includes(p.nama.toLowerCase())
        );
      }

      if (matchedIdx !== -1) {
        updated[matchedIdx] = {
          ...updated[matchedIdx],
          foto_blob: url,
        };
        matchedCount++;
      }
    });

    onChangeParticipants(updated);
    setStatusMsg({
      text: `Berhasil mencocokkan ${matchedCount} foto ke daftar peserta dari total ${files.length} foto!`,
      type: "success",
    });
  };

  // Save edit / add form
  const handleSaveParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.nama) return;

    if (editForm.id) {
      // Edit existing
      const updated = participants.map((p) => (p.id === editForm.id ? ({ ...p, ...editForm } as Participant) : p));
      onChangeParticipants(updated);
    } else {
      // Add new
      const newP: Participant = {
        id: "p-" + Date.now(),
        no_urut: editForm.no_urut || participants.length + 1,
        nama: editForm.nama,
        foto_url: editForm.foto_url || "",
        foto_blob: editForm.foto_blob || "",
        kategori: category,
      };
      onChangeParticipants([...participants, newP]);
      onSelectIndex(participants.length);
    }

    setIsEditing(false);
    setEditForm({});
  };

  // Delete participant
  const handleDelete = (id: string) => {
    const filtered = participants.filter((p) => p.id !== id);
    onChangeParticipants(filtered);
    if (currentIndex >= filtered.length && filtered.length > 0) {
      onSelectIndex(filtered.length - 1);
    }
  };

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    return p.nama.toLowerCase().includes(q) || String(p.no_urut).includes(q);
  });

  return (
    <div className="space-y-5 text-sm">
      {/* Action Buttons Header */}
      <div className="space-y-3">
        {/* Row 1: Quick Generate & Import Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleGenerate99}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-ukmred to-orange-600 hover:from-ukmred-dark hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-ukmred/20 transition-all"
          >
            <Sparkles size={15} />
            Muat Peserta Resmi (Video)
          </button>

          <button
            type="button"
            onClick={handlePullFromDb}
            disabled={isPullingDb}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-card hover:bg-card/80 border border-border text-foreground/80 hover:text-foreground rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Database size={15} className="text-ukmred" />
            {isPullingDb ? "Memuat..." : "Tarik dari Database"}
          </button>
        </div>

        {/* Row 2: File Uploads */}
        <div className="grid grid-cols-2 gap-2">
          {/* CSV/JSON Import */}
          <input
            type="file"
            ref={csvInputRef}
            onChange={handleUploadFile}
            accept=".csv, .json, text/csv, application/json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-card hover:bg-card/80 border border-dashed border-border hover:border-ukmred/60 text-foreground/70 hover:text-foreground rounded-xl text-xs font-medium transition-all"
          >
            <Upload size={14} />
            Upload CSV / JSON
          </button>

          {/* Batch Photo Upload */}
          <input
            type="file"
            ref={batchPhotoRef}
            onChange={handleBatchPhotoUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => batchPhotoRef.current?.click()}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-card hover:bg-card/80 border border-dashed border-border hover:border-ukmred/60 text-foreground/70 hover:text-foreground rounded-xl text-xs font-medium transition-all"
          >
            <ImageIcon size={14} />
            Batch Upload Foto
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            statusMsg.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Manual Add / Edit Form Modal or Inline */}
      {isEditing && (
        <form onSubmit={handleSaveParticipant} className="p-4 bg-card rounded-2xl border border-ukmred/40 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-ukmred uppercase tracking-wider">
            <span>{editForm.id ? "Edit Data Peserta" : "Tambah Peserta Baru"}</span>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditForm({});
              }}
              className="text-foreground/50 hover:text-foreground"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-foreground/60 block mb-1">No Urut</label>
              <input
                type="text"
                value={editForm.no_urut || ""}
                onChange={(e) => setEditForm({ ...editForm, no_urut: e.target.value })}
                placeholder="01"
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] text-foreground/60 block mb-1">Nama Peserta / Band</label>
              <input
                type="text"
                value={editForm.nama || ""}
                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                placeholder="Contoh: Sound Of Blue"
                className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-foreground/60 block mb-1">Foto Peserta (URL atau Upload File)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editForm.foto_url || ""}
                onChange={(e) => setEditForm({ ...editForm, foto_url: e.target.value })}
                placeholder="https://... atau biarkan kosong"
                className="flex-1 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono"
              />
              <label className="px-3 py-1.5 bg-background border border-border hover:border-foreground/30 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 text-foreground/70">
                <ImageIcon size={14} /> File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setEditForm({ ...editForm, foto_blob: URL.createObjectURL(f) });
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 bg-ukmred hover:bg-ukmred-dark text-white rounded-lg text-xs font-semibold"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* Search & Total List Count */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-foreground/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor undi..."
            className="w-full bg-background border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ukmred"
          />
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setEditForm({ no_urut: participants.length + 1, nama: "" });
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-card/80 border border-border rounded-xl text-xs font-semibold text-foreground/80 hover:text-foreground"
          >
            <Plus size={14} /> Tambah
          </button>
        )}
      </div>

      {/* Participant List Table */}
      <div className="bg-background/50 rounded-2xl border border-border overflow-hidden">
        <div className="p-3 border-b border-border bg-card/60 flex items-center justify-between text-xs text-foreground/60 font-medium">
          <span>Daftar Peserta ({participants.length})</span>
          {participants.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Yakin ingin menghapus seluruh daftar peserta?")) {
                  onChangeParticipants([]);
                }
              }}
              className="text-red-400 hover:text-red-300 text-[11px]"
            >
              Hapus Semua
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-foreground/40 text-xs">
              {participants.length === 0
                ? 'Belum ada data peserta. Klik "Generate 99 Peserta" atau "Upload CSV".'
                : "Tidak ada peserta yang cocok dengan kata kunci."}
            </div>
          ) : (
            filtered.map((p, idx) => {
              const actualIdx = participants.findIndex((item) => item.id === p.id);
              const isSelected = actualIdx === currentIndex;
              const hasPhoto = Boolean(p.foto_blob || p.foto_url);

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectIndex(actualIdx)}
                  className={`flex items-center justify-between p-2.5 px-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-ukmred/15 border-l-4 border-l-ukmred text-foreground" : "hover:bg-card/70 text-foreground/75"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-ukmred/90 w-8">
                      #{formatParticipantNumber(p.no_urut, 2)}
                    </span>

                    {/* Thumbnail / Indicator */}
                    <div className="w-8 h-8 rounded-lg bg-card border border-border overflow-hidden flex items-center justify-center shrink-0">
                      {hasPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.foto_blob || p.foto_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={14} className="text-foreground/30" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">{p.nama}</div>
                      <div className="text-[10px] text-foreground/40">
                        {hasPhoto ? "Foto Tersedia" : "Tanpa Foto (Fallback Grafis)"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-60 hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm(p);
                        setIsEditing(true);
                      }}
                      className="p-1 hover:text-foreground"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1 hover:text-red-400"
                      title="Hapus"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
