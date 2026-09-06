import { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Bidang Organisasi | UKM Musik Undiksha",
};

export const revalidate = 60;

export default async function BidangPage() {
  const { data: divisions } = await supabase
    .from("divisions")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase tracking-wider">Bidang <span className="text-ukmred">Organisasi</span></h1>
        <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-12"></div>
        
        {divisions && divisions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {divisions.map((bidang) => (
              <Link href={`/bidang/${bidang.slug}`} key={bidang.id}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-ukmred/50 transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
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
                      {bidang.description || "Belum ada deskripsi untuk bidang ini."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/50 border border-border rounded-2xl">
            Struktur Bidang belum ditambahkan.
          </div>
        )}
      </div>
    </div>
  );
}
