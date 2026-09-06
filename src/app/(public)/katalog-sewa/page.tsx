import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Katalog Sewa | UKM Musik Undiksha",
};

export const revalidate = 60;

export default async function KatalogSewaPage() {
  const { data: items } = await supabase
    .from("rental_items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase tracking-wider">Katalog <span className="text-ukmred">Sewa</span></h1>
        <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-8"></div>
        <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-12">
          Kami menyewakan berbagai macam alat musik, sound system, dan perlengkapan panggung dengan harga terjangkau untuk mahasiswa dan umum.
        </p>
        
        {/* Search Bar - This would be interactive if we converted to Client Component, 
            but keeping it simple/static for now. */}
        <div className="max-w-md mx-auto mb-12 relative hidden">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ukmred/50 focus:border-ukmred transition-colors"
            placeholder="Cari alat musik..."
          />
        </div>

        {/* Catalog Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/katalog-sewa/${item.slug}`}>
                <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-ukmred/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg">
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
                    <p className="text-foreground/60 text-sm line-clamp-2 mb-4 flex-grow">
                      {item.description}
                    </p>
                    <p className="text-ukmred font-bold text-xl mt-auto">Rp {item.price_per_day.toLocaleString('id-ID')} <span className="text-foreground/50 text-xs font-normal">/ hari</span></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/50 border border-border rounded-2xl">
            Katalog sewa saat ini kosong.
          </div>
        )}
      </div>
    </div>
  );
}
