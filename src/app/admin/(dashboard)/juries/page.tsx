"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, UserCheck, Key, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminJuries() {
  const [juries, setJuries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Add/Edit Jury Form
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({ id: "", name: "", token: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

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

  const generateToken = (name?: string) => {
    const prefix = (name || "JURI")
      .trim()
      .split(" ")[0]
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `JURI-${prefix || "USER"}-${randomCode}`;
  };

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
    
    const finalToken = formData.token?.trim() || generateToken(formData.name);

    let error;
    if (formData.id) {
      const { id, created_at, ...updateData } = formData;
      updateData.token = finalToken;
      const res = await supabase.from("juries").update(updateData).eq("id", id);
      error = res.error;
    } else {
      const { id, ...insertData } = formData;
      insertData.token = finalToken;
      const res = await supabase.from("juries").insert([insertData]);
      error = res.error;
    }
    
    setIsSaving(false);
    if (!error) {
      setFormData({ id: "", name: "", token: "" });
      setIsAdding(false);
      setToast({ message: "Juri berhasil disimpan!", type: "success" });
      fetchJuries();
    } else {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      name: item.name,
      token: item.token || generateToken(item.name),
      created_at: item.created_at,
    });
    setIsAdding(true);
  };

  const copyToClipboard = (text: string, id: string, type: "token" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "token") {
      setCopiedTokenId(id);
      setTimeout(() => setCopiedTokenId(null), 2000);
    } else {
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
    setToast({
      message: type === "token" ? "Token berhasil disalin!" : "Link form penjurian disalin!",
      type: "success",
    });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="text-ukmred" />
            Daftar Juri Lomba RGC XVII
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            Kelola data dewan juri dan token login personal untuk akses form penilaian.
          </p>
        </div>
        <button 
          onClick={() => {
            const initialToken = generateToken();
            setFormData({ id: "", name: "", token: initialToken });
            setIsAdding(true);
          }}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Tambah Juri Baru
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative shadow-lg">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Key className="text-ukmred" size={20} />
            {formData.id ? "Edit Data & Token Juri" : "Tambah Juri Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap Dewan Juri *</label>
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={(e) => {
                  const newName = e.target.value;
                  setFormData({
                    ...formData, 
                    name: newName,
                    // If adding new and token is default, update token prefix
                    token: !formData.id && (!formData.token || formData.token.startsWith("JURI-USER"))
                      ? generateToken(newName)
                      : formData.token
                  });
                }} 
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-ukmred focus:outline-none" 
                placeholder="Contoh: Kadek Rama Sanjaya S.Tr.Kom" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Token Akses Juri *</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, token: generateToken(formData.name) })}
                  className="text-xs text-ukmred hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw size={12} /> Acak Token Baru
                </button>
              </div>
              <div className="relative">
                <input 
                  required 
                  type="text" 
                  value={formData.token} 
                  onChange={(e) => setFormData({ ...formData, token: e.target.value.toUpperCase().replace(/\s+/g, "-") })} 
                  className="w-full font-mono font-bold tracking-wider px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-ukmred focus:outline-none uppercase" 
                  placeholder="Contoh: JURI-RAMA-77" 
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1">
                Token ini bersifat unik dan digunakan juri untuk login ke portal penilaian secara langsung.
              </p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-50 transition-colors shadow">
                {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Tambahkan Juri")}
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-foreground/5 text-foreground/70 font-medium">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-foreground/70 w-16 text-center">No</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-foreground/70">Nama Juri</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-foreground/70">Token Akses</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-foreground/70">Link Langsung (WA)</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-foreground/70 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Memuat data juri...</td></tr>
              ) : juries.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50">Belum ada juri yang ditambahkan</td></tr>
              ) : (
                juries.map((item, index) => {
                  const juryToken = item.token || "-";
                  const directLink = typeof window !== "undefined" && item.token 
                    ? `${window.location.origin}/penilaian?token=${encodeURIComponent(item.token)}`
                    : `/penilaian?token=${item.token || ""}`;

                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-background/40 transition-colors">
                      <td className="p-4 text-center font-bold text-foreground/50 text-sm">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-base text-foreground flex items-center gap-2">
                          {item.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-ukmred/10 text-ukmred border border-ukmred/20 px-2.5 py-1 rounded-md tracking-wider">
                            {juryToken}
                          </span>
                          {item.token && (
                            <button
                              onClick={() => copyToClipboard(item.token, item.id, "token")}
                              className="p-1.5 text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors"
                              title="Salin Token"
                            >
                              {copiedTokenId === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {item.token ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyToClipboard(directLink, item.id, "link")}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border hover:border-ukmred/40 bg-background hover:bg-ukmred/5 text-foreground/80 hover:text-ukmred flex items-center gap-1.5 transition-colors"
                              title="Salin tautan login juri langsung untuk dibagikan via WhatsApp"
                            >
                              {copiedLinkId === item.id ? (
                                <>
                                  <Check size={13} className="text-emerald-500" />
                                  <span className="text-emerald-500">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <ExternalLink size={13} />
                                  <span>Salin Link Juri</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-foreground/40 italic">Belum ada token</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" 
                            title="Edit Juri & Token"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Hapus Juri"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
