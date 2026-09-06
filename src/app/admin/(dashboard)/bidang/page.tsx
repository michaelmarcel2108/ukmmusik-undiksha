"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, X, Users, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminBidang() {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Add Division Form
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({ id: "", name: "", slug: "", description: "", cover_image_url: "", group_image_url: "" });
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
    const { data } = await supabase
      .from("divisions")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) setDivisions(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus Bidang ini? Semua anggota di dalamnya mungkin akan kehilangan relasi bidang.")) return;
    await supabase.from("divisions").delete().eq("id", id);
    fetchDivisions();
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
      fetchDivisions();
    } else {
      alert("Gagal menyimpan: " + error.message);
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
      fetchMembers(managingMembersFor.id);
    } else {
      alert("Gagal menambahkan anggota: " + error.message);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Hapus anggota ini?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers(managingMembersFor.id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bidang Organisasi</h1>
        <button 
          onClick={() => {
            setFormData({ id: "", name: "", slug: "", description: "", cover_image_url: "", group_image_url: "" });
            setIsAdding(true);
          }}
          className="bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tambah Bidang
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Bidang" : "Tambah Bidang"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Bidang</label>
                <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Bidang 1 (Kesekretariatan)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug URL</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="bidang-1" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gambar Cover Bidang</label>
                <ImageUpload 
                  value={formData.cover_image_url} 
                  onChange={(url) => setFormData({...formData, cover_image_url: url})} 
                  folder="bidang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Foto Bersama (Grup)</label>
                <ImageUpload 
                  value={formData.group_image_url} 
                  onChange={(url) => setFormData({...formData, group_image_url: url})} 
                  folder="bidang"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background h-24" placeholder="Tugas pokok dan fungsi bidang ini..." />
            </div>
            <button type="submit" disabled={isSaving} className="bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {isSaving ? "Menyimpan..." : (formData.id ? "Simpan Perubahan" : "Simpan Bidang")}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-medium text-foreground/80">Gambar</th>
                <th className="p-4 font-medium text-foreground/80">Nama Bidang</th>
                <th className="p-4 font-medium text-foreground/80 text-center">Anggota</th>
                <th className="p-4 font-medium text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
              ) : divisions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-foreground/50">Belum ada Bidang yang ditambahkan</td></tr>
              ) : (
                divisions.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-12 bg-black/20 rounded overflow-hidden">
                        {item.cover_image_url ? (
                          <img src={item.cover_image_url} className="w-full h-full object-cover" alt={item.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-foreground/30">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      {item.name}
                      <span className="block text-xs text-foreground/50 font-normal">/{item.slug}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openMembersModal(item)}
                        className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
                      >
                        <Users size={14} /> Atur Anggota
                      </button>
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

      {/* MODAL / SECTION UNTUK MANAJEMEN ANGGOTA */}
      {managingMembersFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="text-ukmred" /> 
                Anggota Bidang: {managingMembersFor.name}
              </h2>
              <button onClick={() => setManagingMembersFor(null)} className="text-foreground/50 hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-8">
              {/* Form Tambah Anggota */}
              <div className="w-full lg:w-1/3 space-y-4">
                <h3 className="font-bold text-lg mb-4">Tambah Anggota</h3>
                <form onSubmit={handleCreateMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input required type="text" value={memberFormData.name} onChange={e => setMemberFormData({...memberFormData, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Nama..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan / Peran</label>
                    <input required type="text" value={memberFormData.role} onChange={e => setMemberFormData({...memberFormData, role: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background" placeholder="Contoh: Koordinator" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto Anggota (Opsional)</label>
                    <ImageUpload 
                      value={memberFormData.photo_url} 
                      onChange={(url) => setMemberFormData({...memberFormData, photo_url: url})} 
                      folder="members"
                    />
                  </div>
                  <button type="submit" disabled={isSavingMember} className="w-full bg-ukmred hover:bg-ukmred-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
                    {isSavingMember ? "Menyimpan..." : "Tambahkan"}
                  </button>
                </form>
              </div>

              {/* Daftar Anggota */}
              <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                <h3 className="font-bold text-lg mb-4">Daftar Anggota Saat Ini ({members.length})</h3>
                {members.length === 0 ? (
                  <div className="text-center py-12 text-foreground/50 border border-dashed border-border rounded-xl">
                    Belum ada anggota.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                        <div className="w-12 h-12 bg-black/20 rounded-full overflow-hidden flex-shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground/30"><ImageIcon size={16}/></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{member.name}</h4>
                          <p className="text-xs text-foreground/60 truncate">{member.role}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex-shrink-0"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
