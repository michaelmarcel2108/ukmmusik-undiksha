import CardGeneratorView from "@/components/card-generator/CardGeneratorView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Kartu Peserta RGC XVII | UKM Musik Undiksha",
  description: "Otomatisasi pembuatan dan ekspor desain kartu peserta lomba RGC XVII",
};

export default function PublicCardGeneratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CardGeneratorView defaultCategory="band" />
    </div>
  );
}
