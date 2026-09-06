"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save } from "lucide-react";

export default function AdminContact() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    contact_humas: "",
    contact_inventaris: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("contact_humas, contact_inventaris")
        .single();
      
      if (data) {
        setFormData({
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
      const { data: existingData } = await supabase.from("site_settings").select("id").limit(1);
      
      let error;
      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from("site_settings")
          .update(formData)
          .eq("id", existingData[0].id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      setMessage({ text: "Kontak berhasil disimpan!", type: "success" });
    } catch (err: any) {
      setMessage({ text: `Gagal menyimpan: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Memuat data...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Manajemen Kontak</h1>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border border-border">
        <p className="text-foreground/70 mb-6">
          Nomor WhatsApp ini akan digunakan sebagai tujuan utama jika ada pesan masuk atau permintaan sewa barang dari pengunjung website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">WhatsApp Humas (Umum)</label>
            <input 
              type="text" 
              name="contact_humas" 
              value={formData.contact_humas} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-border rounded-xl bg-background" 
              placeholder="Contoh: 628123456789" 
            />
            <p className="text-xs text-foreground/50 mt-2">Awali dengan 62, bukan 0 atau +62.</p>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">WhatsApp Inventaris (Sewa Alat)</label>
            <input 
              type="text" 
              name="contact_inventaris" 
              value={formData.contact_inventaris} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-border rounded-xl bg-background" 
              placeholder="Contoh: 628987654321" 
            />
            <p className="text-xs text-foreground/50 mt-2">Nomor untuk pesanan sewa dari Katalog.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg hover:shadow-ukmred/25">
            <Save size={20} />
            {loading ? "Menyimpan..." : "Simpan Kontak"}
          </button>
        </div>
      </form>
    </div>
  );
}
