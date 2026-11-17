"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, Mic2, ExternalLink, Search } from "lucide-react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { VOCAL_SONGS } from "@/lib/competition-constants";

export default function AdminVocalSolo() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    nomor_undi: "",
    name: "",
    song_title: "",
    video_url: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    const { data } = await supabase
      .from("vocal_solos")
      .select("*")
      .order("nomor_undi", { ascending: true, nullsFirst: false });
    
    if (data) setParticipants(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("vocal_solos").delete().eq("id", deleteId);
    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Peserta Vokal Solo berhasil dihapus!", type: "success" });
      fetchParticipants();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let error;
    if (formData.id) {
      const { id, created_at, ...updateData } = formData;
      const res = await supabase.from("vocal_solos").update(updateData).eq("id", id);
      error = res.error;
    } else {
      const { id, ...insertData } = formData;
      const res = await supabase.from("vocal_solos").insert([insertData]);
      error = res.error;
    }
    
    setIsSaving(false);
    if (!error) {
      setFormData({ id: "", nomor_undi: "", name: "", song_title: "", video_url: "" });
      setIsAdding(false);
      setToast({ message: "Peserta Vokal Solo berhasil disimpan!", type: "success" });
      fetchParticipants();
    } else {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id || "",
      nomor_undi: item.nomor_undi || "",
      name: item.name || "",
      song_title: item.song_title || "",
      video_url: item.video_url || ""
    });
    setIsAdding(true);
  };

  const filteredList = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.nomor_undi && p.nomor_undi.toLowerCase().includes(q)) ||
      (p.song_title && p.song_title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={!!deleteId} 
        title="Hapus Peserta Vokal Solo?" 
        message="Data peserta vokal solo dan seluruh riwayat nilai jurinya akan dihapus permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-ukmred/10 text-ukmred px-2.5 py-0.5 rounded-full border border-ukmred/20">
              Rock Goes To Campus XVII
            </span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic2 className="text-ukmred" />
            Peserta Lomba Vokal Solo Nasional
          </h1>
          <p className="text-foreground/60 text-sm">Kelola daftar peserta vokal solo, nomor undi, lagu pilihan, dan tautan video karya.</p>
        </div>

        <button 
          onClick={() => {
            setFormData({ id: "", nomor_undi: "", name: "", song_title: "", video_url: "" });
            setIsAdding(true);
          }}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
        >
          <Plus size={18} /> Tambah Peserta Vokal
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 relative shadow-lg">
          <button 
            onClick={() => setIsAdding(false)} 
            className="absolute top-5 right-5 text-foreground/50 hover:text-foreground p-1"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            {formData.id ? "✏️ Edit Peserta Vokal Solo" : "➕ Tambah Peserta Vokal Solo Baru"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground/80">Nomor Undi</label>
                <input 
                  type="text" 
                  value={formData.nomor_undi} 
                  onChange={(e) => setFormData({...formData, nomor_undi: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-1 focus:ring-ukmred focus:border-ukmred" 
                  placeholder="Contoh: 01 atau V-01" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-foreground/80">Nama Peserta Vokal *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-1 focus:ring-ukmred focus:border-ukmred" 
                  placeholder="Nama Lengkap Peserta" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground/80">Lagu Pilihan Wajib</label>
                <select 
                  value={formData.song_title} 
                  onChange={(e) => setFormData({...formData, song_title: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-1 focus:ring-ukmred focus:border-ukmred"
                >
                  <option value="">-- Pilih Lagu Pilihan --</option>
                  {VOCAL_SONGS.map((song) => (
                    <option key={song} value={song}>{song}</option>
                  ))}
                  <option value="custom">-- Lagu Lainnya (Input Manual) --</option>
                </select>
                {formData.song_title === "custom" && (
                  <input
                    type="text"
                    placeholder="Tuliskan judul lagu pilihan..."
                    className="mt-2 w-full px-4 py-2 border border-border rounded-xl bg-background"
                    onChange={(e) => setFormData({ ...formData, song_title: e.target.value })}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-foreground/80">Link Video Penampilan (Drive / YouTube)</label>
                <input 
                  type="url" 
                  value={formData.video_url} 
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-1 focus:ring-ukmred focus:border-ukmred" 
                  placeholder="https://drive.google.com/... atau https://youtu.be/..." 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-background/80 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow"
              >
                {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Tambahkan Peserta")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama peserta, no. undi, atau lagu..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-1 focus:ring-ukmred"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-sm">
                <th className="p-4 font-bold text-foreground/80 w-16 text-center">No</th>
                <th className="p-4 font-bold text-foreground/80 w-28 text-center">No. Undi</th>
                <th className="p-4 font-bold text-foreground/80">Nama Peserta Vokal</th>
                <th className="p-4 font-bold text-foreground/80">Lagu Pilihan</th>
                <th className="p-4 font-bold text-foreground/80 text-center">Video Karya</th>
                <th className="p-4 font-bold text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">Memuat data peserta...</td></tr>
              ) : filteredList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">
                  {searchQuery ? "Tidak ada peserta yang sesuai pencarian" : "Belum ada peserta vokal solo yang ditambahkan"}
                </td></tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4 text-center font-medium text-foreground/60">{index + 1}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-background border border-border px-2.5 py-1 rounded-md font-mono text-sm font-bold text-ukmred">
                        {item.nomor_undi || "-"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-base text-foreground">
                      {item.name}
                    </td>
                    <td className="p-4 text-sm text-foreground/80 font-medium">
                      {item.song_title || <span className="text-foreground/40 italic">- Belum dipilih -</span>}
                    </td>
                    <td className="p-4 text-center">
                      {item.video_url ? (
                        <a 
                          href={item.video_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 bg-blue-500/10 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          <ExternalLink size={14} /> Buka Video
                        </a>
                      ) : (
                        <span className="text-xs text-foreground/40">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
