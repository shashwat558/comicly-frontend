"use client"
import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSvgComponent from './HeroSvgComponent' // Assuming this path is correct based on file structure

gsap.registerPlugin(ScrollTrigger)

const ScrollExpandingCircle = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const patternRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !circleRef.current || !textRef.current || !gradientRef.current || !patternRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      })

      // 1. Text Transformation - "Comic Impact" effect
      tl.to(textRef.current, {
        scale: 2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.3,
        ease: "power2.in"
      }, 0)

      // 2. Scale up the circle (The "Ink Drop" expanding)
      tl.to(circleRef.current, {
        scale: 60, 
        duration: 1,
        ease: "power2.inOut",
      }, 0)

      // 3. Gradient & Pattern Reveal
      // Fade in the vibrant comic gradient
      tl.to(gradientRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut"
      }, "<")
      
      // Fade in the SVG pattern for texture
      tl.to(patternRef.current, {
        opacity: 0.1, // Subtle texture
        rotation: 45, // Spin the pattern slightly as it reveals
        scale: 0.5, // Parallax depth effect
        duration: 1,
        ease: "none"
      }, 0)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-white dark:bg-zinc-950">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000">
        
        {/* The "Ink Drop" Circle */}
        <div 
          ref={circleRef}
          className="relative flex items-center justify-center w-32 h-32 md:w-64 md:h-64 rounded-full z-10 origin-center bg-black dark:bg-white overflow-hidden will-change-transform shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
        >
          {/* Base Background */}
          <div className="absolute inset-0 bg-black dark:bg-white transition-colors duration-300" />
          
          {/* Comic Vibrant Gradient Overlay */}
          <div 
            ref={gradientRef}
            className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 opacity-0"
          />

          {/* Texture Pattern (Using the HeroSvg) */}
          <div 
            ref={patternRef}
            className="absolute inset-0 opacity-0 flex items-center justify-center pointer-events-none"
          >
             <div className="w-[10vw] h-[10vw] opacity-50"> 
                {/* Reusing your hero SVG as a texture pattern inside the expansion */}
                <HeroSvgComponent props="w-full h-full text-white mix-blend-overlay" />
             </div>
          </div>

          {/* Text Content */}
          <p 
            ref={textRef}
            className="relative z-20 text-white dark:text-black font-black text-xl md:text-3xl tracking-tighter whitespace-nowrap px-4 text-center pointer-events-none uppercase italic"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            Enter the Story
          </p>
        </div>

      </div>
    </div>
  )
}

export default ScrollExpandingCircle

