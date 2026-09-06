"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  bucket = "public_assets",
  folder = "uploads"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      // Menampilkan pesan error asli dari Supabase agar mudah dilacak
      setError(`Gagal: ${err.message || "Pastikan bucket public_assets sudah dibuat"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <div className="aspect-video bg-black/10 relative">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => onChange("")}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
                title="Hapus Gambar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className={`
          flex flex-col items-center justify-center w-full aspect-video 
          border-2 border-dashed rounded-xl cursor-pointer 
          transition-colors duration-200
          ${isUploading ? 'bg-background border-border opacity-70' : 'bg-background hover:bg-card border-border hover:border-ukmred/50'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground/50">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-4 animate-spin text-ukmred" />
            ) : (
              <Upload className="w-8 h-8 mb-4" />
            )}
            <p className="mb-2 text-sm">
              <span className="font-semibold text-ukmred">Klik untuk upload</span> atau seret file
            </p>
            <p className="text-xs">PNG, JPG atau WEBP (Maks. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
