"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminGallery() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", image_url: "" });
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    const { data } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setActivities(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    await supabase.from("activities").delete().eq("id", id);
    fetchActivities();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase.from("activities").insert([formData]);
    
    setIsSaving(false);
    if (!error) {
      setFormData({ title: "", image_url: "" });
      setIsAdding(false);
      fetchActivities();
    } else {
      alert("Gagal menambahkan: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Galeri Aktivitas</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Foto
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">Tambah Foto Baru</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul/Keterangan Foto</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Penampilan Dies Natalis" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unggah Gambar</label>
              <ImageUpload 
                value={formData.image_url} 
                onChange={(url) => setFormData({...formData, image_url: url})} 
                folder="gallery"
              />
            </div>
            <button type="submit" disabled={isSaving || !formData.image_url} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {isSaving ? "Menyimpan..." : "Simpan Foto"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : activities.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center">
          <ImageIcon size={48} className="text-foreground/30 mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum ada foto</h3>
          <p className="text-foreground/60 mb-6">Tambahkan foto pertama untuk galeri UKM Musik Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activities.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden group">
              <div className="aspect-square bg-black/20 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold truncate">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
