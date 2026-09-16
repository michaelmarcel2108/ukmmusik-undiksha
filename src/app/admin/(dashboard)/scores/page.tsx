"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ClipboardList, Trash2, Trophy, Medal } from "lucide-react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminScores() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchScores();
  }, []);

  async function fetchScores() {
    // Fetch scores with band details
    const { data } = await supabase
      .from("band_scores")
      .select(`
        *,
        bands (
          name
        )
      `)
      .order("created_at", { ascending: false });
    
    if (data) setScores(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("band_scores").delete().eq("id", deleteId);
    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Data penilaian berhasil dihapus!", type: "success" });
      fetchScores();
    }
    setDeleteId(null);
  };

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={!!deleteId} 
        title="Hapus Penilaian?" 
        message="Data penilaian juri ini akan dihapus secara permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="text-ukmred" />
          Data Penilaian Juri
        </h1>
      </div>

      {/* REKAPITULASI & PEMENANG */}
      {!loading && scores.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Top 3 Winners */}
            {(() => {
              const recapMap: Record<string, { name: string, total: number }> = {};
              scores.forEach(s => {
                if (!recapMap[s.band_id]) {
                  recapMap[s.band_id] = { name: s.bands?.name || '-', total: 0 };
                }
                recapMap[s.band_id].total += (s.total_score || 0);
              });
              const recap = Object.values(recapMap).sort((a, b) => b.total - a.total);
              
              const medals = [
                { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Juara 1", icon: Trophy },
                { color: "text-gray-400", bg: "bg-gray-400/10", label: "Juara 2", icon: Medal },
                { color: "text-amber-700", bg: "bg-amber-700/10", label: "Juara 3", icon: Medal },
              ];

              return recap.slice(0, 3).map((winner, idx) => {
                const MedalIcon = medals[idx].icon;
                return (
                  <div key={idx} className={`bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center shadow-sm relative overflow-hidden`}>
                    <div className={`absolute top-0 w-full h-1 ${medals[idx].bg.replace('/10', '')}`} />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${medals[idx].bg} ${medals[idx].color}`}>
                      <MedalIcon size={32} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-1">{medals[idx].label}</span>
                    <h3 className="text-xl font-black mb-2">{winner.name}</h3>
                    <div className="mt-auto pt-4 border-t border-border w-full">
                      <span className="text-3xl font-black text-ukmred">{winner.total}</span>
                      <span className="text-sm text-foreground/50 ml-1">Pts</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Rekap Table */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ClipboardList className="text-ukmred" size={20} />
              Rekapitulasi Total Skor
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="p-3 font-medium text-foreground/80 w-16 text-center">Peringkat</th>
                    <th className="p-3 font-medium text-foreground/80">Nama Band</th>
                    <th className="p-3 font-medium text-foreground/80 text-right">Total Skor Keseluruhan</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const recapMap: Record<string, { name: string, total: number }> = {};
                    scores.forEach(s => {
                      if (!recapMap[s.band_id]) {
                        recapMap[s.band_id] = { name: s.bands?.name || '-', total: 0 };
                      }
                      recapMap[s.band_id].total += (s.total_score || 0);
                    });
                    const recap = Object.values(recapMap).sort((a, b) => b.total - a.total);

                    return recap.map((band, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-background/30">
                        <td className="p-3 text-center font-bold text-foreground/50">{idx + 1}</td>
                        <td className="p-3 font-bold">{band.name}</td>
                        <td className="p-3 text-right font-black text-lg text-ukmred">{band.total}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Riwayat Penilaian (Per Juri)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="p-4 font-medium text-foreground/80">Waktu</th>
                <th className="p-4 font-medium text-foreground/80">Nama Juri</th>
                <th className="p-4 font-medium text-foreground/80">Nama Band</th>
                <th className="p-4 font-medium text-foreground/80 text-center">Harmonisasi</th>
                <th className="p-4 font-medium text-foreground/80 text-center">Skill</th>
                <th className="p-4 font-medium text-foreground/80 text-center">Performance</th>
                <th className="p-4 font-medium text-foreground/80 text-center">Total</th>
                <th className="p-4 font-medium text-foreground/80">Keterangan</th>
                <th className="p-4 font-medium text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-foreground/50">Memuat data...</td></tr>
              ) : scores.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-foreground/50">Belum ada penilaian yang masuk</td></tr>
              ) : (
                scores.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors">
                    <td className="p-4 text-sm text-foreground/60">
                      {new Date(item.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 font-bold">{item.jury_name}</td>
                    <td className="p-4 font-medium">{item.bands?.name || '-'}</td>
                    <td className="p-4 text-center">{item.harmonisasi}</td>
                    <td className="p-4 text-center">{item.skill}</td>
                    <td className="p-4 text-center">{item.performance}</td>
                    <td className="p-4 text-center font-bold text-ukmred">{item.total_score}</td>
                    <td className="p-4 text-sm">{item.keterangan || '-'}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
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
