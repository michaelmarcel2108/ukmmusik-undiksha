import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Daftar Karya | UKM Musik Undiksha",
};

export const revalidate = 60;

export default async function KaryaPage() {
  const { data: settings } = await supabase
    .from("site_settings")
    .select("embed_music_url")
    .single();

  const embedUrl = settings?.embed_music_url;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase tracking-wider">Karya <span className="text-ukmred">Kami</span></h1>
        <div className="h-1 w-24 bg-ukmred mx-auto rounded-full mb-12"></div>
        
        <div className="space-y-12">
          {embedUrl ? (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Karya Unggulan</h2>
              <div className="w-full rounded-xl overflow-hidden border border-border flex items-center justify-center">
                {embedUrl.includes("spotify.com") || embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be") ? (
                  <iframe 
                    src={embedUrl} 
                    width="100%" 
                    height={embedUrl.includes("spotify.com") ? "352" : "500"} 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="w-full aspect-video md:aspect-auto"
                  ></iframe>
                ) : (
                  <div className="p-8 text-foreground/50">Link embed tidak didukung (Gunakan Spotify atau YouTube).</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-foreground/50 border border-border rounded-2xl">
              Belum ada karya yang diunggah.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
