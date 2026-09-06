"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Music, Mic, Guitar, Drum } from "lucide-react";

const mockBidang = [
  { slug: "penginti", name: "Pengurus Inti", icon: Users, desc: "Pusat komando dan administrasi UKM Musik." },
  { slug: "bidang-1", name: "Bidang 1 (Musikalitas)", icon: Music, desc: "Fokus pada pengembangan skill bermusik anggota." },
  { slug: "bidang-2", name: "Bidang 2 (Inventaris)", icon: Guitar, desc: "Pemeliharaan dan pengelolaan alat musik." },
  { slug: "bidang-3", name: "Bidang 3 (Humas)", icon: Mic, desc: "Hubungan masyarakat dan publikasi." },
  { slug: "bidang-4", name: "Bidang 4 (Kewirausahaan)", icon: Drum, desc: "Penggalian dana dan manajemen persewaan." },
];

export default function BidangSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="bidang" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Bidang <span className="text-ukmred">Organisasi</span></h2>
          <div className="h-1 w-20 bg-ukmred mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Struktur organisasi UKM Musik Undiksha yang bekerja secara sinergis untuk mencapai visi dan misi bersama.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
        >
          {mockBidang.map((bidang, index) => {
            const Icon = bidang.icon;
            // Make the first one (Penginti) take full width on mobile or specific layout if needed.
            return (
              <motion.div key={bidang.slug} variants={itemVariants}>
                <Link href={`/bidang/${bidang.slug}`}>
                  <div className="bg-card border border-border p-8 rounded-2xl hover:border-ukmred/50 hover:shadow-[0_8px_30px_rgba(230,0,0,0.12)] transition-all duration-300 group h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6 group-hover:bg-ukmred/10 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-foreground group-hover:text-ukmred transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-ukmred transition-colors duration-300">{bidang.name}</h3>
                    <p className="text-foreground/60 text-sm">
                      {bidang.desc}
                    </p>
                    <div className="mt-6 text-sm font-semibold text-ukmred opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
                      Lihat Detail <span className="text-lg">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
