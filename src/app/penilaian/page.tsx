"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Music, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Toast from "@/components/ui/Toast";

export default function PenilaianJuri() {
  const [bands, setBands] = useState<any[]>([]);
  const [juriesList, setJuriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Password Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);

  const [juryName, setJuryName] = useState("");
  const [scores, setScores] = useState<Record<string, {
    harmonisasi: string;
    aransemen: string;
    vokal: string;
    penampilan: string;
    keterangan: string;
  }>>({});
  const [isSaving, setIsSaving] = useState<string | null>(null); // Track which band is saving
  const [submittedBands, setSubmittedBands] = useState<string[]>([]); // Track successfully submitted bands

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [bandsRes, juriesRes] = await Promise.all([
      supabase.from("bands").select("*").order("created_at", { ascending: true }),
      supabase.from("juries").select("*").order("created_at", { ascending: true })
    ]);

    if (juriesRes.data) {
      setJuriesList(juriesRes.data);
    }
    if (bandsRes.data) {
      const data = bandsRes.data;
      setBands(data);
      // Initialize scores state
      const initialScores: any = {};
      data.forEach(band => {
        initialScores[band.id] = {
          harmonisasi: "",
          aransemen: "",
          vokal: "",
          penampilan: "",
          keterangan: ""
        };
      });
      setScores(initialScores);
    }
    setLoading(false);
  }

  const handleScoreChange = (bandId: string, field: string, value: string) => {
    // Basic validation to only allow numbers
    if (field !== 'keterangan' && value !== "" && !/^\d+$/.test(value)) return;

    // Prevent entering numbers greater than 100 for score fields
    if (field !== 'keterangan' && value !== "") {
      const num = parseInt(value);
      if (num > 100) return;
    }

    setScores(prev => ({
      ...prev,
      [bandId]: {
        ...prev[bandId],
        [field]: value
      }
    }));
  };

  const calculateTotal = (bandId: string) => {
    const s = scores[bandId];
    if (!s) return 0;
    const h = parseInt(s.harmonisasi) || 0;
    const a = parseInt(s.aransemen) || 0;
    const v = parseInt(s.vokal) || 0;
    const p = parseInt(s.penampilan) || 0;
    
    const total = (h * 0.40) + (a * 0.30) + (v * 0.20) + (p * 0.10);
    return Number(total.toFixed(2));
  };

  const calculateRawTotal = (bandId: string) => {
    const s = scores[bandId];
    if (!s) return 0;
    const h = parseInt(s.harmonisasi) || 0;
    const a = parseInt(s.aransemen) || 0;
    const v = parseInt(s.vokal) || 0;
    const p = parseInt(s.penampilan) || 0;
    
    return h + a + v + p;
  };

  const submitSingleBand = async (bandId: string) => {
    if (!juryName.trim()) {
      setToast({ message: "Mohon pilih Nama Juri terlebih dahulu di bagian atas.", type: "error" });
      return;
    }

    const s = scores[bandId];
    if (!s) return;

    const h = parseInt(s.harmonisasi);
    const a = parseInt(s.aransemen);
    const v = parseInt(s.vokal);
    const p = parseInt(s.penampilan);

    if (isNaN(h) || h < 50 || h > 100) {
      setToast({ message: "Skor Harmonisasi harus antara 50 - 100.", type: "error" });
      return;
    }
    if (isNaN(a) || a < 50 || a > 100) {
      setToast({ message: "Skor Aransemen harus antara 50 - 100.", type: "error" });
      return;
    }
    if (isNaN(v) || v < 50 || v > 100) {
      setToast({ message: "Skor Vokal harus antara 50 - 100.", type: "error" });
      return;
    }
    if (isNaN(p) || p < 50 || p > 100) {
      setToast({ message: "Skor Penampilan harus antara 50 - 100.", type: "error" });
      return;
    }

    setIsSaving(bandId);

    const payload = {
      jury_name: juryName,
      band_id: bandId,
      harmonisasi: h,
      aransemen: a,
      vokal: v,
      penampilan: p,
      total_score: (h * 0.40) + (a * 0.30) + (v * 0.20) + (p * 0.10),
      keterangan: s.keterangan
    };

    const { error } = await supabase.from("band_scores").insert([payload]);

    setIsSaving(null);

    if (error) {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    } else {
      setToast({ message: "Nilai berhasil disimpan!", type: "success" });
      setSubmittedBands(prev => [...prev, bandId]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "ROTASIX2026") {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ukmred/10 text-ukmred rounded-full flex items-center justify-center">
              <Music size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center mb-2">Akses Penilaian</h1>
          <p className="text-center text-foreground/60 mb-8 text-sm">Silakan masukkan kata sandi untuk mengakses halaman penjurian.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Kata Sandi..."
                className={`w-full px-4 py-3 border rounded-xl bg-background text-lg ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-border focus:border-ukmred focus:ring-ukmred'}`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">Kata sandi salah!</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-ukmred hover:bg-ukmred-dark text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar />

      <main className="pt-32 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">FORMAT PENILAIAN BAND</h1>
          <p className="text-foreground/60 text-lg">UKM Musik Undiksha</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-foreground/50">Memuat data peserta lomba...</div>
        ) : bands.length === 0 ? (
          <div className="text-center py-20 text-foreground/50 bg-card border border-border rounded-xl">
            Belum ada peserta lomba band yang terdaftar.
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-2xl max-w-xl">
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-foreground/80">
                Nama Juri
              </label>
              <select
                required
                value={juryName}
                onChange={(e) => setJuryName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-lg"
              >
                <option value="" disabled>-- Pilih Nama Juri --</option>
                {juriesList.map(juri => (
                  <option key={juri.id} value={juri.name}>{juri.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-xl text-sm flex items-start gap-3">
              <div className="mt-0.5 text-lg">⚠️</div>
              <div>
                <strong className="block mb-1 text-base">Perhatian untuk Juri</strong>
                Mohon berikan nilai dengan rentang <strong>50 hingga 100</strong> untuk setiap kriteria penilaian (Harmonisasi, Aransemen, Vokal, Penampilan).
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-ukmred text-white text-sm uppercase tracking-wide">
                      <th className="p-4 font-bold w-12 text-center border-r border-white/20">NO.</th>
                      <th className="p-4 font-bold border-r border-white/20 min-w-[150px]">NAMA BAND</th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">HARMONISASI<br/><span className="text-[10px] text-yellow-300">40%</span></th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">ARANSEMEN<br/><span className="text-[10px] text-yellow-300">30%</span></th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">VOKAL<br/><span className="text-[10px] text-yellow-300">20%</span></th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">PENAMPILAN<br/><span className="text-[10px] text-yellow-300">10%</span></th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">TOTAL<br/><span className="text-[10px] opacity-80">(MURNI)</span></th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">TOTAL<br/><span className="text-[10px] opacity-80">%</span></th>
                      <th className="p-4 font-bold min-w-[120px] border-r border-white/20">KET.</th>
                      <th className="p-4 font-bold w-24 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bands.map((band, index) => {
                      const s = scores[band.id] || {};
                      const total = calculateTotal(band.id);
                      const isSubmitted = submittedBands.includes(band.id);

                      return (
                        <tr key={band.id} className={`border-b border-border transition-colors ${isSubmitted ? 'bg-green-500/5' : 'hover:bg-background/50'}`}>
                          <td className="p-4 text-center font-medium border-r border-border">{index + 1}</td>
                          <td className="p-4 font-bold text-lg border-r border-border">{band.name}</td>
                          <td className="p-2 border-r border-border">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={s.harmonisasi || ""}
                              onChange={(e) => handleScoreChange(band.id, 'harmonisasi', e.target.value)}
                              disabled={isSubmitted}
                              className="w-full h-10 text-center font-bold text-base bg-background border border-transparent focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-md outline-none transition-all disabled:opacity-50"
                              placeholder="-"
                            />
                          </td>
                          <td className="p-2 border-r border-border">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={s.aransemen || ""}
                              onChange={(e) => handleScoreChange(band.id, 'aransemen', e.target.value)}
                              disabled={isSubmitted}
                              className="w-full h-10 text-center font-bold text-base bg-background border border-transparent focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-md outline-none transition-all disabled:opacity-50"
                              placeholder="-"
                            />
                          </td>
                          <td className="p-2 border-r border-border">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={s.vokal || ""}
                              onChange={(e) => handleScoreChange(band.id, 'vokal', e.target.value)}
                              disabled={isSubmitted}
                              className="w-full h-10 text-center font-bold text-base bg-background border border-transparent focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-md outline-none transition-all disabled:opacity-50"
                              placeholder="-"
                            />
                          </td>
                          <td className="p-2 border-r border-border">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={s.penampilan || ""}
                              onChange={(e) => handleScoreChange(band.id, 'penampilan', e.target.value)}
                              disabled={isSubmitted}
                              className="w-full h-10 text-center font-bold text-base bg-background border border-transparent focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-md outline-none transition-all disabled:opacity-50"
                              placeholder="-"
                            />
                          </td>
                          <td className="p-4 text-center font-bold text-lg border-r border-border">
                            {calculateRawTotal(band.id) > 0 ? calculateRawTotal(band.id) : "-"}
                          </td>
                          <td className="p-4 text-center font-black text-xl text-ukmred border-r border-border">
                            {total > 0 ? total : "-"}
                          </td>
                          <td className="p-2 border-r border-border">
                            <input
                              type="text"
                              value={s.keterangan || ""}
                              onChange={(e) => handleScoreChange(band.id, 'keterangan', e.target.value)}
                              disabled={isSubmitted}
                              className="w-full h-12 px-3 text-sm bg-background border border-transparent focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-md outline-none transition-all disabled:opacity-50"
                              placeholder="Catatan..."
                            />
                          </td>
                          <td className="p-2 text-center">
                            {isSubmitted ? (
                              <span className="inline-flex items-center gap-1 text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full text-sm font-bold w-full justify-center">
                                TERSIMPAN
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => submitSingleBand(band.id)}
                                disabled={isSaving === band.id}
                                className="w-full bg-ukmred hover:bg-ukmred-dark text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50 text-sm h-10"
                              >
                                {isSaving === band.id ? "..." : (
                                  <>
                                    <Save size={16} />
                                    Simpan
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-background/80 p-4 border-t border-border flex justify-center items-center">
                <div className="font-bold text-foreground/70 flex items-center gap-2">
                  <span className="bg-card px-3 py-1 rounded-md border border-border">RENTANG SKOR : 50 - 100</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
