"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, User, Calendar, Sparkles } from "lucide-react"
import { RoomPreview3D } from "@/components/room-preview-3d"
import { SCROLL_MAINNET_CONFIG } from "@/lib/web3/config"
import type { Room } from "@/types/room"

interface RoomCardProps {
  room: Room
  isOwner: boolean
}

export function RoomCard({ room, isOwner }: RoomCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getBlockExplorerUrl = (tokenId: string) => {
    return `${SCROLL_MAINNET_CONFIG.blockExplorerUrls[0]}/token/${room.nftTokenId}`
  }

  return (
    <Card className="overflow-hidden group hover:neon-border transition-all duration-500 bg-card/50 backdrop-blur-sm hover-lift hover:scale-[1.02]">
      {/* 3D Preview */}
      <div className="aspect-video bg-background/50 relative overflow-hidden">
        <RoomPreview3D objects={room.objects} />
        {isOwner && (
          <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            Your Room
          </Badge>
        )}
      </div>

      {/* Room Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-1 transition-colors duration-300 group-hover:text-primary">
            {room.name}
          </h3>
          {room.description && <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{formatAddress(room.creatorAddress)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(room.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs transition-all duration-300 hover:bg-primary/20">
            {room.objects.length} objects
          </Badge>
          <Badge variant="secondary" className="text-xs transition-all duration-300 hover:bg-primary/20">
            {Array.from(new Set(room.objects.map((o) => o.type))).length} types
          </Badge>
        </div>

        {room.nftTokenId && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full gap-2 bg-transparent transition-all duration-300 hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,180,255,0.4)]"
          >
            <a href={getBlockExplorerUrl(room.nftTokenId)} target="_blank" rel="noopener noreferrer">
              View NFT
              <ExternalLink className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  )
}
