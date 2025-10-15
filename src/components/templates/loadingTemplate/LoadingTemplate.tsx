"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function LoadingTemplate() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 })

      // Letras aparecen una por una
      tl.from(".letter", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })
      .to(".letter", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.1,
        delay: 1,
        ease: "back.in(1.7)",
      })

      // Puntos animados
      gsap.to(".dot-anim", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-tr from-black via-transparent to-green-900"
    >
      <div className="flex gap-1 text-4xl font-bold">
        <span className="letter text-6xl font-bold  text-lime-500">C</span>
        <span className="letter text-6xl font-bold  text-lime-500">a</span>
        <span className="letter text-6xl font-bold  text-lime-500">r</span>
        <span className="letter text-6xl font-bold  text-lime-500">g</span>
        <span className="letter text-6xl font-bold  text-lime-500">a</span>
        <span className="letter text-6xl font-bold  text-lime-500">n</span>
        <span className="letter text-6xl font-bold  text-lime-500">d</span>
        <span className="letter text-6xl font-bold  text-lime-500">o</span>
      </div>
      <div className="flex gap-2">
        <span className="dot-anim text-2xl">.</span>
        <span className="dot-anim text-2xl">.</span>
        <span className="dot-anim text-2xl">.</span>
      </div>
    </div>
  )
}