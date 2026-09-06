import { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Program Kerja | UKM Musik Undiksha",
};

export const revalidate = 60;

export default async function ProkerPage() {
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase tracking-wider">Program <span className="text-ukmred">Kerja</span></h1>
        <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-12"></div>
        
        {programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((item) => (
              <Link href={`/proker/${item.slug}`} key={item.id}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-ukmred/50 transition-colors group h-full flex flex-col">
                  <div className="h-48 relative overflow-hidden bg-black/20 flex-shrink-0">
                    {item.cover_image_url ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${item.cover_image_url}')` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs font-medium text-ukmred mb-3">
                      <Calendar size={14} />
                      <span>{item.date || "Segera Hadir"}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-ukmred transition-colors">{item.title}</h3>
                    <p className="text-foreground/70 text-sm line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/50 border border-border rounded-2xl">
            Belum ada Program Kerja.
          </div>
        )}
      </div>
    </div>
  );
}
