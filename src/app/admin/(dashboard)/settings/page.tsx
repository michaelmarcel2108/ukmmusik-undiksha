"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Upload } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    embed_music_url: "",
    contact_humas: "",
    contact_inventaris: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (data) {
        setFormData({
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_image_url: data.hero_image_url || "",
          embed_music_url: data.embed_music_url || "",
          contact_humas: data.contact_humas || "",
          contact_inventaris: data.contact_inventaris || "",
        });
      }
      setFetching(false);
    }
    fetchSettings();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Assuming single row with ID exists or we just update the first row
      const { data: existingData } = await supabase.from("site_settings").select("id").limit(1);
      
      let error;
      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from("site_settings")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData[0].id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      setMessage({ text: "Pengaturan berhasil disimpan!", type: "success" });
    } catch (err: any) {
      setMessage({ text: `Gagal menyimpan: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Utama Website</h1>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 rounded-2xl border border-border">
        
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">Hero Section (Beranda)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Hero</label>
              <input type="text" name="hero_title" value={formData.hero_title} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sub-judul Hero</label>
              <input type="text" name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Background Hero</label>
            <div className="max-w-xl">
              <ImageUpload 
                value={formData.hero_image_url} 
                onChange={(url) => setFormData({...formData, hero_image_url: url})} 
                folder="hero"
              />
            </div>
            <p className="text-xs text-foreground/50 mt-2">Gambar akan menjadi latar belakang utama di halaman Beranda.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">Karya Lagu</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Link Embed (Spotify/YouTube)</label>
            <input type="text" name="embed_music_url" value={formData.embed_music_url} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="https://open.spotify.com/embed/..." />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-2">Kontak Pengurus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Humas</label>
              <input type="text" name="contact_humas" value={formData.contact_humas} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="62812345678" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Inventaris (Sewa)</label>
              <input type="text" name="contact_inventaris" value={formData.contact_inventaris} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg bg-background" placeholder="62812345678" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50">
            <Save size={18} />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
