import { Metadata } from "next";
import Link from "next/link";
import { Users, GraduationCap, Megaphone, Archive, HeartHandshake, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GBPK_DIVISIONS } from "@/lib/divisions-constants";
import { CORE_BPH_COVER_IMAGE, CORE_ROLES_CONFIG } from "@/lib/core-constants";

export const metadata: Metadata = {
  title: "Struktur Organisasi | UKM Musik Undiksha",
  description: "Struktur Kepemimpinan Dewan Pengurus Inti (BPH) dan 4 Bidang Organisasi UKM Musik Undiksha Berdasarkan GBPK Masa Bakti 2026/2027.",
};

export const revalidate = 60;

export default async function BidangPage() {
  const [
    { data: dbDivisions },
    { data: dbCoreMembers }
  ] = await Promise.all([
    supabase.from("divisions").select("*").order("created_at", { ascending: true }),
    supabase.from("core_members").select("*").order("order_index", { ascending: true })
  ]);

  // Use database records if available, otherwise use GBPK_DIVISIONS
  const displayList = dbDivisions && dbDivisions.length > 0
    ? dbDivisions.map((item, idx) => {
        const matchingGbpk = GBPK_DIVISIONS.find((g) => g.slug === item.slug);
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          code: matchingGbpk?.code || `Bidang ${idx + 1}`,
          description: item.description || matchingGbpk?.description || "",
          cover_image_url: item.cover_image_url || matchingGbpk?.cover_image_url,
          programs: matchingGbpk?.programs || [],
        };
      })
    : GBPK_DIVISIONS.map((item) => ({
        id: item.slug,
        name: item.name,
        slug: item.slug,
        code: item.code,
        description: item.description,
        cover_image_url: item.cover_image_url,
        programs: item.programs,
      }));

  // Resolve core members names
  const getCoreOfficerName = (roleKeyword: string, defaultFallback: string) => {
    const found = dbCoreMembers?.find((m) =>
      m.role.toLowerCase().includes(roleKeyword.toLowerCase())
    );
    return found?.name || defaultFallback;
  };

  const ketuaName = getCoreOfficerName("ketua", "Michael Marcel Hartono");
  const wakilName = getCoreOfficerName("wakil", "Putu Indah Susanti");
  const sekretarisName = getCoreOfficerName("sekretaris 1", "Putu Divanya Candy Fortuna");
  const bendaharaName = getCoreOfficerName("bendahara 1", "Ni Wayan Dayuh Amiliya Selena");

  const getDivisionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <GraduationCap size={22} className="text-ukmred" />;
      case 1:
        return <Megaphone size={22} className="text-ukmred" />;
      case 2:
        return <Archive size={22} className="text-ukmred" />;
      case 3:
      default:
        return <HeartHandshake size={22} className="text-ukmred" />;
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-widest text-ukmred bg-ukmred/10 border border-ukmred/20 rounded-full mb-3">
            GBPK MASA BAKTI 2026/2027
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-4">
            Struktur <span className="text-ukmred">Organisasi</span>
          </h1>
          <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-6" />
          <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
            Struktur kepemimpinan Dewan Pengurus Inti (BPH) dan 4 pilar bidang operasional 
            Unit Kegiatan Mahasiswa Musik Universitas Pendidikan Ganesha.
          </p>
        </div>

        {/* PENGURUS INTI (BPH) BOX WITH COVER PHOTO LIKE BIDANG */}
        <Link href="/pengurus-inti" className="block group mb-16">
          <div className="bg-card border-2 border-ukmred/30 hover:border-ukmred rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-2xl flex flex-col md:flex-row">
            
            {/* Cover Image Box (Foto di box seperti bidang) */}
            <div className="md:w-5/12 h-64 md:h-auto min-h-[260px] overflow-hidden relative bg-black/40 shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${CORE_BPH_COVER_IMAGE}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              
              {/* Badge di atas Foto */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-border shadow-sm">
                <Crown size={18} className="text-ukmred" />
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  DEWAN PENGURUS INTI (BPH)
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold md:hidden">
                Badan Pengurus Harian • Masa Bakti 2026/2027
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-ukmred/10 text-ukmred px-2.5 py-0.5 rounded-full border border-ukmred/20">
                    Kepemimpinan Utama
                  </span>
                  <span className="text-xs text-foreground/50 font-bold">• Non-Bidang</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black mb-2 text-foreground group-hover:text-ukmred transition-colors flex items-center justify-between">
                  <span>Dewan Pengurus Inti (BPH)</span>
                  <ArrowRight size={22} className="text-foreground/30 group-hover:text-ukmred group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </h2>

                <p className="text-foreground/75 text-sm md:text-base leading-relaxed mb-6">
                  Pilar kepemimpinan eksekutif tertinggi yang menaungi, mengarahkan, dan mengoordinasikan seluruh 4 Bidang Operasional UKM Musik Universitas Pendidikan Ganesha Masa Bakti 2026/2027.
                </p>

                {/* 4 Core Roles Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
                  <div className="bg-background/80 border border-border p-3 rounded-2xl text-center">
                    <span className="block text-[11px] font-bold text-ukmred uppercase tracking-wider mb-0.5">Ketua Umum</span>
                    <span className="text-xs font-semibold text-foreground/80 line-clamp-1">{ketuaName}</span>
                  </div>
                  <div className="bg-background/80 border border-border p-3 rounded-2xl text-center">
                    <span className="block text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Wakil Ketua</span>
                    <span className="text-xs font-semibold text-foreground/80 line-clamp-1">{wakilName}</span>
                  </div>
                  <div className="bg-background/80 border border-border p-3 rounded-2xl text-center">
                    <span className="block text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-0.5">Sekretaris Umum</span>
                    <span className="text-xs font-semibold text-foreground/80 line-clamp-1">{sekretarisName}</span>
                  </div>
                  <div className="bg-background/80 border border-border p-3 rounded-2xl text-center">
                    <span className="block text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-0.5">Bendahara Umum</span>
                    <span className="text-xs font-semibold text-foreground/80 line-clamp-1">{bendaharaName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-ukmred">
                <span>Buka Lembar Profil & Tugas Pokok BPH</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">Selengkapnya &rarr;</span>
              </div>
            </div>
          </div>
        </Link>

        {/* SECTION TITLE FOR 4 DIVISIONS */}
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-ukmred block mb-1">
            Pelaksana Mandat GBPK 2026/2027
          </span>
          <h2 className="text-2xl md:text-3xl font-black">
            4 Bidang Operasional Organisasi
          </h2>
        </div>

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayList.map((bidang, index) => (
            <Link href={`/bidang/${bidang.slug}`} key={bidang.slug} className="group">
              <div className="bg-card border border-border rounded-3xl overflow-hidden hover:border-ukmred/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col shadow-sm hover:shadow-xl">
                {/* Cover Image */}
                <div className="h-56 overflow-hidden relative bg-black/40">
                  {bidang.cover_image_url ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${bidang.cover_image_url}')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ukmred bg-ukmred/10">
                      <Users size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border shadow-sm">
                    {getDivisionIcon(index)}
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      {bidang.code}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-black mb-3 group-hover:text-ukmred transition-colors flex items-center justify-between">
                    <span>{bidang.name}</span>
                    <ArrowRight size={20} className="text-foreground/30 group-hover:text-ukmred group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </h2>

                  <p className="text-foreground/70 text-sm leading-relaxed mb-6 line-clamp-3">
                    {bidang.description.split("\n\nPokok-Pokok")[0] || bidang.description}
                  </p>

                  {/* Program Preview */}
                  {bidang.programs && bidang.programs.length > 0 && (
                    <div className="mt-auto pt-5 border-t border-border">
                      <span className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2.5">
                        Fokus Utama Program:
                      </span>
                      <ul className="space-y-1.5 text-xs text-foreground/80">
                        {bidang.programs.slice(0, 3).map((prog, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-ukmred font-bold">•</span>
                            <span className="line-clamp-1">{prog}</span>
                          </li>
                        ))}
                      </ul>
                      {bidang.programs.length > 3 && (
                        <span className="block text-[11px] font-semibold text-ukmred mt-2">
                          +{bidang.programs.length - 3} program kerja lainnya...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
