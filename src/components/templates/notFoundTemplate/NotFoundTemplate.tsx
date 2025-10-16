"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotFoundTemplate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Astronauta flotando
      gsap.to(".astronaut", {
        y: -30,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Estrellas parpadeando
      gsap.to(".star", {
        opacity: 0.3,
        scale: 0.8,
        duration: 1.5,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Entrada del texto
      gsap.from(".title", {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "bounce.out",
      })

      gsap.from(".description", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 relative overflow-hidden bg-gradient-to-tr from-black via-transparent to-green-900"
    >
      <div className="star absolute top-20 left-20 w-2 h-2 bg-primary rounded-full" />
      <div className="star absolute top-40 right-32 w-1 h-1 bg-primary rounded-full" />
      <div className="star absolute bottom-32 left-40 w-1.5 h-1.5 bg-primary rounded-full" />
      <div className="star absolute top-60 right-20 w-2 h-2 bg-primary rounded-full" />

      <div className="astronaut text-9xl">🚀</div>

      <div className="text-center space-y-4 z-10">
        <h1 className="title text-6xl font-bold text-lime-300">404</h1>
        <h2 className="description text-2xl font-semibold">
          ¡Houston, tenemos un problema!
        </h2>
        <p className="description text-muted-foreground max-w-md">
          Parece que te has perdido en el espacio. Esta página no existe en nuestra galaxia.
        </p>
      </div>

      <Button
      className="bg-lime-500"
        onClick={() => router.push("/")}
      >
        Regresar a la Tierra
      </Button>
    </div>
  )
}