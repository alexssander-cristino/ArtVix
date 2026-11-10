"use client";
import dynamic from "next/dynamic";
const Storefront = dynamic(() => import("./storefront"), { ssr: false, loading: () => <main className="loading-screen">Preparando seu estúdio ArtVix…</main> });
export default function StorefrontShell() { return <Storefront />; }