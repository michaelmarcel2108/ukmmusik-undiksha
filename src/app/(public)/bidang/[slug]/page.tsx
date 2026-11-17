import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Users, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GBPK_DIVISIONS } from "@/lib/divisions-constants";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const matchingGbpk = GBPK_DIVISIONS.find((g) => g.slug === slug);
  const { data } = await supabase.from("divisions").select("name, description").eq("slug", slug).maybeSingle();

  const titleName = data?.name || matchingGbpk?.name || "Detail Bidang";
  const desc = data?.description || matchingGbpk?.description;

  return {
    title: `${titleName} | UKM Musik Undiksha`,
    description: desc,
  };
}

export default async function DetailBidangPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Check DB first
  const { data: dbDivision } = await supabase
    .from("divisions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  // 2. Check GBPK fallback if not found in DB
  const matchingGbpk = GBPK_DIVISIONS.find((g) => g.slug === slug);

  if (!dbDivision && !matchingGbpk) {
    notFound();
  }

  const divisionName = dbDivision?.name || matchingGbpk?.name || "";
  const divisionDesc = dbDivision?.description || matchingGbpk?.description || "";
  const divisionCode = matchingGbpk?.code || "Bidang UKM Musik";
  const coverImage = dbDivision?.cover_image_url || matchingGbpk?.cover_image_url || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000&auto=format&fit=crop";
  const groupImage = dbDivision?.group_image_url || matchingGbpk?.group_image_url || "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop";

  // Programs list
  const programsList = matchingGbpk?.programs || [];

  // Clean overview text
  const overviewText = divisionDesc.split("\n\nPokok-Pokok Program Kerja")[0] || divisionDesc;

  // 3. Fetch members if dbDivision exists
  let dbMembers: any[] = [];
  if (dbDivision?.id) {
    const { data: mData } = await supabase
      .from("members")
      .select("*")
      .eq("division_id", dbDivision.id)
      .order("created_at", { ascending: true });
    if (mData) dbMembers = mData;
  }

  // Fallback to official GBPK members list if DB has no members yet
  const displayMembers = dbMembers.length > 0
    ? dbMembers.map((m) => {
        // Try to match group from gbpk members
        const match = matchingGbpk?.members.find((gm) => gm.name.toLowerCase() === m.name.toLowerCase());
        return {
          id: m.id,
          name: m.name,
          role: m.role,
          photo_url: m.photo_url,
          divisionGroup: match?.divisionGroup || (
            m.role.toLowerCase().includes("koordinator bidang") || m.role.toLowerCase().includes("sekretaris bidang")
              ? "Pimpinan Bidang"
              : "Anggota Bidang"
          ),
        };
      })
    : (matchingGbpk?.members || []).map((m, idx) => ({
        id: `gbpk-m-${idx}`,
        name: m.name,
        role: m.role,
        divisionGroup: m.divisionGroup || "Anggota Bidang",
        photo_url: m.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop",
      }));

  // Group members by divisionGroup
  const groupedMembers: Record<string, typeof displayMembers> = {};
  displayMembers.forEach((m) => {
    const groupKey = m.divisionGroup || "Fungsionaris Bidang";
    if (!groupedMembers[groupKey]) groupedMembers[groupKey] = [];
    groupedMembers[groupKey].push(m);
  });

  return (
    <div className="pt-16 min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <div className="relative h-[45vh] min-h-[320px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/75 to-black/50 z-0" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Link
            href="/bidang"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> Kembali ke Daftar Bidang
          </Link>
          
          <div className="block text-xs font-black uppercase tracking-widest text-ukmred bg-ukmred/20 border border-ukmred/40 px-3 py-1 rounded-full w-fit mx-auto mb-2">
            {divisionCode} • GBPK 2026/2027
          </div>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white">
            {divisionName}
          </h1>
          <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description & Group Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-widest text-ukmred flex items-center gap-1.5 mb-2">
              <Sparkles size={16} /> Profil & Peran Organisasi
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Tentang {divisionName}
            </h2>
            <div className="text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {overviewText}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] bg-card rounded-3xl overflow-hidden border border-border shadow-xl relative group">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${groupImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold">
                Foto Bersama {divisionName}
              </div>
            </div>
          </div>
        </div>

        {/* GBPK POKOK-POKOK PROGRAM KERJA */}
        {programsList.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 mb-20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ukmred/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-ukmred flex items-center gap-1.5 mb-1">
                  <BookOpen size={16} /> Garis Besar Program Kerja (GBPK)
                </span>
                <h3 className="text-2xl font-black">
                  Pokok-Pokok Program Kerja & Tanggung Jawab
                </h3>
                <p className="text-foreground/60 text-sm mt-1">
                  Ketetapan Sidang Raker UKM Musik Undiksha No. 07/TAP/SIDANG RAKER/07/VII/2026 Masa Bakti 2026/2027.
                </p>
              </div>

              <span className="px-3 py-1 bg-ukmred/10 border border-ukmred/20 text-ukmred text-xs font-black rounded-full shrink-0">
                {programsList.length} Poin Mandat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programsList.map((prog, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-background/80 border border-border flex items-start gap-3 hover:border-ukmred/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-ukmred/10 text-ukmred flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                    {prog}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUNGSIONARIS & ANGGOTA BIDANG (GROUPED BY DIVISION) */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-ukmred flex items-center justify-center gap-1.5 mb-1">
              <Users size={16} /> Susunan Kepengurusan 2026/2027
            </span>
            <h2 className="text-3xl font-black uppercase tracking-wider mb-2">
              Fungsionaris & Anggota <span className="text-ukmred">Bidang</span>
            </h2>
            <p className="text-foreground/60 text-sm">
              Ketetapan Sidang Raker UKM Musik Undiksha No. 03/TAP/SIDANG RAKER/07/VII/2026
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedMembers).map(([groupTitle, groupMembers]) => (
              <div key={groupTitle} className="bg-card/60 border border-border rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border">
                  <ShieldCheck size={20} className="text-ukmred" />
                  <h3 className="text-xl font-black uppercase tracking-wide">
                    {groupTitle}
                  </h3>
                  <span className="text-xs text-foreground/50 ml-auto font-bold bg-background px-3 py-1 rounded-full border border-border">
                    {groupMembers.length} Personel
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-card rounded-2xl overflow-hidden border border-border group hover:border-ukmred/50 transition-all shadow-sm hover:shadow-md p-4 flex items-center gap-3.5"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-background border border-border overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/30 text-[10px]">
                            No Photo
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm leading-snug mb-1 group-hover:text-ukmred transition-colors line-clamp-2">
                          {member.name}
                        </h4>
                        <p className="text-foreground/60 text-[11px] font-semibold uppercase tracking-wider line-clamp-1">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
