"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const mockProker = [
  { slug: "porker-1", title: "Pentas Amal Mahasiswa Baru", date: "12 Agustus 2026", image: "https://images.unsplash.com/photo-1493225457124-a1a2a5956023?q=80&w=1000&auto=format&fit=crop", summary: "Kegiatan penyambutan anggota baru dengan menampilkan bakat-bakat musik dari berbagai genre." },
  { slug: "porker-2", title: "Festival Band Kampus", date: "25 Oktober 2026", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop", summary: "Kompetisi band antar fakultas se-Universitas Pendidikan Ganesha yang memperebutkan piala bergilir Rektor." },
  { slug: "porker-3", title: "Workshop Home Recording", date: "05 November 2026", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop", summary: "Pelatihan tentang cara memproduksi musik secara mandiri di rumah (home recording) menggunakan alat sederhana." },
];

export default function ProkerSection() {
  return (
    <section id="proker" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Program <span className="text-ukmred">Kerja</span></h2>
          <div className="h-1 w-20 bg-ukmred mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Berita dan program kerja terbaru dari UKM Musik Undiksha yang terus mewadahi kreativitas musikal mahasiswa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProker.map((proker, index) => (
            <motion.div 
              key={proker.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:border-ukmred/30 transition-all duration-300 group flex flex-col h-full shadow-md hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${proker.image}')` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-border/50">
                  <Calendar size={12} className="text-ukmred" />
                  {proker.date}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 group-hover:text-ukmred transition-colors duration-300 line-clamp-2">
                  <Link href={`/proker/${proker.slug}`}>
                    {proker.title}
                  </Link>
                </h3>
                <p className="text-foreground/70 text-sm mb-6 line-clamp-3 flex-grow">
                  {proker.summary}
                </p>
                
                <Link 
                  href={`/proker/${proker.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-ukmred hover:text-ukmred-dark group/link mt-auto"
                >
                  Baca Selengkapnya
                  <ArrowRight size={16} className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/proker" 
            className="inline-block border border-border hover:border-ukmred hover:bg-ukmred/5 text-foreground font-medium py-3 px-8 rounded-full transition-all duration-300"
          >
            Lihat Semua Berita
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
