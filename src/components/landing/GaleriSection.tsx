"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const mockActivities = [
  { id: 1, title: "Pentas Seni 2023", image: "https://images.unsplash.com/photo-1540039155733-d7696d4eb559?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Latihan Rutin", image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Konser Amal", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, title: "Gelar Karya", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, title: "Acoustic Night", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop" },
];

export default function GaleriSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="galeri" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Galeri <span className="text-ukmred">Aktivitas</span></h2>
          <div className="h-1 w-20 bg-ukmred mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-card p-3 rounded-full shadow-lg border border-border text-foreground hover:text-ukmred transition-colors hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-card p-3 rounded-full shadow-lg border border-border text-foreground hover:text-ukmred transition-colors hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel container */}
          <div 
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mockActivities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[85vw] md:min-w-[400px] h-[300px] md:h-[400px] rounded-2xl overflow-hidden relative group snap-center flex-shrink-0 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${activity.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{activity.title}</h3>
                  <div className="w-10 h-1 bg-ukmred rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
