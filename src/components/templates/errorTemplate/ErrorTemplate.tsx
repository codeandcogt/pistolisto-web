"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon, HomeIcon } from "lucide-react"

export default function ErrorTemplate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Icono con efecto shake
      gsap.from(".error-icon", {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "back.out(2)",
      })

      gsap.to(".error-icon", {
        rotation: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        delay: 0.5,
      })

      // Pulso continuo
      gsap.to(".error-icon", {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      })

      // Título
      gsap.from(".error-title", {
        opacity: 0,
        y: -30,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      })

      // Descripción
      gsap.from(".error-description", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.6,
      })

      // Detalles técnicos
      gsap.from(".error-details", {
        opacity: 0,
        height: 0,
        duration: 0.5,
        delay: 0.9,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4"
    >
      <div className="error-icon text-lime-300">
        <AlertTriangleIcon className="w-24 h-24" />
      </div>

      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="error-title text-4xl font-bold">
          ¡Algo salió mal!
        </h1>
        <p className="error-description text-lg text-muted-foreground">
          Lo sentimos, ha ocurrido un error inesperado. Estamos trabajando para solucionarlo.
        </p>

      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          size="lg"
        >
          <HomeIcon className="mr-2 h-5 w-5" />
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}