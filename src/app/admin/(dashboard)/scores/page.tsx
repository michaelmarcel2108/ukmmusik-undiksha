"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  ClipboardList, 
  Trash2, 
  Trophy, 
  Medal, 
  Music, 
  Mic2, 
  Printer, 
  Filter, 
  ExternalLink 
} from "lucide-react";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { BAND_CRITERIA, VOCAL_CRITERIA } from "@/lib/competition-constants";

export default function AdminScores() {
  const [activeTab, setActiveTab] = useState<"band" | "vocal">("band");
  
  // Data States
  const [bandScores, setBandScores] = useState<any[]>([]);
  const [vocalScores, setVocalScores] = useState<any[]>([]);
  const [juries, setJuries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter jury
  const [selectedJuryFilter, setSelectedJuryFilter] = useState<string>("all");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "band" | "vocal" } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchAllScores();
  }, []);

  async function fetchAllScores() {
    setLoading(true);
    const [bRes, vRes, jRes] = await Promise.all([
      supabase
        .from("band_scores")
        .select(`
          *,
          bands (
            id,
            nomor_undi,
            name,
            song_title,
            video_url
          )
        `)
        .order("created_at", { ascending: false }),
      supabase
        .from("vocal_scores")
        .select(`
          *,
          vocal_solos (
            id,
            nomor_undi,
            name,
            song_title,
            video_url
          )
        `)
        .order("created_at", { ascending: false }),
      supabase.from("juries").select("*").order("name", { ascending: true })
    ]);

    if (bRes.data) setBandScores(bRes.data);
    if (vRes.data) setVocalScores(vRes.data);
    if (jRes.data) setJuries(jRes.data);
    setLoading(false);
  }

  const handleDelete = (id: string, type: "band" | "vocal") => {
    setDeleteTarget({ id, type });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const tableName = deleteTarget.type === "band" ? "band_scores" : "vocal_scores";
    const { error } = await supabase.from(tableName).delete().eq("id", deleteTarget.id);

    if (error) {
      setToast({ message: "Gagal menghapus: " + error.message, type: "error" });
    } else {
      setToast({ message: "Penilaian berhasil dihapus!", type: "success" });
      fetchAllScores();
    }
    setDeleteTarget(null);
  };

  // RECAP COMPUTATIONS FOR BAND
  const bandRecap = useMemo(() => {
    const recapMap: Record<string, {
      id: string;
      nomor_undi: string;
      name: string;
      song_title: string;
      video_url: string;
      totalWeighted: number;
      totalRaw: number;
      juryCount: number;
      scoresList: any[];
    }> = {};

    bandScores.forEach((s) => {
      const bId = s.band_id;
      if (!recapMap[bId]) {
        recapMap[bId] = {
          id: bId,
          nomor_undi: s.bands?.nomor_undi || "-",
          name: s.bands?.name || "Band #" + bId.slice(0, 5),
          song_title: s.bands?.song_title || "-",
          video_url: s.bands?.video_url || "",
          totalWeighted: 0,
          totalRaw: 0,
          juryCount: 0,
          scoresList: [],
        };
      }
      recapMap[bId].totalWeighted += Number(s.total_score || 0);
      recapMap[bId].totalRaw += Number(s.total_murni || 0);
      recapMap[bId].juryCount += 1;
      recapMap[bId].scoresList.push(s);
    });

    return Object.values(recapMap)
      .map((item) => ({
        ...item,
        avgWeighted: item.juryCount > 0 ? Number((item.totalWeighted / item.juryCount).toFixed(2)) : 0,
        avgRaw: item.juryCount > 0 ? Number((item.totalRaw / item.juryCount).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.avgWeighted - a.avgWeighted);
  }, [bandScores]);

  // RECAP COMPUTATIONS FOR VOCAL
  const vocalRecap = useMemo(() => {
    const recapMap: Record<string, {
      id: string;
      nomor_undi: string;
      name: string;
      song_title: string;
      video_url: string;
      totalWeighted: number;
      totalRaw: number;
      juryCount: number;
      scoresList: any[];
    }> = {};

    vocalScores.forEach((s) => {
      const vId = s.vocal_id;
      if (!recapMap[vId]) {
        recapMap[vId] = {
          id: vId,
          nomor_undi: s.vocal_solos?.nomor_undi || "-",
          name: s.vocal_solos?.name || "Peserta #" + vId.slice(0, 5),
          song_title: s.vocal_solos?.song_title || "-",
          video_url: s.vocal_solos?.video_url || "",
          totalWeighted: 0,
          totalRaw: 0,
          juryCount: 0,
          scoresList: [],
        };
      }
      recapMap[vId].totalWeighted += Number(s.total_score || 0);
      recapMap[vId].totalRaw += Number(s.total_murni || 0);
      recapMap[vId].juryCount += 1;
      recapMap[vId].scoresList.push(s);
    });

    return Object.values(recapMap)
      .map((item) => ({
        ...item,
        avgWeighted: item.juryCount > 0 ? Number((item.totalWeighted / item.juryCount).toFixed(2)) : 0,
        avgRaw: item.juryCount > 0 ? Number((item.totalRaw / item.juryCount).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.avgWeighted - a.avgWeighted);
  }, [vocalScores]);

  // Filter scores list per jury
  const displayedBandScores = bandScores.filter((s) => 
    selectedJuryFilter === "all" ? true : s.jury_name === selectedJuryFilter
  );

  const displayedVocalScores = vocalScores.filter((s) => 
    selectedJuryFilter === "all" ? true : s.jury_name === selectedJuryFilter
  );

  const currentRecap = activeTab === "band" ? bandRecap : vocalRecap;

  const medals = [
    { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/40", label: "Juara 1", icon: Trophy },
    { color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/40", label: "Juara 2", icon: Medal },
    { color: "text-amber-700", bg: "bg-amber-700/10", border: "border-amber-700/40", label: "Juara 3", icon: Medal },
  ];

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmModal 
        isOpen={!!deleteTarget} 
        title="Hapus Nilai Juri?" 
        message="Data penilaian dari juri untuk peserta ini akan dihapus secara permanen."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* HEADER SECTION (HIDDEN ON PRINT) */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-ukmred/10 text-ukmred px-2.5 py-0.5 rounded-full border border-ukmred/20">
              Rock Goes To Campus XVII
            </span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="text-ukmred" />
            Rekapitulasi Nilai & Pemenang Lomba
          </h1>
          <p className="text-foreground/60 text-sm">
            Pantau perolehan skor real-time, podium 3 besar, dan cetak berita acara resmi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-background text-foreground font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            <Printer size={16} className="text-ukmred" />
            <span>Cetak Berita Acara</span>
          </button>
        </div>
      </div>

      {/* COMPETITION TABS (HIDDEN ON PRINT) */}
      <div className="print:hidden flex gap-2 bg-card border border-border p-1.5 rounded-2xl mb-8 shadow-sm max-w-xl">
        <button
          onClick={() => { setActiveTab("band"); setSelectedJuryFilter("all"); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === "band"
              ? "bg-ukmred text-white shadow-md shadow-ukmred/20"
              : "text-foreground/70 hover:text-foreground hover:bg-background/80"
          }`}
        >
          <Music size={16} />
          <span>Lomba Band Nasional</span>
        </button>

        <button
          onClick={() => { setActiveTab("vocal"); setSelectedJuryFilter("all"); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === "vocal"
              ? "bg-ukmred text-white shadow-md shadow-ukmred/20"
              : "text-foreground/70 hover:text-foreground hover:bg-background/80"
          }`}
        >
          <Mic2 size={16} />
          <span>Lomba Vokal Solo</span>
        </button>
      </div>

      {/* PRINT HEADER (VISIBLE ONLY ON PRINT) */}
      <div className="hidden print:block mb-8 text-center border-b-2 border-black pb-4">
        <h2 className="text-xl font-black uppercase tracking-wider">UNIT KEGIATAN MAHASISWA MUSIK</h2>
        <h3 className="text-lg font-bold">UNIVERSITAS PENDIDIKAN GANESHA</h3>
        <p className="text-xs text-gray-600">Sekretariat: Kampus Tengah Undiksha, Jl. Udayana No. 11 Singaraja - Bali</p>
        <div className="mt-4 pt-2 border-t border-gray-400">
          <h1 className="text-base font-black uppercase">
            BERITA ACARA REKAPITULASI PENILAIAN DEWAN JURI
          </h1>
          <h2 className="text-sm font-bold uppercase text-red-700">
            {activeTab === "band" ? "LOMBA BAND NASIONAL" : "LOMBA VOKAL SOLO NASIONAL"} - ROCK GOES TO CAMPUS XVII
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>
      </div>

      {/* PODIUM TOP 3 WINNERS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <span>Papan Tiga Besar ({activeTab === "band" ? "Lomba Band" : "Lomba Vokal Solo"})</span>
          </h2>
          <span className="text-xs text-foreground/50">Diurutkan berdasarkan Rata-rata Skor Terbobot (%)</span>
        </div>

        {currentRecap.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-foreground/50">
            Belum ada nilai yang dimasukkan oleh dewan juri untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentRecap.slice(0, 3).map((winner, idx) => {
              const MedalIcon = medals[idx].icon;
              return (
                <div 
                  key={winner.id} 
                  className={`bg-card border ${medals[idx].border} p-6 rounded-2xl flex flex-col items-center text-center shadow-md relative overflow-hidden`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${medals[idx].bg} ${medals[idx].color} shadow-inner`}>
                    <MedalIcon size={30} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-0.5 rounded-full mb-2 ${medals[idx].bg} ${medals[idx].color}`}>
                    {medals[idx].label}
                  </span>

                  <span className="text-xs font-mono font-bold text-foreground/50 mb-0.5">
                    No. Undi: {winner.nomor_undi}
                  </span>
                  <h3 className="text-xl font-black mb-1 text-foreground leading-tight">{winner.name}</h3>
                  <p className="text-xs text-foreground/60 mb-4 line-clamp-1 italic">
                    Lagu: {winner.song_title}
                  </p>

                  <div className="mt-auto pt-3 border-t border-border w-full flex justify-around items-center">
                    <div>
                      <span className="block text-[10px] text-foreground/50 uppercase font-bold">Rata-rata Skor</span>
                      <span className="text-2xl font-black text-ukmred">{winner.avgWeighted}</span>
                      <span className="text-xs text-foreground/50 ml-0.5">%</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <span className="block text-[10px] text-foreground/50 uppercase font-bold">Total Nilai</span>
                      <span className="text-lg font-bold text-foreground">{Number(winner.totalWeighted.toFixed(2))}</span>
                      <span className="text-[10px] text-foreground/50 block">({winner.juryCount} Juri)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REKAPITULASI TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <div className="p-5 border-b border-border flex justify-between items-center bg-background/40">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ClipboardList className="text-ukmred" size={18} />
              Tabel Rekapitulasi Peringkat Lengkap
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Akumulasi penilaian dewan juri untuk {activeTab === "band" ? "Lomba Band Nasional" : "Lomba Vokal Solo Nasional"}.
            </p>
          </div>
          <span className="text-xs font-bold text-foreground/70 bg-card px-3 py-1 rounded-lg border border-border">
            Total Peserta Dinilai: {currentRecap.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/70 text-xs uppercase tracking-wide text-foreground/70">
                <th className="p-3.5 font-bold w-16 text-center">Peringkat</th>
                <th className="p-3.5 font-bold w-24 text-center">No. Undi</th>
                <th className="p-3.5 font-bold">Nama Peserta / Band</th>
                <th className="p-3.5 font-bold">Lagu Pilihan</th>
                <th className="p-3.5 font-bold text-center">Juri Penilai</th>
                <th className="p-3.5 font-bold text-center">Rata-rata Murni</th>
                <th className="p-3.5 font-bold text-center text-ukmred">Rata-rata Terbobot (%)</th>
                <th className="p-3.5 font-bold text-right pr-6">Total Skor Akumulasi</th>
              </tr>
            </thead>
            <tbody>
              {currentRecap.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-foreground/50 text-sm">
                    Belum ada data rekapitulasi nilai.
                  </td>
                </tr>
              ) : (
                currentRecap.map((item, idx) => (
                  <tr key={item.id} className="border-b border-border hover:bg-background/30 transition-colors text-sm">
                    <td className="p-3.5 text-center font-bold">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs shadow-sm">1</span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-black font-black text-xs shadow-sm">2</span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs shadow-sm">3</span>
                      ) : (
                        <span className="text-foreground/50">{idx + 1}</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-ukmred">
                      {item.nomor_undi}
                    </td>
                    <td className="p-3.5 font-bold text-foreground">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-foreground/70 text-xs">
                      {item.song_title}
                    </td>
                    <td className="p-3.5 text-center font-medium text-xs">
                      <span className="bg-background border border-border px-2 py-0.5 rounded-md">
                        {item.juryCount} Juri
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-semibold text-foreground/80">
                      {item.avgRaw}
                    </td>
                    <td className="p-3.5 text-center font-black text-base text-ukmred">
                      {item.avgWeighted}
                    </td>
                    <td className="p-3.5 text-right pr-6 font-bold text-foreground">
                      {Number(item.totalWeighted.toFixed(2))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL PENILAIAN PER JURI (PRINT: HIDDEN IF NOT NEEDED, OR CAN BE INCLUDED) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm print:hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-background/40">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Filter className="text-ukmred" size={18} />
              Detail Riwayat Nilai Setiap Dewan Juri
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Rincian poin per kriteria yang diberikan oleh juri.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-foreground/60 whitespace-nowrap">Filter Juri:</span>
            <select
              value={selectedJuryFilter}
              onChange={(e) => setSelectedJuryFilter(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-xl bg-card text-xs font-semibold focus:outline-none focus:border-ukmred"
            >
              <option value="all">Semua Juri</option>
              {juries.map((j) => (
                <option key={j.id} value={j.name}>{j.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "band" ? (
            /* RIWAYAT BAND */
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-background/70 text-[11px] uppercase tracking-wide text-foreground/70">
                  <th className="p-3 font-bold">Waktu</th>
                  <th className="p-3 font-bold">Nama Juri</th>
                  <th className="p-3 font-bold">No. Undi & Band</th>
                  <th className="p-2 font-bold text-center">Musikalitas<br/><span className="text-ukmred">20%</span></th>
                  <th className="p-2 font-bold text-center">Aransemen<br/><span className="text-ukmred">20%</span></th>
                  <th className="p-2 font-bold text-center">Vokal<br/><span className="text-ukmred">15%</span></th>
                  <th className="p-2 font-bold text-center">Instrumen<br/><span className="text-ukmred">15%</span></th>
                  <th className="p-2 font-bold text-center">Kekompakan<br/><span className="text-ukmred">10%</span></th>
                  <th className="p-2 font-bold text-center">Audio<br/><span className="text-ukmred">10%</span></th>
                  <th className="p-2 font-bold text-center">Visual<br/><span className="text-ukmred">10%</span></th>
                  <th className="p-2 font-bold text-center">Murni</th>
                  <th className="p-2 font-bold text-center text-ukmred">Bobot (%)</th>
                  <th className="p-3 font-bold">Catatan</th>
                  <th className="p-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedBandScores.length === 0 ? (
                  <tr><td colSpan={14} className="p-8 text-center text-foreground/50 text-xs">Belum ada riwayat penilaian juri untuk band.</td></tr>
                ) : (
                  displayedBandScores.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-background/30 text-xs transition-colors">
                      <td className="p-3 text-foreground/50 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3 font-bold text-foreground">{item.jury_name}</td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-ukmred mr-1.5">[{item.bands?.nomor_undi || "-"}]</span>
                        <span className="font-semibold">{item.bands?.name || "-"}</span>
                      </td>
                      <td className="p-2 text-center">{item.musikalitas || "-"}</td>
                      <td className="p-2 text-center">{item.aransemen || "-"}</td>
                      <td className="p-2 text-center">{item.vokal || "-"}</td>
                      <td className="p-2 text-center">{item.instrumen || "-"}</td>
                      <td className="p-2 text-center">{item.kekompakan || "-"}</td>
                      <td className="p-2 text-center">{item.audio || "-"}</td>
                      <td className="p-2 text-center">{item.penampilan || "-"}</td>
                      <td className="p-2 text-center font-bold text-foreground/80">{item.total_murni || "-"}</td>
                      <td className="p-2 text-center font-black text-ukmred">{Number(item.total_score || 0).toFixed(2)}</td>
                      <td className="p-3 text-foreground/70 max-w-[150px] truncate" title={item.keterangan || ""}>
                        {item.keterangan || "-"}
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDelete(item.id, "band")}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus Nilai Ini"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* RIWAYAT VOKAL SOLO */
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-background/70 text-[11px] uppercase tracking-wide text-foreground/70">
                  <th className="p-3 font-bold">Waktu</th>
                  <th className="p-3 font-bold">Nama Juri</th>
                  <th className="p-3 font-bold">No. Undi & Peserta</th>
                  <th className="p-2 font-bold text-center">Intonasi<br/><span className="text-ukmred">30%</span></th>
                  <th className="p-2 font-bold text-center">Teknik<br/><span className="text-ukmred">25%</span></th>
                  <th className="p-2 font-bold text-center">Penghayatan<br/><span className="text-ukmred">20%</span></th>
                  <th className="p-2 font-bold text-center">Artikulasi<br/><span className="text-ukmred">10%</span></th>
                  <th className="p-2 font-bold text-center">Panggung<br/><span className="text-ukmred">10%</span></th>
                  <th className="p-2 font-bold text-center">Kreativitas<br/><span className="text-ukmred">5%</span></th>
                  <th className="p-2 font-bold text-center">Murni</th>
                  <th className="p-2 font-bold text-center text-ukmred">Bobot (%)</th>
                  <th className="p-3 font-bold">Catatan</th>
                  <th className="p-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedVocalScores.length === 0 ? (
                  <tr><td colSpan={13} className="p-8 text-center text-foreground/50 text-xs">Belum ada riwayat penilaian juri untuk vokal solo.</td></tr>
                ) : (
                  displayedVocalScores.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-background/30 text-xs transition-colors">
                      <td className="p-3 text-foreground/50 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3 font-bold text-foreground">{item.jury_name}</td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-ukmred mr-1.5">[{item.vocal_solos?.nomor_undi || "-"}]</span>
                        <span className="font-semibold">{item.vocal_solos?.name || "-"}</span>
                      </td>
                      <td className="p-2 text-center">{item.intonasi || "-"}</td>
                      <td className="p-2 text-center">{item.teknik || "-"}</td>
                      <td className="p-2 text-center">{item.penghayatan || "-"}</td>
                      <td className="p-2 text-center">{item.artikulasi || "-"}</td>
                      <td className="p-2 text-center">{item.penampilan || "-"}</td>
                      <td className="p-2 text-center">{item.kreativitas || "-"}</td>
                      <td className="p-2 text-center font-bold text-foreground/80">{item.total_murni || "-"}</td>
                      <td className="p-2 text-center font-black text-ukmred">{Number(item.total_score || 0).toFixed(2)}</td>
                      <td className="p-3 text-foreground/70 max-w-[150px] truncate" title={item.keterangan || ""}>
                        {item.keterangan || "-"}
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDelete(item.id, "vocal")}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus Nilai Ini"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SIGNATURE SECTION FOR OFFICIAL PRINTING */}
      <div className="hidden print:block mt-12 pt-8 text-black">
        <p className="text-xs mb-8">
          Demikian Berita Acara Rekapitulasi Penilaian Dewan Juri Rock Goes To Campus XVII UKM Musik Universitas Pendidikan Ganesha ini dibuat secara sah, objektif, dan dapat dipertanggungjawabkan.
        </p>

        <div className="grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="font-bold mb-16">Perwakilan Dewan Juri,</p>
            <p className="font-bold underline">( ............................................ )</p>
          </div>
          <div>
            <p className="font-bold mb-16">Koordinator Lomba,</p>
            <p className="font-bold underline">Rifa Nur Aini</p>
          </div>
        </div>
      </div>
    </div>
  );
}
