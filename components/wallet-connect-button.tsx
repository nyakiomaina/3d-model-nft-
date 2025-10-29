"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Smartphone, Chrome } from "lucide-react"
import { connectWallet, getConnectedAccount, disconnectWallet } from "@/lib/web3/wallet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function WalletConnectButton() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkConnection()

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null)
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }
  }, [])

  async function checkConnection() {
    const connectedAccount = await getConnectedAccount()
    setAccount(connectedAccount)
  }

  async function handleConnect(provider: "metamask" | "walletconnect") {
    setIsConnecting(true)
    const connectedAccount = await connectWallet(provider)
    setAccount(connectedAccount)
    setIsConnecting(false)
  }

  async function handleDisconnect() {
    await disconnectWallet()
    setAccount(null)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105">
            <Wallet className="mr-2 h-5 w-5" />
            {formatAddress(account)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive cursor-pointer">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isConnecting}
          className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <Wallet className="mr-2 h-5 w-5" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleConnect("metamask")} className="cursor-pointer py-3">
          <Chrome className="mr-3 h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-medium">Browser Wallet</span>
            <span className="text-xs text-muted-foreground">MetaMask, Coinbase, etc.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleConnect("walletconnect")} className="cursor-pointer py-3">
          <Smartphone className="mr-3 h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-medium">Mobile Wallet</span>
            <span className="text-xs text-muted-foreground">Trust, Rainbow, etc.</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
