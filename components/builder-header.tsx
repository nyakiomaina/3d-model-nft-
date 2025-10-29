"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cable as Cube, Save, Download, Trash2, ArrowLeft, Sparkles, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { MintRoomDialog } from "@/components/mint-room-dialog"
import type { SceneObject } from "@/types/room"

interface BuilderHeaderProps {
  objects: SceneObject[]
  onClear: () => void
}

export function BuilderHeader({ objects, onClear }: BuilderHeaderProps) {
  const { toast } = useToast()
  const [mintDialogOpen, setMintDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSave = () => {
    try {
      localStorage.setItem("vibeverse-room", JSON.stringify(objects))
      toast({
        title: "✅ Room Saved Successfully",
        description: `Saved ${objects.length} object(s) to your browser storage.`,
      })
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "Could not save room data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
      const dataStr = JSON.stringify(objects, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `vibeverse-room-${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "✅ Room Exported Successfully",
        description: `Downloaded ${objects.length} object(s) as JSON file to your device.`,
      })
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Could not export room data. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shadow-lg shadow-primary/5">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Cube className="h-5 w-5 sm:h-6 sm:w-6 text-primary drop-shadow-[0_0_8px_rgba(0,180,255,0.5)]" />
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Room Builder
            </span>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setMintDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
            disabled={objects.length === 0}
          >
            <Sparkles className="h-4 w-4" />
            Mint NFT
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            disabled={objects.length === 0}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2 bg-transparent hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            disabled={objects.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50 bg-transparent transition-all duration-300"
            disabled={objects.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setMintDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-purple-600 h-9 shadow-lg shadow-primary/30"
            disabled={objects.length === 0}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleSave()
                setMobileMenuOpen(false)
              }}
              className="w-full justify-start gap-2 bg-transparent hover:bg-primary/10"
              disabled={objects.length === 0}
            >
              <Save className="h-4 w-4" />
              Save to Browser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleExport()
                setMobileMenuOpen(false)
              }}
              className="w-full justify-start gap-2 bg-transparent hover:bg-primary/10"
              disabled={objects.length === 0}
            >
              <Download className="h-4 w-4" />
              Export to Device
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClear()
                setMobileMenuOpen(false)
              }}
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
              disabled={objects.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear Scene
            </Button>
          </div>
        </div>
      )}

      <MintRoomDialog open={mintDialogOpen} onOpenChange={setMintDialogOpen} objects={objects} />
    </>
  )
}
