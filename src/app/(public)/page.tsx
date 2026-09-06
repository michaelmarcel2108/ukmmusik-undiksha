import Link from "next/link";
import { ArrowRight, Music, Users, Package, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function Home() {
  // Fetch data in parallel
  const [
    { data: settings },
    { data: activities },
    { data: programs },
    { data: divisions },
    { data: rentalItems }
  ] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(4),
    supabase.from("programs").select("*").order("created_at", { ascending: false }).limit(3),
    supabase.from("divisions").select("*").order("created_at", { ascending: true }),
    supabase.from("rental_items").select("*").order("created_at", { ascending: false }).limit(4)
  ]);

  const heroTitle = settings?.hero_title || "UKM MUSIK UNDIKSHA";
  const heroSubtitle = settings?.hero_subtitle || "Salam Rock";
  const heroImage = settings?.hero_image_url || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-start justify-center pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-0" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase">
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* TENTANG KAMI SECTION */}
      <section id="tentang" className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Tentang <span className="text-ukmred">Kami</span></h2>
            <div className="h-1 w-20 bg-ukmred mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="max-w-3xl mx-auto text-center text-lg text-foreground/80 leading-relaxed">
            <p>
              Unit Kegiatan Mahasiswa (UKM) Musik Universitas Pendidikan Ganesha adalah wadah bagi mahasiswa yang memiliki minat dan bakat di bidang seni musik. Kami aktif berpartisipasi dalam berbagai acara kampus, menyelenggarakan pentas amal, serta menyewakan perlengkapan alat musik dengan standar profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:border-ukmred/50 transition-colors">
              <div className="w-16 h-16 bg-ukmred/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ukmred">
                <Music size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Musik & Karya</h3>
              <p className="text-foreground/70">Wadah apresiasi dan penciptaan karya seni musik bagi mahasiswa.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:border-ukmred/50 transition-colors">
              <div className="w-16 h-16 bg-ukmred/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ukmred">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Organisasi</h3>
              <p className="text-foreground/70">Melatih kepemimpinan dan manajemen acara melalui program kerja kepanitiaan.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:border-ukmred/50 transition-colors">
              <div className="w-16 h-16 bg-ukmred/10 rounded-full flex items-center justify-center mx-auto mb-6 text-ukmred">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Inventaris & Sewa</h3>
              <p className="text-foreground/70">Menyediakan layanan penyewaan alat musik dan sound system berkualitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BIDANG SECTION */}
      {divisions && divisions.length > 0 && (
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Bidang <span className="text-ukmred">Organisasi</span></h2>
                <div className="h-1 w-20 bg-ukmred rounded-full"></div>
              </div>
              <Link href="/bidang" className="hidden md:flex items-center text-ukmred hover:text-ukmred-dark font-medium transition-colors">
                Lihat Semua <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {divisions.map((bidang) => (
                <Link href={`/bidang/${bidang.slug}`} key={bidang.id}>
                  <div className="bg-background border border-border rounded-2xl overflow-hidden hover:border-ukmred/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative bg-black/20">
                      {bidang.cover_image_url ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${bidang.cover_image_url}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ukmred bg-ukmred/10">
                          <Users size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-ukmred transition-colors">{bidang.name}</h3>
                      <p className="text-foreground/70 text-sm flex-grow line-clamp-3">
                        {bidang.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/bidang" className="inline-flex items-center text-ukmred font-medium">
                Lihat Semua <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PROKER SECTION */}
      {programs && programs.length > 0 && (
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Program <span className="text-ukmred">Kerja</span></h2>
                <div className="h-1 w-20 bg-ukmred rounded-full"></div>
              </div>
              <Link href="/proker" className="hidden md:flex items-center text-ukmred hover:text-ukmred-dark font-medium transition-colors">
                Lihat Semua <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((program) => (
                <Link href={`/proker/${program.slug}`} key={program.id}>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-ukmred/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative bg-black/20">
                      {program.cover_image_url ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url('${program.cover_image_url}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-ukmred text-sm font-medium mb-3">
                        <Calendar size={14} />
                        <span>{program.date || "Segera"}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-ukmred transition-colors line-clamp-2">{program.title}</h3>
                      <p className="text-foreground/70 text-sm flex-grow line-clamp-3">
                        {program.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/proker" className="inline-flex items-center text-ukmred font-medium">
                Lihat Semua <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* KATALOG SEWA SECTION */}
      {rentalItems && rentalItems.length > 0 && (
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Katalog <span className="text-ukmred">Sewa</span></h2>
                <div className="h-1 w-20 bg-ukmred rounded-full"></div>
              </div>
              <Link href="/katalog-sewa" className="hidden md:flex items-center text-ukmred hover:text-ukmred-dark font-medium transition-colors">
                Lihat Semua Katalog <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentalItems.map((item) => (
                <Link key={item.id} href={`/katalog-sewa/${item.slug}`}>
                  <div className="group bg-background rounded-xl overflow-hidden border border-border hover:border-ukmred/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg">
                    <div className="h-48 overflow-hidden relative bg-black/20">
                      {item.image_url ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url('${item.image_url}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-ukmred transition-colors">{item.name}</h3>
                      <p className="text-ukmred font-bold text-xl mt-auto">Rp {item.price_per_day.toLocaleString('id-ID')} <span className="text-foreground/50 text-xs font-normal">/ hari</span></p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/katalog-sewa" className="inline-flex items-center text-ukmred font-medium">
                Lihat Semua Katalog <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* GALERI PREVIEW SECTION */}
      {activities && activities.length > 0 && (
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Galeri <span className="text-ukmred">Aktivitas</span></h2>
                <div className="h-1 w-20 bg-ukmred rounded-full"></div>
              </div>
              <Link href="/galeri" className="hidden md:flex items-center text-ukmred hover:text-ukmred-dark font-medium transition-colors">
                Lihat Semua Foto <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activities.map((item) => (
                <div key={item.id} className="aspect-square rounded-2xl overflow-hidden relative group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url('${item.image_url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/galeri" className="inline-flex items-center text-ukmred font-medium">
                Lihat Semua Foto <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
