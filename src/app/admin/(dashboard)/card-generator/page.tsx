import CardGeneratorView from "@/components/card-generator/CardGeneratorView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Kartu Peserta RGC XVII | Admin Panel",
  description: "Otomatisasi pembuatan dan ekspor desain kartu peserta lomba RGC XVII",
};

export default function AdminCardGeneratorPage() {
  return (
    <div className="space-y-6">
      <CardGeneratorView defaultCategory="band" />
    </div>
  );
}
