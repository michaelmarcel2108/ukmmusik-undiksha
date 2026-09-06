import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from("divisions").select("name, description").eq("slug", slug).single();
  return {
    title: data ? `${data.name} | UKM Musik Undiksha` : "Detail Bidang | UKM Musik Undiksha",
    description: data?.description,
  };
}

export default async function DetailBidangPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch division details
  const { data: division } = await supabase
    .from("divisions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!division) {
    notFound();
  }

  // Fetch members of this division
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("division_id", division.id)
    .order("created_at", { ascending: true });

  const coverImage = division.cover_image_url || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2000&auto=format&fit=crop";
  const groupImage = division.group_image_url || "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            {division.name}
          </h1>
          <div className="h-1 w-20 bg-ukmred mx-auto rounded-full mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Description & Group Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Tentang {division.name}</h2>
            <p className="text-lg text-foreground/80 whitespace-pre-wrap">
              {division.description || "Belum ada penjelasan lebih detail mengenai bidang ini."}
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-lg relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${groupImage}')` }}
              />
            </div>
          </div>
        </div>

        {/* Member Cards */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">Anggota <span className="text-ukmred">Bidang</span></h2>
          <p className="text-foreground/60">Orang-orang hebat di balik layar {division.name}</p>
        </div>

        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <div key={member.id} className="bg-card rounded-2xl overflow-hidden border border-border group hover:border-ukmred/50 transition-all">
                <div className="aspect-square bg-background relative overflow-hidden">
                  {member.photo_url ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${member.photo_url}')` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/30">No Photo</div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-ukmred transition-colors">{member.name}</h3>
                  <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/50 border-2 border-dashed border-border rounded-2xl">
            Belum ada data anggota yang ditambahkan.
          </div>
        )}
      </div>
    </div>
  );
}
