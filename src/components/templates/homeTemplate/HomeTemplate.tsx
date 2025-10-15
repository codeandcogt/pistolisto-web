"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DownloadIcon, LogInIcon } from "lucide-react";
import Image from "next/image";

export default function HomeTemplate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const parts = [
        { text: "Convierte lo que", color: "text-foreground" },
        { text: " no usas ", color: "text-lime-400" },
        { text: "en ", color: "text-foreground" },
        { text: "dinero inmediato.", color: "text-lime-400" },
      ];

      const titleElement = document.querySelector(".hero-title");
      if (!titleElement){
        return
      }

      let currentPartIndex = 0;
      let currentChar = 0;

      const typeWriter = () => {
        if (currentPartIndex < parts.length) {
          const currentPart = parts[currentPartIndex];
          
          if (currentChar < currentPart.text.length) {
            if (currentChar === 0) {
              const span = document.createElement("span");
              span.className = currentPart.color;
              span.id = `part-${currentPartIndex}`;
              titleElement.appendChild(span);
            }

            const spanElement = document.getElementById(`part-${currentPartIndex}`);
            if (spanElement) {
              spanElement.textContent += currentPart.text[currentChar];
            }
            
            currentChar++;
            setTimeout(typeWriter, 50);
          } else {
            currentPartIndex++;
            currentChar = 0;
            setTimeout(typeWriter, 50);
          }
        }
      };

      gsap.from(".hero-title", {
        opacity: 0,
        duration: 0.3,
        onComplete: typeWriter,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDownload = () => {
    console.log("Descargando app...");
  };

  return (
    <div ref={containerRef} className="h-screen bg-gradient-to-tr from-black via-transparent to-green-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="nav-item text-2xl font-bold text-primary">
            <Image
              src="/svg/logo.svg"
              alt="Logo"
              width={80}
              height={20}
              className="object-contain"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownload}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Descargar App
            </Button>
            <Button onClick={() => router.push("/auth/login")}>
              <LogInIcon className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="hero-title text-7xl sm:text-xl lg:text-7xl font-bold leading-tight"></h1>
          </div>
        </div>
      </section>
    </div>
  );
}