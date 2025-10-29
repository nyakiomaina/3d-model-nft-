"use client"

import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Cable as Cube, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Cube className="h-7 w-7 text-primary transition-all duration-300 group-hover:rotate-12" />
            <span className="text-xl font-bold text-foreground">
              Vibe<span className="text-primary">Verse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Why 3D NFTs
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/explore"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              How It Works
            </Link>
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why 3D NFTs
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
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
