import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from("programs").select("title, summary").eq("slug", slug).single();
  return {
    title: data ? `${data.title} | UKM Musik Undiksha` : "Detail Proker | UKM Musik Undiksha",
    description: data?.summary,
  };
}

export default async function DetailProkerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!program) {
    notFound();
  }

  const coverImage = program.cover_image_url || "https://images.unsplash.com/photo-1493225457124-a1a2a5956023?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-end pb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/30 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 w-full pt-20">
          <div className="flex items-center gap-2 text-foreground/70 text-sm font-medium mb-3">
            <Calendar size={16} className="text-ukmred" />
            <span>{program.date || "Segera Hadir"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{program.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="lead text-xl text-foreground/80 font-medium">
            {program.summary}
          </p>
          
          {program.content ? (
            <div dangerouslySetInnerHTML={{ __html: program.content.replace(/\n/g, '<br/>') }} />
          ) : (
            <div className="text-foreground/50 border border-border rounded-xl p-8 text-center mt-8">
              Belum ada deskripsi lengkap untuk program kerja ini.
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
