"use client"

import { ethers } from "ethers"
import { VIBE_ROOM_NFT_ADDRESS, MINT_PRICE } from "./config"
import type { Room } from "@/types/room"

export const VIBE_ROOM_ABI = [
  "function mintRoom(string memory roomName, string memory colorTheme, string memory metadata) public payable returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function getMintPrice() public pure returns (uint256)",
  "function getRoomData(uint256 tokenId) public view returns (string memory roomName, string memory colorTheme, string memory metadata, uint256 timestamp)",
  "event RoomMinted(address indexed owner, uint256 indexed tokenId, string roomName)",
]

export interface RoomData {
  roomName: string
  colorTheme: string
  lightingIntensity: number
  objects: string[]
}

export async function mintRoomNFT(roomData: RoomData): Promise<string | null> {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask!")
    return null
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(VIBE_ROOM_NFT_ADDRESS, VIBE_ROOM_ABI, signer)

    const metadata = JSON.stringify({
      name: roomData.roomName,
      description: `A unique vibe room in the VibeVerse metaverse`,
      attributes: [
        { trait_type: "Color Theme", value: roomData.colorTheme },
        { trait_type: "Lighting Intensity", value: roomData.lightingIntensity },
        { trait_type: "Objects", value: roomData.objects.join(", ") },
        { trait_type: "Object Count", value: roomData.objects.length },
      ],
    })

    const mintPrice = ethers.parseEther(MINT_PRICE)
    const tx = await contract.mintRoom(roomData.roomName, roomData.colorTheme, metadata, {
      value: mintPrice,
    })

    const receipt = await tx.wait()

    const existingRooms = JSON.parse(localStorage.getItem("vibeverse_rooms") || "[]")
    existingRooms.push({
      id: receipt.blockNumber.toString(),
      name: roomData.roomName,
      colorTheme: roomData.colorTheme,
      metadata,
      txHash: tx.hash,
      timestamp: Date.now(),
    })
    localStorage.setItem("vibeverse_rooms", JSON.stringify(existingRooms))

    return tx.hash
  } catch (error) {
    return null
  }
}

export async function getUserRooms(address: string): Promise<number> {
  if (typeof window.ethereum === "undefined") {
    return 0
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(VIBE_ROOM_NFT_ADDRESS, VIBE_ROOM_ABI, provider)
    const balance = await contract.balanceOf(address)
    return Number(balance)
  } catch (error) {
    return 0
  }
}

export async function getAllRooms(): Promise<Room[]> {
  try {
    const localRooms = JSON.parse(localStorage.getItem("vibeverse_rooms") || "[]")

    if (localRooms.length > 0) {
      return localRooms.map((room: any, index: number) => {
        let objects = []
        try {
          const metadata = JSON.parse(room.metadata)
          const objectTypes =
            metadata.attributes?.find((attr: any) => attr.trait_type === "Objects")?.value?.split(", ") || []
          objects = objectTypes.map((type: string, idx: number) => ({
            id: `${type}-${idx}`,
            type: type.toLowerCase(),
            position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            color: "#00B4FF",
          }))
        } catch (e) {}

        return {
          id: room.id || index.toString(),
          name: room.name,
          description: `A ${room.colorTheme} themed room`,
          objects,
          createdAt: new Date(room.timestamp).toISOString(),
          creatorAddress: "0x000000000000000000000000000000000000000",
          nftTokenId: room.id || index.toString(),
        }
      })
    }
  } catch (error) {}

  if (typeof window.ethereum === "undefined") {
    return []
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(VIBE_ROOM_NFT_ADDRESS, VIBE_ROOM_ABI, provider)

    const totalSupply = await contract.totalSupply()
    const total = Number(totalSupply)

    const rooms: Room[] = []

    for (let i = 0; i < total; i++) {
      try {
        const roomData = await contract.getRoomData(i)
        const owner = await contract.ownerOf(i)

        let objects = []
        try {
          const metadata = JSON.parse(roomData.metadata)
          const objectTypes =
            metadata.attributes?.find((attr: any) => attr.trait_type === "Objects")?.value?.split(", ") || []
          objects = objectTypes.map((type: string, index: number) => ({
            id: `${type}-${index}`,
            type: type.toLowerCase(),
            position: [Math.random() * 4 - 2, 0, Math.random() * 4 - 2] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            color: "#00B4FF",
          }))
        } catch (e) {}

        rooms.push({
          id: i.toString(),
          name: roomData.roomName,
          description: `A ${roomData.colorTheme} themed room`,
          objects,
          createdAt: new Date(Number(roomData.timestamp) * 1000).toISOString(),
          creatorAddress: owner,
          nftTokenId: i.toString(),
        })
      } catch (error) {}
    }

    return rooms
  } catch (error) {
    return []
  }
}
