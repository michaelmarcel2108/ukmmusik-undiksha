import { Metadata } from "next";
import Link from "next/link";
import {
  Crown,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  BookOpen,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CORE_ROLES_CONFIG, ADVISORS_CONFIG } from "@/lib/core-constants";

export const metadata: Metadata = {
  title: "Dewan Pengurus Inti (BPH) | UKM Musik Undiksha",
  description: "Susunan Kepengurusan Dewan Pengurus Inti (BPH) UKM Musik Universitas Pendidikan Ganesha Masa Bakti 2026/2027.",
};

export const revalidate = 60;

export default async function PengurusIntiPage() {
  // Fetch dynamic core members from database if exists
  const { data: dbCoreMembers } = await supabase
    .from("core_members")
    .select("*")
    .order("order_index", { ascending: true });

  // Map each role config with database entries if available
  const rolesWithData = CORE_ROLES_CONFIG.map((config) => {
    const foundInDb = dbCoreMembers?.find(
      (m) => m.role.toLowerCase().trim() === config.role.toLowerCase().trim() ||
        m.role.toLowerCase().includes(config.role.toLowerCase())
    );

    return {
      ...config,
      currentName: foundInDb?.name || config.defaultName,
      photoUrl: foundInDb?.photo_url || config.photoUrl,
      bio: foundInDb?.bio || config.description,
      instagram: foundInDb?.instagram_url,
    };
  });

  const ketua = rolesWithData.find((r) => r.key === "ketua-umum");
  const wakil = rolesWithData.find((r) => r.key === "wakil-ketua");
  const sekretarisList = rolesWithData.filter((r) => r.key.startsWith("sekretaris"));
  const bendaharaList = rolesWithData.filter((r) => r.key.startsWith("bendahara"));

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-ukmred bg-ukmred/10 border border-ukmred/20 rounded-full mb-4 shadow-sm">
            <Crown size={15} /> BADAN PENGURUS HARIAN (BPH) • MASA BAKTI 2026/2027
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-4 leading-tight">
            Dewan <span className="text-ukmred">Pengurus Inti</span>
          </h1>
          <div className="h-1.5 w-24 bg-ukmred mx-auto rounded-full mb-6" />

          <p className="text-foreground/75 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Berdasarkan Ketetapan Sidang Rapat Kerja UKM Musik Undiksha No. 03/TAP/SIDANG RAKER/07/VII/2026,
            Dewan Pengurus Inti memegang peranan pimpinan eksekutif tertinggi yang menaungi seluruh fungsionaris dan 4 Bidang Operasional.
          </p>
        </div>

        {/* PELINDUNG, PENGARAH & PEMBINA */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-ukmred flex items-center justify-center gap-1.5 mb-1">
              <GraduationCap size={16} /> Kelembagaan Universitas
            </span>
            <h2 className="text-2xl font-black">Pelindung, Pengarah & Pembina</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ADVISORS_CONFIG.map((advisor, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-3xl p-6 text-center hover:border-ukmred/40 transition-all shadow-sm flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-background border-2 border-border mb-4 shadow-md">
                  <img src={advisor.photoUrl} alt={advisor.name} className="w-full h-full object-cover object-top" />
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-ukmred/10 text-ukmred mb-2">
                  {advisor.role}
                </span>
                <h3 className="text-lg font-black text-foreground mb-1 leading-snug">
                  {advisor.name}
                </h3>
                <p className="text-xs text-foreground/60 font-medium">
                  {advisor.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HIERARCHICAL LEADERSHIP STRUCTURE */}
        <div className="space-y-12 mb-24">

          {/* LEVEL 1: KETUA UMUM */}
          {ketua && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border-2 border-ukmred/40 hover:border-ukmred rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ukmred/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative shrink-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-background border-2 border-border shadow-md group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={ketua.photoUrl}
                        alt={ketua.currentName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-ukmred text-white flex items-center justify-center shadow-lg">
                      <Crown size={20} />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-ukmred text-white mb-2 shadow-sm">
                      {ketua.badge}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1">
                      {ketua.currentName}
                    </h2>
                    <p className="text-ukmred font-bold text-sm uppercase tracking-wider mb-4">
                      {ketua.title}
                    </p>
                    <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                      {ketua.description}
                    </p>

                    {ketua.instagram && (
                      <a
                        href={ketua.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-ukmred transition-colors"
                      >
                        <Globe size={14} /> Profil Media Sosial
                      </a>
                    )}
                  </div>
                </div>

                {/* Tugas Pokok Ketua */}
                <div className="mt-6 pt-6 border-t border-border">
                  <span className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-3">
                    Fungsi & Tanggung Jawab Utama:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground/80">
                    {ketua.responsibilities.map((res, i) => (
                      <div key={i} className="flex items-start gap-2 bg-background/50 p-2.5 rounded-xl border border-border">
                        <CheckCircle2 size={15} className="text-ukmred shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2: WAKIL KETUA */}
          {wakil && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border hover:border-ukmred/50 rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative shrink-0">
                    <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-background border border-border shadow-md group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={wakil.photoUrl}
                        alt={wakil.currentName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -top-2.5 -right-2.5 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                      <ShieldCheck size={18} />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-2">
                      {wakil.badge}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-foreground mb-1">
                      {wakil.currentName}
                    </h2>
                    <p className="text-blue-500 font-bold text-sm uppercase tracking-wider mb-3">
                      {wakil.title}
                    </p>
                    <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                      {wakil.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <span className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-3">
                    Fungsi & Tanggung Jawab Utama:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground/80">
                    {wakil.responsibilities.map((res, i) => (
                      <div key={i} className="flex items-start gap-2 bg-background/50 p-2.5 rounded-xl border border-border">
                        <CheckCircle2 size={15} className="text-blue-500 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 3: SEKRETARIS (1 & 2) */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ukmred inline-block" />
              Kesekretariatan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sekretarisList.map((sec) => (
                <div
                  key={sec.key}
                  className="bg-card border border-border hover:border-ukmred/50 rounded-3xl p-6 shadow-md transition-all duration-300 flex flex-col group h-full"
                >
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-background border border-border shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={sec.photoUrl}
                        alt={sec.currentName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-ukmred/10 text-ukmred mb-1">
                        {sec.role}
                      </span>
                      <h4 className="text-lg font-black text-foreground leading-tight mb-0.5">
                        {sec.currentName}
                      </h4>
                      <p className="text-xs text-foreground/60 font-medium">
                        {sec.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/70 text-xs leading-relaxed mb-4">
                    {sec.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-foreground/50 mb-2">
                      Fungsi Kerja:
                    </span>
                    <div className="space-y-1.5 text-xs text-foreground/80">
                      {sec.responsibilities.slice(0, 2).map((res, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-ukmred font-bold">•</span>
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEVEL 4: BENDAHARA (1 & 2) */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Kebendaharaan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bendaharaList.map((ben) => (
                <div
                  key={ben.key}
                  className="bg-card border border-border hover:border-emerald-500/50 rounded-3xl p-6 shadow-md transition-all duration-300 flex flex-col group h-full"
                >
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-background border border-border shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={ben.photoUrl}
                        alt={ben.currentName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 mb-1">
                        {ben.role}
                      </span>
                      <h4 className="text-lg font-black text-foreground leading-tight mb-0.5">
                        {ben.currentName}
                      </h4>
                      <p className="text-xs text-foreground/60 font-medium">
                        {ben.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/70 text-xs leading-relaxed mb-4">
                    {ben.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-foreground/50 mb-2">
                      Fungsi Kerja:
                    </span>
                    <div className="space-y-1.5 text-xs text-foreground/80">
                      {ben.responsibilities.slice(0, 2).map((res, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BRIDGING TO 4 OPERATIONAL DIVISIONS */}
        <div className="bg-gradient-to-r from-card via-card to-ukmred/10 border border-border rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-ukmred flex items-center gap-1.5 mb-2">
              <Briefcase size={16} /> Struktur Pelaksana Program
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Menaungi 4 Bidang Operasional
            </h2>
            <p className="text-foreground/70 text-sm sm:text-base leading-relaxed mb-6">
              Dewan Pengurus Inti bekerja sama dengan 4 pilar bidang operasional untuk merealisasikan seluruh mandat
              GBPK 2026/2027: <strong>Pelatihan & Pengembangan</strong>, <strong>Humas & Publikasi</strong>, <strong>Inventaris</strong>, dan <strong>Kesejahteraan Anggota</strong>.
            </p>

            <Link
              href="/bidang"
              className="inline-flex items-center gap-2 bg-ukmred hover:bg-ukmred-dark text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-xl active:scale-95"
            >
              <span>Eksplorasi 4 Bidang Organisasi</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
