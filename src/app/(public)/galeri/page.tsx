import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Galeri Aktivitas | UKM Musik Undiksha",
};

export const revalidate = 60; // Revalidate every minute

export default async function GaleriPage() {
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase tracking-wider">Galeri <span className="text-ukmred">Aktivitas</span></h1>
        <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-12"></div>
        
        {activities && activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activities.map((item) => (
              <div key={item.id} className="aspect-square bg-card rounded-xl border border-border overflow-hidden relative group">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${item.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/50 border border-border rounded-2xl">
            Belum ada foto galeri.
          </div>
        )}
      </div>
    </div>
  );
}
