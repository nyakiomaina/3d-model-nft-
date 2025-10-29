"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Blockchain Chain Image - Right Side */}
      <div className="absolute right-0 top-20 w-1/2 h-1/2 opacity-60 pointer-events-none z-0">
        <img src="/futuristic-glowing-cyan-blockchain-chain-link-3d-r.jpg" alt="" className="w-full h-full object-contain animate-float" />
      </div>

      {/* Glowing Hand Image - Right Bottom */}
      <div className="absolute right-0 bottom-20 w-1/3 h-1/3 opacity-50 pointer-events-none z-0">
        <img src="/futuristic-glowing-cyan-wireframe-hand-holding-blo.jpg" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Particle dots background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-300" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 sm:mb-8 neon-border animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Unleashing the Power of Web3</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance leading-tight animate-fade-in-up">
            Unleashing the Power of <span className="text-primary neon-text">3D NFTs</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 text-pretty max-w-2xl mx-auto leading-relaxed px-4 animate-fade-in-up delay-100">
            Transforming creativity with secure, decentralized, and transparent 3D room NFTs on the blockchain
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 animate-fade-in-up delay-200">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto neon-glow bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg group rounded-full"
            >
              <Link href="/create">
                Get Started with 3D NFTs
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary/50 hover:border-primary px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold bg-transparent hover:bg-primary/10 rounded-full"
            >
              <Link href="/explore">Discover How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
