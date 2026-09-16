"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, UserCheck } from "lucide-react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminJuries() {
  const [juries, setJuries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Add/Edit Jury Form
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({ id: "", name: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchJuries();
  }, []);

  async function fetchJuries() {
    const { data } = await supabase
      .from("juries")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) setJuries(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("juries").delete().eq("id", deleteId);
    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Juri berhasil dihapus!", type: "success" });
      fetchJuries();
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let error;
    if (formData.id) {
      const { id, created_at, ...updateData } = formData;
      const res = await supabase.from("juries").update(updateData).eq("id", id);
      error = res.error;
    } else {
      const { id, ...insertData } = formData;
      const res = await supabase.from("juries").insert([insertData]);
      error = res.error;
    }
    
    setIsSaving(false);
    if (!error) {
      setFormData({ id: "", name: "" });
      setIsAdding(false);
      setToast({ message: "Juri berhasil disimpan!", type: "success" });
      fetchJuries();
    } else {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsAdding(true);
  };

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={!!deleteId} 
        title="Hapus Juri?" 
        message="Data juri ini akan dihapus secara permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="text-ukmred" />
          Daftar Juri Lomba
        </h1>
        <button 
          onClick={() => {
            setFormData({ id: "", name: "" });
            setIsAdding(true);
          }}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Juri
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Juri" : "Tambah Juri"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Juri</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Budi Santoso" />
            </div>
            
            <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Tambahkan Juri")}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-medium text-foreground/80 w-16 text-center">No</th>
                <th className="p-4 font-medium text-foreground/80">Nama Juri</th>
                <th className="p-4 font-medium text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
              ) : juries.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-foreground/50">Belum ada juri yang ditambahkan</td></tr>
              ) : (
                juries.map((item, index) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4 text-center font-medium text-foreground/60">{index + 1}</td>
                    <td className="p-4 font-bold text-lg">
                      {item.name}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
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
