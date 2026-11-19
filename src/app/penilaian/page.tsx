"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Music, 
  Mic2, 
  Save, 
  CheckCircle2, 
  Info, 
  ExternalLink, 
  Search, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Trophy,
  Key,
  LogOut,
  UserCheck,
  ShieldCheck,
  Loader2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Toast from "@/components/ui/Toast";
import { 
  BAND_CRITERIA, 
  VOCAL_CRITERIA, 
  calculateBandScores, 
  calculateVocalScores 
} from "@/lib/competition-constants";

export default function PenilaianJuri() {
  const [activeTab, setActiveTab] = useState<"band" | "vocal">("band");

  // Data States
  const [bands, setBands] = useState<any[]>([]);
  const [vocals, setVocals] = useState<any[]>([]);
  const [juriesList, setJuriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication & Jury Token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loggedInJury, setLoggedInJury] = useState<any>(null);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);

  // Selected Jury
  const [juryName, setJuryName] = useState("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Show Rubric Guide
  const [showRubric, setShowRubric] = useState(false);

  // Band Scores State: { [bandId]: { musikalitas, aransemen, vokal, instrumen, kekompakan, audio, penampilan, keterangan } }
  const [bandScores, setBandScores] = useState<Record<string, Record<string, string>>>({});
  // Vocal Scores State: { [vocalId]: { intonasi, teknik, penghayatan, artikulasi, penampilan, kreativitas, keterangan } }
  const [vocalScores, setVocalScores] = useState<Record<string, Record<string, string>>>({});

  // Existing score IDs from DB to allow UPDATE instead of duplicate inserts:
  const [existingBandScoreIds, setExistingBandScoreIds] = useState<Record<string, string>>({});
  const [existingVocalScoreIds, setExistingVocalScoreIds] = useState<Record<string, string>>({});

  // Loading & submission state
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();

    // Check URL query param (?token=...) or saved token in sessionStorage
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      const savedToken = sessionStorage.getItem("rgc_jury_token");
      const initialToken = urlToken || savedToken;

      if (initialToken) {
        setTokenInput(initialToken);
        validateAndLogin(initialToken);
      }
    }
  }, []);

  // When jury changes, load any previously submitted scores by this jury
  useEffect(() => {
    if (juryName) {
      loadJuryScores(juryName);
    }
  }, [juryName]);

  async function fetchInitialData() {
    setLoading(true);
    const [bandsRes, vocalsRes, juriesRes] = await Promise.all([
      supabase.from("bands").select("*").order("nomor_undi", { ascending: true, nullsFirst: false }),
      supabase.from("vocal_solos").select("*").order("nomor_undi", { ascending: true, nullsFirst: false }),
      supabase.from("juries").select("*").order("name", { ascending: true }),
    ]);

    if (juriesRes.data) {
      setJuriesList(juriesRes.data);
    }

    if (bandsRes.data) {
      setBands(bandsRes.data);
      const initialBandScores: any = {};
      bandsRes.data.forEach((b) => {
        initialBandScores[b.id] = {
          musikalitas: "",
          aransemen: "",
          vokal: "",
          instrumen: "",
          kekompakan: "",
          audio: "",
          penampilan: "",
          keterangan: "",
        };
      });
      setBandScores(initialBandScores);
    }

    if (vocalsRes.data) {
      setVocals(vocalsRes.data);
      const initialVocalScores: any = {};
      vocalsRes.data.forEach((v) => {
        initialVocalScores[v.id] = {
          intonasi: "",
          teknik: "",
          penghayatan: "",
          artikulasi: "",
          penampilan: "",
          kreativitas: "",
          keterangan: "",
        };
      });
      setVocalScores(initialVocalScores);
    }

    setLoading(false);
  }

  async function loadJuryScores(currentJury: string) {
    if (!currentJury) return;

    // Load band scores for this jury
    const { data: bScores } = await supabase
      .from("band_scores")
      .select("*")
      .eq("jury_name", currentJury);

    if (bScores) {
      const bMap: Record<string, string> = {};
      setBandScores((prev) => {
        const next = { ...prev };
        bScores.forEach((s) => {
          bMap[s.band_id] = s.id;
          next[s.band_id] = {
            musikalitas: s.musikalitas ? String(s.musikalitas) : "",
            aransemen: s.aransemen ? String(s.aransemen) : "",
            vokal: s.vokal ? String(s.vokal) : "",
            instrumen: s.instrumen ? String(s.instrumen) : "",
            kekompakan: s.kekompakan ? String(s.kekompakan) : "",
            audio: s.audio ? String(s.audio) : "",
            penampilan: s.penampilan ? String(s.penampilan) : "",
            keterangan: s.keterangan || "",
          };
        });
        return next;
      });
      setExistingBandScoreIds(bMap);
    }

    // Load vocal scores for this jury
    const { data: vScores } = await supabase
      .from("vocal_scores")
      .select("*")
      .eq("jury_name", currentJury);

    if (vScores) {
      const vMap: Record<string, string> = {};
      setVocalScores((prev) => {
        const next = { ...prev };
        vScores.forEach((s) => {
          vMap[s.vocal_id] = s.id;
          next[s.vocal_id] = {
            intonasi: s.intonasi ? String(s.intonasi) : "",
            teknik: s.teknik ? String(s.teknik) : "",
            penghayatan: s.penghayatan ? String(s.penghayatan) : "",
            artikulasi: s.artikulasi ? String(s.artikulasi) : "",
            penampilan: s.penampilan ? String(s.penampilan) : "",
            kreativitas: s.kreativitas ? String(s.kreativitas) : "",
            keterangan: s.keterangan || "",
          };
        });
        return next;
      });
      setExistingVocalScoreIds(vMap);
    }
  }

  // Handle Score Input
  const handleScoreChange = (
    type: "band" | "vocal",
    participantId: string,
    field: string,
    value: string
  ) => {
    if (field !== "keterangan") {
      // Numbers only
      if (value !== "" && !/^\d+$/.test(value)) return;
      // Max 100
      if (value !== "" && parseInt(value) > 100) return;
    }

    if (type === "band") {
      setBandScores((prev) => ({
        ...prev,
        [participantId]: {
          ...(prev[participantId] || {}),
          [field]: value,
        },
      }));
    } else {
      setVocalScores((prev) => ({
        ...prev,
        [participantId]: {
          ...(prev[participantId] || {}),
          [field]: value,
        },
      }));
    }
  };

  // Submit Band Score
  const submitBandScore = async (bandId: string) => {
    if (!juryName.trim()) {
      setToast({ message: "Pilih Nama Juri terlebih dahulu di bagian atas.", type: "error" });
      return;
    }

    const s = bandScores[bandId];
    if (!s) return;

    // Validate all 7 criteria
    for (const crit of BAND_CRITERIA) {
      const val = parseInt(s[crit.key]);
      if (isNaN(val) || val < 50 || val > 100) {
        setToast({
          message: `Nilai "${crit.label}" harus diisi antara 50 - 100.`,
          type: "error",
        });
        return;
      }
    }

    const { rawTotal, weightedTotal } = calculateBandScores(s);

    setIsSaving(bandId);

    const payload = {
      jury_name: juryName,
      band_id: bandId,
      musikalitas: parseInt(s.musikalitas),
      aransemen: parseInt(s.aransemen),
      vokal: parseInt(s.vokal),
      instrumen: parseInt(s.instrumen),
      kekompakan: parseInt(s.kekompakan),
      audio: parseInt(s.audio),
      penampilan: parseInt(s.penampilan),
      total_murni: rawTotal,
      total_score: weightedTotal,
      keterangan: s.keterangan || "",
    };

    let error;
    const existingId = existingBandScoreIds[bandId];

    if (existingId) {
      const res = await supabase.from("band_scores").update(payload).eq("id", existingId);
      error = res.error;
    } else {
      const res = await supabase.from("band_scores").insert([payload]).select("id").single();
      error = res.error;
      if (res.data) {
        setExistingBandScoreIds((prev) => ({ ...prev, [bandId]: res.data.id }));
      }
    }

    setIsSaving(null);

    if (error) {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    } else {
      setToast({
        message: existingId ? "Nilai berhasil diperbarui!" : "Nilai berhasil disimpan!",
        type: "success",
      });
    }
  };

  // Submit Vocal Score
  const submitVocalScore = async (vocalId: string) => {
    if (!juryName.trim()) {
      setToast({ message: "Pilih Nama Juri terlebih dahulu di bagian atas.", type: "error" });
      return;
    }

    const s = vocalScores[vocalId];
    if (!s) return;

    // Validate all 6 criteria
    for (const crit of VOCAL_CRITERIA) {
      const val = parseInt(s[crit.key]);
      if (isNaN(val) || val < 50 || val > 100) {
        setToast({
          message: `Nilai "${crit.label}" harus diisi antara 50 - 100.`,
          type: "error",
        });
        return;
      }
    }

    const { rawTotal, weightedTotal } = calculateVocalScores(s);

    setIsSaving(vocalId);

    const payload = {
      jury_name: juryName,
      vocal_id: vocalId,
      intonasi: parseInt(s.intonasi),
      teknik: parseInt(s.teknik),
      penghayatan: parseInt(s.penghayatan),
      artikulasi: parseInt(s.artikulasi),
      penampilan: parseInt(s.penampilan),
      kreativitas: parseInt(s.kreativitas),
      total_murni: rawTotal,
      total_score: weightedTotal,
      keterangan: s.keterangan || "",
    };

    let error;
    const existingId = existingVocalScoreIds[vocalId];

    if (existingId) {
      const res = await supabase.from("vocal_scores").update(payload).eq("id", existingId);
      error = res.error;
    } else {
      const res = await supabase.from("vocal_scores").insert([payload]).select("id").single();
      error = res.error;
      if (res.data) {
        setExistingVocalScoreIds((prev) => ({ ...prev, [vocalId]: res.data.id }));
      }
    }

    setIsSaving(null);

    if (error) {
      setToast({ message: "Gagal menyimpan: " + error.message, type: "error" });
    } else {
      setToast({
        message: existingId ? "Nilai berhasil diperbarui!" : "Nilai berhasil disimpan!",
        type: "success",
      });
    }
  };

  // Token & Master Login Handlers
  const validateAndLogin = async (rawToken: string) => {
    const trimmed = rawToken.trim();
    if (!trimmed) {
      setTokenError("Silakan masukkan token akses juri.");
      return;
    }

    setIsVerifying(true);
    setTokenError("");

    // Support master admin bypass
    if (trimmed === "RGCXVII2026") {
      setIsAuthenticated(true);
      setIsMasterAdmin(true);
      setLoggedInJury(null);
      setIsVerifying(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("juries")
        .select("*")
        .ilike("token", trimmed)
        .maybeSingle();

      if (error || !data) {
        setTokenError("Token juri tidak valid atau tidak terdaftar. Hubungi panitia.");
        setIsVerifying(false);
        return;
      }

      // Valid jury token found!
      setLoggedInJury(data);
      setJuryName(data.name);
      setIsAuthenticated(true);
      setIsMasterAdmin(false);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("rgc_jury_token", data.token);
      }
    } catch (err: any) {
      setTokenError("Terjadi kesalahan saat memvalidasi token: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndLogin(tokenInput);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInJury(null);
    setJuryName("");
    setIsMasterAdmin(false);
    setTokenInput("");
    setTokenError("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("rgc_jury_token");
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname);
    }
  };

  // Filtered lists
  const filteredBands = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return bands.filter(
      (b) =>
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.nomor_undi && b.nomor_undi.toLowerCase().includes(q)) ||
        (b.song_title && b.song_title.toLowerCase().includes(q))
    );
  }, [bands, searchQuery]);

  const filteredVocals = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vocals.filter(
      (v) =>
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.nomor_undi && v.nomor_undi.toLowerCase().includes(q)) ||
        (v.song_title && v.song_title.toLowerCase().includes(q))
    );
  }, [vocals, searchQuery]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ukmred via-yellow-500 to-ukmred" />
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-ukmred/10 text-ukmred rounded-2xl flex items-center justify-center shadow-inner">
              <Key size={38} />
            </div>
          </div>
          <div className="text-center mb-6">
            <span className="text-xs font-black tracking-widest text-ukmred uppercase bg-ukmred/10 px-3 py-1 rounded-full border border-ukmred/20">
              Rock Goes To Campus XVII
            </span>
            <h1 className="text-2xl font-black mt-3">Portal Penjurian</h1>
            <p className="text-foreground/60 text-sm mt-1">
              UKM Musik Universitas Pendidikan Ganesha
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                Token Akses Juri
              </label>
              <input
                type="text"
                required
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  if (tokenError) setTokenError("");
                }}
                placeholder="Contoh: JURI-RAMA-77"
                className={`w-full px-4 py-3 border rounded-xl bg-background text-base font-mono font-bold tracking-wider uppercase focus:outline-none transition-all ${
                  tokenError
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-border focus:border-ukmred focus:ring-2 focus:ring-ukmred/20"
                }`}
              />
              {tokenError ? (
                <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{tokenError}</span>
                </p>
              ) : (
                <p className="text-xs text-foreground/50 mt-1.5">
                  Masukkan token pribadi yang dibagikan panitia untuk membuka lembar penilaian Anda.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-ukmred hover:bg-ukmred-dark text-white px-4 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi Token...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Masuk ke Lembar Penilaian</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN JUDGING INTERFACE
  return (
    <div className="min-h-screen bg-background relative text-foreground">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Navbar />

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* HEADER TITLE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-ukmred/10 text-ukmred px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-ukmred/20 mb-3">
            <Trophy size={14} /> Rock Goes To Campus XVII
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
            LEMBAR PENILAIAN DEWAN JURI
          </h1>
          <p className="text-foreground/60 text-sm md:text-base max-w-2xl mx-auto">
            Sistem penilaian resmi untuk Lomba Band Nasional dan Lomba Vokal Solo Nasional.
            Rentang skor setiap kriteria adalah <strong className="text-ukmred">50 – 100</strong>.
          </p>
        </div>

        {/* CONTROLS BAR: JURY SELECTOR & COMPETITION TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-6">
          {/* JURY BADGE / SELECTOR */}
          <div className="lg:col-span-5 bg-card border border-border p-3.5 rounded-2xl shadow-sm">
            {loggedInJury ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-ukmred/10 text-ukmred flex items-center justify-center shrink-0">
                    <UserCheck size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-ukmred flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Dewan Juri Terverifikasi
                    </span>
                    <h2 className="text-base font-black text-foreground truncate">
                      {juryName}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border hover:border-red-500/40 hover:bg-red-500/10 text-foreground/70 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  title="Keluar / Ganti Juri"
                >
                  <LogOut size={13} />
                  <span>Ganti Juri</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70">
                    Dewan Juri Yang Bertugas *
                  </label>
                  {isMasterAdmin && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-[10px] text-red-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <LogOut size={10} /> Logout Master
                    </button>
                  )}
                </div>
                <select
                  required
                  value={juryName}
                  onChange={(e) => setJuryName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background font-bold text-base focus:ring-2 focus:ring-ukmred/20 focus:border-ukmred outline-none"
                >
                  <option value="" disabled>-- Pilih Nama Dewan Juri --</option>
                  {juriesList.map((juri) => (
                    <option key={juri.id} value={juri.name}>
                      {juri.name} {juri.token ? `(${juri.token})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* COMPETITION TABS */}
          <div className="lg:col-span-7 flex flex-wrap sm:flex-nowrap gap-2 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab("band")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === "band"
                  ? "bg-ukmred text-white shadow-md shadow-ukmred/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/80"
              }`}
            >
              <Music size={18} />
              <span>LOMBA BAND NASIONAL</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "band" ? "bg-white/20 text-white" : "bg-foreground/10 text-foreground/70"
              }`}>
                {bands.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("vocal")}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === "vocal"
                  ? "bg-ukmred text-white shadow-md shadow-ukmred/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/80"
              }`}
            >
              <Mic2 size={18} />
              <span>LOMBA VOKAL SOLO</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "vocal" ? "bg-white/20 text-white" : "bg-foreground/10 text-foreground/70"
              }`}>
                {vocals.length}
              </span>
            </button>
          </div>
        </div>

        {/* SEARCH & RUBRIC TOGGLE */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari peserta ${activeTab === "band" ? "band" : "vokal"} atau judul lagu...`}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ukmred/20 focus:border-ukmred"
            />
          </div>

          <button
            onClick={() => setShowRubric(!showRubric)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-background text-sm font-semibold transition-colors"
          >
            <Info size={16} className="text-ukmred" />
            <span>Petunjuk Teknis & Rubrik Penilaian</span>
            {showRubric ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* RUBRIC ACCORDION */}
        {showRubric && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground mb-3">
              <Info className="text-ukmred" size={20} />
              Kriteria Penilaian Resmi Berdasarkan Petunjuk Teknis RGC XVII:
            </h3>

            {activeTab === "band" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BAND_CRITERIA.map((c, i) => (
                  <div key={c.key} className="p-3.5 rounded-xl bg-background/70 border border-border text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-foreground">
                        {i + 1}. {c.label}
                      </span>
                      <span className="font-black text-ukmred bg-ukmred/10 px-2 py-0.5 rounded-md">
                        {c.weight}%
                      </span>
                    </div>
                    <p className="text-foreground/70 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VOCAL_CRITERIA.map((c, i) => (
                  <div key={c.key} className="p-3.5 rounded-xl bg-background/70 border border-border text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-foreground">
                        {i + 1}. {c.label}
                      </span>
                      <span className="font-black text-ukmred bg-ukmred/10 px-2 py-0.5 rounded-md">
                        {c.weight}%
                      </span>
                    </div>
                    <p className="text-foreground/70 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-foreground/60 gap-2">
              <span>⚠️ Standar video: Live record, tanpa edit/mixing/mastering, 1 angle kamera landscape, durasi maks 7 menit.</span>
              <span className="font-bold text-foreground">Skala Nilai: 50 s/d 100</span>
            </div>
          </div>
        )}

        {/* WARNING ALERT IF NO JURY SELECTED */}
        {!juryName && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <span>
              Silakan pilih <strong>Nama Dewan Juri</strong> pada dropdown di atas sebelum mengisi dan menyimpan penilaian.
            </span>
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="text-center py-20 text-foreground/50 bg-card border border-border rounded-2xl">
            <RefreshCw className="animate-spin mx-auto mb-2 text-ukmred" size={28} />
            Memuat data peserta dan sistem penilaian...
          </div>
        ) : activeTab === "band" ? (
          /* ======================================================== */
          /* TAB 1: LOMBA BAND NASIONAL                               */
          /* ======================================================== */
          filteredBands.length === 0 ? (
            <div className="text-center py-20 text-foreground/50 bg-card border border-border rounded-2xl">
              {searchQuery ? "Tidak ada band yang sesuai kata kunci." : "Belum ada peserta Lomba Band yang terdaftar."}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-ukmred text-white text-xs uppercase tracking-wide">
                      <th className="p-3 font-bold w-14 text-center border-r border-white/20">NO. UNDI</th>
                      <th className="p-3 font-bold min-w-[180px] border-r border-white/20">NAMA BAND & LAGU</th>
                      {BAND_CRITERIA.map((c) => (
                        <th key={c.key} className="p-2 font-bold w-24 text-center border-r border-white/20">
                          <span className="block leading-tight text-[11px]">{c.label}</span>
                          <span className="text-[10px] text-yellow-300 font-extrabold">{c.weight}%</span>
                        </th>
                      ))}
                      <th className="p-2 font-bold w-20 text-center border-r border-white/20 text-xs">
                        TOTAL<br /><span className="text-[10px] opacity-80">(MURNI)</span>
                      </th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">
                        TOTAL<br /><span className="text-[10px] text-yellow-300 font-extrabold">(BOBOT %)</span>
                      </th>
                      <th className="p-3 font-bold min-w-[140px] border-r border-white/20">CATATAN JURI</th>
                      <th className="p-3 font-bold w-28 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBands.map((band) => {
                      const s = bandScores[band.id] || {};
                      const { rawTotal, weightedTotal } = calculateBandScores(s);
                      const isSubmitted = !!existingBandScoreIds[band.id];

                      return (
                        <tr
                          key={band.id}
                          className={`border-b border-border transition-colors ${
                            isSubmitted ? "bg-green-500/5 hover:bg-green-500/10" : "hover:bg-background/60"
                          }`}
                        >
                          {/* NOMOR UNDI */}
                          <td className="p-3 text-center border-r border-border font-mono font-bold text-base text-ukmred">
                            {band.nomor_undi || "-"}
                          </td>

                          {/* NAMA BAND & DETAIL */}
                          <td className="p-3 border-r border-border">
                            <div className="font-bold text-base text-foreground mb-0.5">{band.name}</div>
                            <div className="text-xs text-foreground/60 mb-1.5">
                              Lagu: <span className="font-semibold text-foreground/90">{band.song_title || "Belum dipilih"}</span>
                            </div>
                            {band.video_url && (
                              <a
                                href={band.video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                <ExternalLink size={12} /> Buka Video Karya
                              </a>
                            )}
                          </td>

                          {/* 7 CRITERIA INPUTS */}
                          {BAND_CRITERIA.map((c) => (
                            <td key={c.key} className="p-2 border-r border-border">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={s[c.key] || ""}
                                onChange={(e) => handleScoreChange("band", band.id, c.key, e.target.value)}
                                className="w-full h-10 text-center font-bold text-sm bg-background border border-border focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-lg outline-none transition-all placeholder:text-foreground/20"
                                placeholder="50-100"
                              />
                            </td>
                          ))}

                          {/* RAW TOTAL */}
                          <td className="p-2 text-center font-bold text-base text-foreground/70 border-r border-border">
                            {rawTotal > 0 ? rawTotal : "-"}
                          </td>

                          {/* WEIGHTED TOTAL */}
                          <td className="p-2 text-center font-black text-lg text-ukmred border-r border-border">
                            {weightedTotal > 0 ? weightedTotal : "-"}
                          </td>

                          {/* NOTES */}
                          <td className="p-2 border-r border-border">
                            <textarea
                              rows={2}
                              value={s.keterangan || ""}
                              onChange={(e) => handleScoreChange("band", band.id, "keterangan", e.target.value)}
                              placeholder="Komentar/catatan teknis..."
                              className="w-full px-2.5 py-1.5 text-xs bg-background border border-border focus:border-ukmred rounded-lg outline-none resize-none placeholder:text-foreground/30"
                            />
                          </td>

                          {/* ACTION BUTTON */}
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => submitBandScore(band.id)}
                              disabled={isSaving === band.id}
                              className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs shadow-sm active:scale-95 disabled:opacity-50 ${
                                isSubmitted
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-ukmred hover:bg-ukmred-dark text-white"
                              }`}
                            >
                              {isSaving === band.id ? (
                                <RefreshCw className="animate-spin" size={14} />
                              ) : isSubmitted ? (
                                <>
                                  <CheckCircle2 size={14} /> Update
                                </>
                              ) : (
                                <>
                                  <Save size={14} /> Simpan
                                </>
                              )}
                            </button>
                            {isSubmitted && (
                              <span className="block text-[10px] text-green-600 font-bold mt-1 uppercase">
                                Tersimpan
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-background/80 p-3.5 border-t border-border flex justify-between items-center text-xs text-foreground/70 font-semibold px-6">
                <span>Total Peserta Band: {filteredBands.length}</span>
                <span className="bg-card px-3 py-1 rounded-lg border border-border">
                  SKALA NILAI : 50 – 100
                </span>
              </div>
            </div>
          )
        ) : (
          /* ======================================================== */
          /* TAB 2: LOMBA VOKAL SOLO NASIONAL                         */
          /* ======================================================== */
          filteredVocals.length === 0 ? (
            <div className="text-center py-20 text-foreground/50 bg-card border border-border rounded-2xl">
              {searchQuery ? "Tidak ada peserta vokal yang sesuai kata kunci." : "Belum ada peserta Lomba Vokal Solo yang terdaftar."}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-ukmred text-white text-xs uppercase tracking-wide">
                      <th className="p-3 font-bold w-14 text-center border-r border-white/20">NO. UNDI</th>
                      <th className="p-3 font-bold min-w-[180px] border-r border-white/20">NAMA PESERTA & LAGU</th>
                      {VOCAL_CRITERIA.map((c) => (
                        <th key={c.key} className="p-2 font-bold w-24 text-center border-r border-white/20">
                          <span className="block leading-tight text-[11px]">{c.label}</span>
                          <span className="text-[10px] text-yellow-300 font-extrabold">{c.weight}%</span>
                        </th>
                      ))}
                      <th className="p-2 font-bold w-20 text-center border-r border-white/20 text-xs">
                        TOTAL<br /><span className="text-[10px] opacity-80">(MURNI)</span>
                      </th>
                      <th className="p-2 font-bold w-24 text-center border-r border-white/20 text-xs">
                        TOTAL<br /><span className="text-[10px] text-yellow-300 font-extrabold">(BOBOT %)</span>
                      </th>
                      <th className="p-3 font-bold min-w-[140px] border-r border-white/20">CATATAN JURI</th>
                      <th className="p-3 font-bold w-28 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVocals.map((vocal) => {
                      const s = vocalScores[vocal.id] || {};
                      const { rawTotal, weightedTotal } = calculateVocalScores(s);
                      const isSubmitted = !!existingVocalScoreIds[vocal.id];

                      return (
                        <tr
                          key={vocal.id}
                          className={`border-b border-border transition-colors ${
                            isSubmitted ? "bg-green-500/5 hover:bg-green-500/10" : "hover:bg-background/60"
                          }`}
                        >
                          {/* NOMOR UNDI */}
                          <td className="p-3 text-center border-r border-border font-mono font-bold text-base text-ukmred">
                            {vocal.nomor_undi || "-"}
                          </td>

                          {/* NAMA PESERTA & DETAIL */}
                          <td className="p-3 border-r border-border">
                            <div className="font-bold text-base text-foreground mb-0.5">{vocal.name}</div>
                            <div className="text-xs text-foreground/60 mb-1.5">
                              Lagu: <span className="font-semibold text-foreground/90">{vocal.song_title || "Belum dipilih"}</span>
                            </div>
                            {vocal.video_url && (
                              <a
                                href={vocal.video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded font-medium transition-colors"
                              >
                                <ExternalLink size={12} /> Buka Video Karya
                              </a>
                            )}
                          </td>

                          {/* 6 CRITERIA INPUTS */}
                          {VOCAL_CRITERIA.map((c) => (
                            <td key={c.key} className="p-2 border-r border-border">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={s[c.key] || ""}
                                onChange={(e) => handleScoreChange("vocal", vocal.id, c.key, e.target.value)}
                                className="w-full h-10 text-center font-bold text-sm bg-background border border-border focus:border-ukmred focus:ring-1 focus:ring-ukmred rounded-lg outline-none transition-all placeholder:text-foreground/20"
                                placeholder="50-100"
                              />
                            </td>
                          ))}

                          {/* RAW TOTAL */}
                          <td className="p-2 text-center font-bold text-base text-foreground/70 border-r border-border">
                            {rawTotal > 0 ? rawTotal : "-"}
                          </td>

                          {/* WEIGHTED TOTAL */}
                          <td className="p-2 text-center font-black text-lg text-ukmred border-r border-border">
                            {weightedTotal > 0 ? weightedTotal : "-"}
                          </td>

                          {/* NOTES */}
                          <td className="p-2 border-r border-border">
                            <textarea
                              rows={2}
                              value={s.keterangan || ""}
                              onChange={(e) => handleScoreChange("vocal", vocal.id, "keterangan", e.target.value)}
                              placeholder="Komentar/catatan teknis..."
                              className="w-full px-2.5 py-1.5 text-xs bg-background border border-border focus:border-ukmred rounded-lg outline-none resize-none placeholder:text-foreground/30"
                            />
                          </td>

                          {/* ACTION BUTTON */}
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => submitVocalScore(vocal.id)}
                              disabled={isSaving === vocal.id}
                              className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-xs shadow-sm active:scale-95 disabled:opacity-50 ${
                                isSubmitted
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-ukmred hover:bg-ukmred-dark text-white"
                              }`}
                            >
                              {isSaving === vocal.id ? (
                                <RefreshCw className="animate-spin" size={14} />
                              ) : isSubmitted ? (
                                <>
                                  <CheckCircle2 size={14} /> Update
                                </>
                              ) : (
                                <>
                                  <Save size={14} /> Simpan
                                </>
                              )}
                            </button>
                            {isSubmitted && (
                              <span className="block text-[10px] text-green-600 font-bold mt-1 uppercase">
                                Tersimpan
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-background/80 p-3.5 border-t border-border flex justify-between items-center text-xs text-foreground/70 font-semibold px-6">
                <span>Total Peserta Vokal Solo: {filteredVocals.length}</span>
                <span className="bg-card px-3 py-1 rounded-lg border border-border">
                  SKALA NILAI : 50 – 100
                </span>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
