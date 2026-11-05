import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algorithm Tracker — Creator intelligence",
  description: "Descubre tendencias, encuentra oportunidades y planifica tu próximo vídeo.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
