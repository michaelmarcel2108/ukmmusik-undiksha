import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from("rental_items").select("name, description").eq("slug", slug).single();
  return {
    title: data ? `${data.name} | Sewa Alat UKM Musik` : "Detail Barang | UKM Musik Undiksha",
    description: data?.description,
  };
}

export default async function DetailKatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch item
  const { data: item } = await supabase
    .from("rental_items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) {
    notFound();
  }

  // Fetch contact number
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_inventaris")
    .single();

  const phoneNumber = settings?.contact_inventaris || "628123456789";
  
  // Format WhatsApp message
  const waMessage = encodeURIComponent(`Halo Admin Inventaris UKM Musik, saya ingin bertanya mengenai penyewaan alat: *${item.name}*. Apakah barang ini tersedia?`);
  const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-card border border-border p-6 rounded-3xl mt-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-black/20 rounded-2xl overflow-hidden border border-border relative">
              {item.image_url ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image_url}')` }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{item.name}</h1>
            <p className="text-3xl text-ukmred font-bold mb-8">Rp {item.price_per_day.toLocaleString('id-ID')} <span className="text-foreground/50 text-base font-normal">/ hari</span></p>
            
            <div className="prose prose-invert max-w-none mb-10 flex-grow">
              <h3 className="text-lg font-bold text-white mb-2">Deskripsi Barang</h3>
              <p className="text-foreground/80 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            <div>
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-900/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
