"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminProker() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", summary: "", date: "", cover_image_url: "" });
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setPrograms(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus Program Kerja ini?")) return;
    await supabase.from("programs").delete().eq("id", id);
    fetchPrograms();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase.from("programs").insert([formData]);
    
    setIsSaving(false);
    if (!error) {
      setFormData({ title: "", slug: "", summary: "", date: "" });
      setIsAdding(false);
      fetchPrograms();
    } else {
      alert("Gagal menambahkan: " + error.message);
    }
  };

  // Helper to generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Kerja</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Proker
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">Tambah Program Kerja</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Proker</label>
                <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Pentas Amal 2026" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug URL</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="pentas-amal-2026" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Kegiatan</label>
              <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: 12 Agustus 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Cover</label>
              <ImageUpload 
                value={(formData as any).cover_image_url} 
                onChange={(url) => setFormData({...formData, cover_image_url: url})} 
                folder="proker"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ringkasan Singkat</label>
              <textarea required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background h-24" placeholder="Ringkasan kegiatan untuk ditampilkan di kartu..." />
            </div>
            <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {isSaving ? "Menyimpan..." : "Simpan Proker"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-medium text-foreground/80">Judul</th>
                <th className="p-4 font-medium text-foreground/80">Tanggal</th>
                <th className="p-4 font-medium text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
              ) : programs.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Belum ada Program Kerja</td></tr>
              ) : (
                programs.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4 text-foreground/70">{item.date || "-"}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
