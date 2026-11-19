"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, Crown, Sparkles, Image as ImageIcon, Globe } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { CORE_ROLES_CONFIG } from "@/lib/core-constants";

export default function AdminPengurusInti() {
  const [coreMembers, setCoreMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    role: "",
    order_index: 0,
    photo_url: "",
    bio: "",
    instagram_url: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCoreMembers();
  }, []);

  async function fetchCoreMembers() {
    setLoading(true);
    const { data } = await supabase
      .from("core_members")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) setCoreMembers(data);
    setLoading(false);
  }

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("core_members").delete().eq("id", deleteId);
    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Pengurus Inti berhasil dihapus!", type: "success" });
      fetchCoreMembers();
    }
    setDeleteId(null);
  };

  const handleInitStandard = async () => {
    if (!confirm("Isi otomatis struktur 6 Pejabat Pokok Dewan Pengurus Inti (Ketua, Wakil Ketua, Sekretaris 1 & 2, Bendahara 1 & 2) sesuai SK Raker 2026/2027?")) return;

    setIsInitializing(true);
    try {
      for (const item of CORE_ROLES_CONFIG) {
        // Check if role already exists
        const { data: existing } = await supabase
          .from("core_members")
          .select("id")
          .eq("role", item.role)
          .maybeSingle();

        if (existing) {
          await supabase.from("core_members").update({
            name: item.defaultName,
            order_index: item.order,
            bio: item.description,
          }).eq("id", existing.id);
        } else {
          await supabase.from("core_members").insert([{
            name: item.defaultName,
            role: item.role,
            order_index: item.order,
            photo_url: item.photoUrl,
            bio: item.description,
          }]);
        }
      }
      setToast({ message: "Berhasil mengisi nama pejabat Dewan Pengurus Inti 2026/2027!", type: "success" });
      fetchCoreMembers();
    } catch (err: any) {
      setToast({ message: "Gagal inisialisasi: " + err.message, type: "error" });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let error;
    if (formData.id) {
      const { id, created_at, ...updateData } = formData;
      const res = await supabase.from("core_members").update(updateData).eq("id", id);
      error = res.error;
    } else {
      const { id, ...insertData } = formData;
      const res = await supabase.from("core_members").insert([insertData]);
      error = res.error;
    }

    setIsSaving(false);
    if (!error) {
      setFormData({
        id: "",
        name: "",
        role: "",
        order_index: 0,
        photo_url: "",
        bio: "",
        instagram_url: ""
      });
      setIsAdding(false);
      setToast({ message: "Data Pengurus Inti berhasil disimpan!", type: "success" });
      fetchCoreMembers();
    } else {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id || "",
      name: item.name || "",
      role: item.role || "",
      order_index: item.order_index || 0,
      photo_url: item.photo_url || "",
      bio: item.bio || "",
      instagram_url: item.instagram_url || ""
    });
    setIsAdding(true);
  };

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Hapus Pengurus Inti?"
        message="Data fungsionaris pengurus inti ini akan dihapus secara permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-ukmred/10 text-ukmred px-2.5 py-0.5 rounded-full border border-ukmred/20">
              Badan Pengurus Harian (BPH)
            </span>
            <span className="text-xs text-foreground/50">• Non-Bidang</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="text-ukmred" />
            Dewan Pengurus Inti
          </h1>
          <p className="text-foreground/60 text-sm">
            Kelola data kepemimpinan utama (Ketua Umum, Wakil Ketua, Sekretaris Umum, Bendahara Umum).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleInitStandard}
            disabled={isInitializing}
            className="bg-card border border-border hover:bg-background text-foreground px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Inisialisasi Jabatan Standar"
          >
            <Sparkles size={16} className="text-ukmred" />
            {isInitializing ? "Memproses..." : "Inisialisasi Jabatan Pokok"}
          </button>

          <button
            onClick={() => {
              setFormData({
                id: "",
                name: "",
                role: "",
                order_index: coreMembers.length + 1,
                photo_url: "",
                bio: "",
                instagram_url: ""
              });
              setIsAdding(true);
            }}
            className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow"
          >
            <Plus size={18} /> Tambah Pengurus Inti
          </button>
        </div>
      </div>

      {/* FORM ADD / EDIT */}
      {isAdding && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 relative shadow-lg">
          <button onClick={() => setIsAdding(false)} className="absolute top-5 right-5 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-4">
            {formData.id ? "Edit Data Pengurus Inti" : "Tambah Pengurus Inti Baru"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  placeholder="Contoh: I Gede Wiradana"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Jabatan Pokok</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  placeholder="Ketua Umum / Wakil / Sekretaris / Bendahara"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Urutan Tampilan</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  placeholder="1 (Ketua), 2 (Wakil), dst."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Link Instagram (Opsional)</label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Foto Formal / Jas Organisasi</label>
              <ImageUpload
                value={formData.photo_url}
                onChange={(url) => setFormData({ ...formData, photo_url: url })}
                folder="pengurus-inti"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Biografi / Deskripsi Peran</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-xl bg-background text-sm"
                placeholder="Penjelasan mandat jabatan dan visi kepemimpinan..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-background"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2.5 rounded-xl font-bold disabled:opacity-50 shadow"
              >
                {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Tambahkan")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE DATA */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-sm">
                <th className="p-4 font-bold text-foreground/80 w-16 text-center">Urutan</th>
                <th className="p-4 font-bold text-foreground/80 w-24">Foto</th>
                <th className="p-4 font-bold text-foreground/80">Nama Pejabat</th>
                <th className="p-4 font-bold text-foreground/80">Jabatan</th>
                <th className="p-4 font-bold text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Memuat data pengurus inti...</td></tr>
              ) : coreMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50">
                    <p className="mb-3">Belum ada Pengurus Inti yang disimpan di database.</p>
                    <button
                      type="button"
                      onClick={handleInitStandard}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ukmred text-white text-xs font-bold shadow hover:bg-ukmred-dark transition-all"
                    >
                      <Sparkles size={14} /> Inisialisasi Jabatan Standar Sekarang
                    </button>
                  </td>
                </tr>
              ) : (
                coreMembers.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4 text-center font-mono font-bold text-ukmred">
                      {item.order_index}
                    </td>
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-background border border-border shadow-inner">
                        {item.photo_url ? (
                          <img src={item.photo_url} className="w-full h-full object-cover object-top" alt={item.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-foreground/30">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-base text-foreground">{item.name}</div>
                      {item.instagram_url && (
                        <a
                          href={item.instagram_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-ukmred"
                        >
                          <Globe size={12} /> Profil IG
                        </a>
                      )}
                    </td>
                    <td className="p-4 font-bold text-sm text-ukmred">
                      {item.role}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
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
