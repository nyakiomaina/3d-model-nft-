"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ExternalLink, CheckCircle2, XCircle, Coins } from "lucide-react"
import { mintRoomNFT, type RoomData } from "@/lib/web3/contract"
import { SCROLL_MAINNET_CONFIG, MINT_PRICE } from "@/lib/web3/config"
import type { SceneObject } from "@/types/room"

interface MintRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  objects: SceneObject[]
}

export function MintRoomDialog({ open, onOpenChange, objects }: MintRoomDialogProps) {
  const [roomName, setRoomName] = useState("")
  const [colorTheme, setColorTheme] = useState("cyberpunk")
  const [lightingIntensity, setLightingIntensity] = useState(5)
  const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleMint = async () => {
    if (!roomName.trim()) {
      setErrorMessage("Please enter a room name")
      return
    }

    if (objects.length === 0) {
      setErrorMessage("Please add at least one object to your room")
      return
    }

    setStatus("minting")
    setErrorMessage("")

    const roomData: RoomData = {
      roomName: roomName.trim(),
      colorTheme,
      lightingIntensity,
      objects: objects.map((obj) => obj.type),
    }

    const hash = await mintRoomNFT(roomData)

    if (hash) {
      setStatus("success")
      setTxHash(hash)

      try {
        const existingRooms = JSON.parse(localStorage.getItem("vibeverse_rooms") || "[]")
        const newRoom = {
          id: hash,
          name: roomData.roomName,
          colorTheme: roomData.colorTheme,
          metadata: JSON.stringify({
            name: roomData.roomName,
            description: `A unique vibe room in the VibeVerse metaverse`,
            attributes: [
              { trait_type: "Color Theme", value: roomData.colorTheme },
              { trait_type: "Lighting Intensity", value: roomData.lightingIntensity },
              { trait_type: "Objects", value: roomData.objects.join(", ") },
              { trait_type: "Object Count", value: roomData.objects.length },
            ],
          }),
          txHash: hash,
          timestamp: Date.now(),
        }
        existingRooms.push(newRoom)
        localStorage.setItem("vibeverse_rooms", JSON.stringify(existingRooms))
        console.log("[v0] Room saved to localStorage for explore page")
      } catch (e) {
        console.error("[v0] Error saving to localStorage:", e)
      }
    } else {
      setStatus("error")
      setErrorMessage("Failed to mint NFT. Please try again.")
    }
  }

  const handleClose = () => {
    setStatus("idle")
    setTxHash(null)
    setErrorMessage("")
    setRoomName("")
    setColorTheme("cyberpunk")
    setLightingIntensity(5)
    onOpenChange(false)
  }

  const getBlockExplorerUrl = (hash: string) => {
    return `${SCROLL_MAINNET_CONFIG.blockExplorerUrls[0]}/tx/${hash}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="neon-text text-lg sm:text-xl">Mint Your Room as NFT</DialogTitle>
          <DialogDescription className="text-sm">
            Create a unique NFT of your 3D room on Scroll Mainnet
          </DialogDescription>
        </DialogHeader>

        {status === "idle" && (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Mint Price</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{MINT_PRICE} ETH</p>
                  <p className="text-xs text-muted-foreground">on Scroll Mainnet</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-name" className="text-sm font-medium">
                Room Name
              </Label>
              <Input
                id="room-name"
                placeholder="My Awesome Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-background border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-theme" className="text-sm font-medium">
                Color Theme
              </Label>
              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger id="color-theme" className="bg-background border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lighting" className="text-sm font-medium">
                Lighting Intensity (1-10)
              </Label>
              <Input
                id="lighting"
                type="number"
                min="1"
                max="10"
                value={lightingIntensity}
                onChange={(e) => setLightingIntensity(Number(e.target.value))}
                className="bg-background border-primary/20 focus:border-primary"
              />
            </div>

            <div className="rounded-lg bg-muted/50 border border-primary/10 p-3 space-y-1">
              <p className="text-sm font-medium">Room Details</p>
              <p className="text-xs text-muted-foreground">Objects: {objects.length}</p>
              <p className="text-xs text-muted-foreground">
                Types: {Array.from(new Set(objects.map((o) => o.type))).join(", ")}
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <Button
              onClick={handleMint}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg hover:shadow-primary/50 transition-all duration-300"
              size="lg"
            >
              Mint NFT for {MINT_PRICE} ETH
            </Button>
          </div>
        )}

        {status === "minting" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2 px-4">
              <p className="font-medium">Minting your room NFT...</p>
              <p className="text-sm text-muted-foreground">Please confirm the transaction in your wallet</p>
              <p className="text-xs text-primary font-semibold">Cost: {MINT_PRICE} ETH + gas fees</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4 px-4">
            <div className="rounded-full bg-green-500/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-bold text-xl">NFT Minted Successfully!</p>
              <p className="text-sm text-muted-foreground">Your room has been minted as an NFT on Scroll Mainnet</p>
            </div>
            {txHash && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 bg-transparent border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <a href={getBlockExplorerUrl(txHash)} target="_blank" rel="noopener noreferrer">
                  View on Explorer
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              onClick={handleClose}
              className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Close
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4 px-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-bold text-xl">Minting Failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
            <Button
              onClick={() => setStatus("idle")}
              className="w-full mt-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
