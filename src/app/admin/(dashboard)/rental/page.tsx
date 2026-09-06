"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminRental() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", price_per_day: "", description: "", image_url: "" });
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from("rental_items")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setItems(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus Barang Sewa ini?")) return;
    await supabase.from("rental_items").delete().eq("id", id);
    fetchItems();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      ...formData,
      price_per_day: Number(formData.price_per_day) || 0
    };
    
    const { error } = await supabase.from("rental_items").insert([payload]);
    
    setIsSaving(false);
    if (!error) {
      setFormData({ name: "", slug: "", price_per_day: "", description: "", image_url: "" });
      setIsAdding(false);
      fetchItems();
    } else {
      alert("Gagal menambahkan: " + error.message);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, name, slug });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Katalog Barang Sewa</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Barang
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">Tambah Barang Sewa</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Barang</label>
                <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Gitar Akustik Yamaha" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug URL</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="gitar-akustik-yamaha" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Harga Sewa per Hari (Rp)</label>
                <input required type="number" value={formData.price_per_day} onChange={e => setFormData({...formData, price_per_day: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="50000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gambar Barang</label>
                <ImageUpload 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({...formData, image_url: url})} 
                  folder="rental"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Barang</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background h-24" placeholder="Kondisi barang, kelengkapan, dll..." />
            </div>
            <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {isSaving ? "Menyimpan..." : "Simpan Barang"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-medium text-foreground/80">Gambar</th>
                <th className="p-4 font-medium text-foreground/80">Nama Barang</th>
                <th className="p-4 font-medium text-foreground/80">Harga/Hari</th>
                <th className="p-4 font-medium text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Belum ada Barang Sewa</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-16 bg-black/20 rounded-lg overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-foreground/30">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold">{item.name}</td>
                    <td className="p-4 text-ukmred font-medium">Rp {item.price_per_day}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
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
