import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtVix — Personalize do seu jeito",
  description: "Crie produtos únicos com personalização 3D e realidade aumentada."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}