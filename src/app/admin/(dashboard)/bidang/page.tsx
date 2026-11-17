"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, Users, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import Toast from "@/components/ui/Toast";
import { GBPK_DIVISIONS } from "@/lib/divisions-constants";

export default function AdminBidang() {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // State for Add Division Form
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    id: "", 
    name: "", 
    slug: "", 
    description: "", 
    cover_image_url: "", 
    group_image_url: "" 
  });
  const [isSaving, setIsSaving] = useState(false);

  // State for Manage Members Modal
  const [managingMembersFor, setManagingMembersFor] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [memberFormData, setMemberFormData] = useState({ name: "", role: "", photo_url: "" });
  const [isSavingMember, setIsSavingMember] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchDivisions();
  }, []);

  async function fetchDivisions() {
    setLoading(true);
    const { data } = await supabase
      .from("divisions")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) setDivisions(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus Bidang ini? Semua anggota di dalamnya mungkin akan kehilangan relasi bidang.")) return;
    const { error } = await supabase.from("divisions").delete().eq("id", id);
    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Bidang berhasil dihapus!", type: "success" });
      fetchDivisions();
    }
  };

  const handleSyncGBPK = async () => {
    if (!confirm("Sinkronkan 4 Bidang resmi dan seluruh fungsionarisnya sesuai SK Raker Masa Bakti 2026/2027? Data bidang dan nama anggota akan diperbarui otomatis.")) return;

    setIsSyncing(true);
    try {
      for (const gbpk of GBPK_DIVISIONS) {
        // Check if already exists by slug
        const { data: existing } = await supabase
          .from("divisions")
          .select("id")
          .eq("slug", gbpk.slug)
          .maybeSingle();

        let divisionId = existing?.id;

        if (existing) {
          await supabase.from("divisions").update({
            name: `${gbpk.code}: ${gbpk.name}`,
            description: gbpk.description,
          }).eq("id", existing.id);
        } else {
          const { data: inserted } = await supabase.from("divisions").insert([{
            name: `${gbpk.code}: ${gbpk.name}`,
            slug: gbpk.slug,
            description: gbpk.description,
            cover_image_url: gbpk.cover_image_url,
            group_image_url: gbpk.group_image_url,
          }]).select("id").single();
          divisionId = inserted?.id;
        }

        // Sync members for this division
        if (divisionId && gbpk.members) {
          for (const m of gbpk.members) {
            const { data: existingMember } = await supabase
              .from("members")
              .select("id")
              .eq("division_id", divisionId)
              .eq("name", m.name)
              .maybeSingle();

            const fullRole = m.divisionGroup && m.divisionGroup !== "Pimpinan Bidang"
              ? `${m.role} - ${m.divisionGroup}`
              : m.role;

            if (existingMember) {
              await supabase.from("members").update({ role: fullRole }).eq("id", existingMember.id);
            } else {
              await supabase.from("members").insert([{
                name: m.name,
                role: fullRole,
                division_id: divisionId,
                photo_url: m.photo_url || null,
              }]);
            }
          }
        }
      }
      setToast({ message: "Berhasil menyinkronkan 4 Bidang dan seluruh fungsionaris 2026/2027!", type: "success" });
      fetchDivisions();
    } catch (err: any) {
      setToast({ message: "Gagal menyinkronkan: " + err.message, type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let error;
    if (formData.id) {
      const { id, created_at, ...updateData } = formData;
      const res = await supabase.from("divisions").update(updateData).eq("id", id);
      error = res.error;
    } else {
      const { id, ...insertData } = formData;
      const res = await supabase.from("divisions").insert([insertData]);
      error = res.error;
    }
    
    setIsSaving(false);
    if (!error) {
      setFormData({ id: "", name: "", slug: "", description: "", cover_image_url: "", group_image_url: "" });
      setIsAdding(false);
      setToast({ message: "Bidang berhasil disimpan!", type: "success" });
      fetchDivisions();
    } else {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsAdding(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, name, slug });
  };

  // MEMBERS LOGIC
  const openMembersModal = async (division: any) => {
    setManagingMembersFor(division);
    fetchMembers(division.id);
  };

  const fetchMembers = async (division_id: string) => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("division_id", division_id)
      .order("created_at", { ascending: true });
    if (data) setMembers(data);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMember(true);
    const payload = { ...memberFormData, division_id: managingMembersFor.id };
    const { error } = await supabase.from("members").insert([payload]);
    setIsSavingMember(false);
    if (!error) {
      setMemberFormData({ name: "", role: "", photo_url: "" });
      setToast({ message: "Anggota bidang berhasil ditambahkan!", type: "success" });
      fetchMembers(managingMembersFor.id);
    } else {
      setToast({ message: "Gagal menambahkan anggota: " + error.message, type: "error" });
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Hapus anggota ini?")) return;
    await supabase.from("members").delete().eq("id", id);
    setToast({ message: "Anggota berhasil dihapus!", type: "success" });
    fetchMembers(managingMembersFor.id);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-ukmred/10 text-ukmred px-2.5 py-0.5 rounded-full border border-ukmred/20">
              GBPK 2026/2027
            </span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-ukmred" />
            Bidang Organisasi
          </h1>
          <p className="text-foreground/60 text-sm">Kelola struktur bidang operasional UKM Musik Undiksha dan fungsionarisnya.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={handleSyncGBPK}
            disabled={isSyncing}
            className="bg-card border border-border hover:bg-background text-foreground px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Sinkronkan 4 Bidang resmi sesuai GBPK 2026/2027"
          >
            <Sparkles size={16} className="text-ukmred" />
            {isSyncing ? "Menyinkronkan..." : "Sinkronkan GBPK 2026/2027"}
          </button>

          <button 
            onClick={() => {
              setFormData({ id: "", name: "", slug: "", description: "", cover_image_url: "", group_image_url: "" });
              setIsAdding(true);
            }}
            className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow"
          >
            <Plus size={18} /> Tambah Bidang
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 relative shadow-lg">
          <button onClick={() => setIsAdding(false)} className="absolute top-5 right-5 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Bidang" : "Tambah Bidang Baru"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama Bidang</label>
                <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 border border-border rounded-xl bg-background" placeholder="Contoh: Bidang I: Pelatihan dan Pengembangan" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Slug URL</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl bg-background" placeholder="pelatihan-dan-pengembangan" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Gambar Cover Bidang</label>
                <ImageUpload 
                  value={formData.cover_image_url} 
                  onChange={(url) => setFormData({...formData, cover_image_url: url})} 
                  folder="bidang"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Foto Bersama (Grup)</label>
                <ImageUpload 
                  value={formData.group_image_url} 
                  onChange={(url) => setFormData({...formData, group_image_url: url})} 
                  folder="bidang"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Deskripsi Singkat & Pokok Program Kerja</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl bg-background h-32 text-sm" placeholder="Tuliskan tugas pokok dan fungsi bidang ini..." />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="px-5 py-2 border border-border rounded-xl font-medium hover:bg-background"
              >
                Batal
              </button>
              <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50 shadow">
                {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Simpan Bidang")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-sm">
                <th className="p-4 font-bold text-foreground/80 w-24">Cover</th>
                <th className="p-4 font-bold text-foreground/80">Nama Bidang & Slug</th>
                <th className="p-4 font-bold text-foreground/80 text-center">Anggota</th>
                <th className="p-4 font-bold text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat data bidang...</td></tr>
              ) : divisions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">
                    <p className="mb-3">Belum ada Bidang yang tersimpan di database.</p>
                    <button
                      type="button"
                      onClick={handleSyncGBPK}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ukmred text-white text-xs font-bold shadow hover:bg-ukmred-dark transition-all"
                    >
                      <Sparkles size={14} /> Sinkronkan 4 Bidang Sesuai GBPK Sekarang
                    </button>
                  </td>
                </tr>
              ) : (
                divisions.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4">
                      <div className="w-20 h-14 bg-black/20 rounded-xl overflow-hidden border border-border">
                        {item.cover_image_url ? (
                          <img src={item.cover_image_url} className="w-full h-full object-cover" alt={item.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-foreground/30">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-base text-foreground">{item.name}</div>
                      <span className="inline-block text-xs text-foreground/50 font-mono mt-0.5">/bidang/{item.slug}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openMembersModal(item)}
                        className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-blue-500/20 transition-colors"
                      >
                        <Users size={14} /> Atur Fungsionaris
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
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

      {/* MODAL UNTUK MANAJEMEN ANGGOTA / FUNGSIONARIS */}
      {managingMembersFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card">
              <div>
                <span className="text-xs font-bold text-ukmred uppercase tracking-wider block">Manajemen Anggota</span>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="text-ukmred" size={20} /> 
                  Fungsionaris: {managingMembersFor.name}
                </h2>
              </div>
              <button onClick={() => setManagingMembersFor(null)} className="text-foreground/50 hover:text-foreground p-1">
                <X size={22} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Form Tambah Anggota */}
              <form onSubmit={handleCreateMember} className="bg-card border border-border p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold mb-1 text-foreground/70 uppercase">Nama Lengkap</label>
                  <input 
                    required 
                    type="text" 
                    value={memberFormData.name} 
                    onChange={e => setMemberFormData({...memberFormData, name: e.target.value})} 
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm" 
                    placeholder="Contoh: I Made Suardika" 
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold mb-1 text-foreground/70 uppercase">Jabatan / Role</label>
                  <input 
                    required 
                    type="text" 
                    value={memberFormData.role} 
                    onChange={e => setMemberFormData({...memberFormData, role: e.target.value})} 
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm" 
                    placeholder="Contoh: Koordinator Bidang" 
                  />
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-xs font-bold mb-1 text-foreground/70 uppercase">Foto</label>
                  <ImageUpload 
                    value={memberFormData.photo_url} 
                    onChange={url => setMemberFormData({...memberFormData, photo_url: url})} 
                    folder="members" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSavingMember} 
                  className="w-full md:w-auto bg-ukmred hover:bg-ukmred-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 whitespace-nowrap shadow"
                >
                  {isSavingMember ? "Menyimpan..." : "Tambah"}
                </button>
              </form>

              {/* List Anggota */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/70 mb-3">Daftar Fungsionaris Saat Ini</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-foreground/40 border border-dashed border-border rounded-2xl text-sm">
                      Belum ada fungsionaris yang ditambahkan ke bidang ini.
                    </div>
                  ) : (
                    members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-background overflow-hidden border border-border shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} className="w-full h-full object-cover" alt={member.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-foreground/30">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{member.name}</h4>
                          <p className="text-xs text-foreground/60 uppercase truncate">{member.role}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteMember(member.id)} 
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                          title="Hapus Anggota"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
