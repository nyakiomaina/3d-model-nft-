"use client"

import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Cable as Cube, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5 animate-fade-in-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group animate-slide-in-left">
            <div className="relative">
              <Cube className="h-8 w-8 text-primary transition-all duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-125 drop-shadow-[0_0_12px_rgba(0,180,255,0.6)]" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wider">
              VibeVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="relative text-foreground/70 hover:text-primary transition-all duration-300 font-medium group animate-fade-in delay-100"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="#how-it-works"
              className="relative text-foreground/70 hover:text-primary transition-all duration-300 font-medium group animate-fade-in delay-200"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="/explore"
              className="relative text-foreground/70 hover:text-primary transition-all duration-300 font-medium group animate-fade-in delay-300"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="/create"
              className="relative text-foreground/70 hover:text-primary transition-all duration-300 font-medium group animate-fade-in delay-400"
            >
              Create
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden md:block animate-slide-in-right">
            <WalletConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-lg animate-fade-in-down">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium py-2 hover:translate-x-2 hover:pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium py-2 hover:translate-x-2 hover:pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/explore"
              className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium py-2 hover:translate-x-2 hover:pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium py-2 hover:translate-x-2 hover:pl-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create
            </Link>
            <div className="pt-2 border-t border-border/50">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
