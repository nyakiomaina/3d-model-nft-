"use client"

import { SCROLL_MAINNET_CONFIG, WALLETCONNECT_PROJECT_ID } from "./config"

export { WALLETCONNECT_PROJECT_ID }

export type WalletProvider = "metamask" | "walletconnect"

let walletConnectProvider: any = null

async function initWalletConnect() {
  if (typeof window === "undefined") return null

  try {
    // Dynamically import WalletConnect
    const WalletConnectProvider = (await import("@walletconnect/ethereum-provider")).default

    walletConnectProvider = await WalletConnectProvider.init({
      projectId: WALLETCONNECT_PROJECT_ID,
      chains: [SCROLL_MAINNET_CONFIG.chainId],
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
        themeVariables: {
          "--wcm-z-index": "9999",
        },
      },
      rpcMap: {
        [SCROLL_MAINNET_CONFIG.chainId]: SCROLL_MAINNET_CONFIG.rpcUrls[0],
      },
      metadata: {
        name: "VibeVerse",
        description: "Create and mint 3D rooms as NFTs",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: ["https://vibeverse.app/icon.png"],
      },
    })

    return walletConnectProvider
  } catch (error) {
    return null
  }
}

export async function connectWallet(provider: WalletProvider = "metamask"): Promise<string | null> {
  if (provider === "walletconnect") {
    return connectWithWalletConnect()
  }
  return connectWithMetaMask()
}

async function connectWithMetaMask(): Promise<string | null> {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask or use WalletConnect for mobile wallets!")
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SCROLL_MAINNET_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${SCROLL_MAINNET_CONFIG.chainId.toString(16)}`,
              chainName: SCROLL_MAINNET_CONFIG.chainName,
              nativeCurrency: SCROLL_MAINNET_CONFIG.nativeCurrency,
              rpcUrls: SCROLL_MAINNET_CONFIG.rpcUrls,
              blockExplorerUrls: SCROLL_MAINNET_CONFIG.blockExplorerUrls,
            },
          ],
        })
      } else {
        throw switchError
      }
    }

    localStorage.setItem("walletProvider", "metamask")
    return accounts[0]
  } catch (error) {
    return null
  }
}

async function connectWithWalletConnect(): Promise<string | null> {
  try {
    const provider = await initWalletConnect()
    if (!provider) {
      alert("Failed to initialize WalletConnect")
      return null
    }

    await provider.connect()
    const accounts = await provider.request({ method: "eth_accounts" })

    localStorage.setItem("walletProvider", "walletconnect")
    return accounts[0] || null
  } catch (error) {
    return null
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  const savedProvider = localStorage.getItem("walletProvider")

  if (savedProvider === "walletconnect" && walletConnectProvider) {
    try {
      const accounts = await walletConnectProvider.request({ method: "eth_accounts" })
      return accounts[0] || null
    } catch (error) {
      return null
    }
  }

  if (typeof window.ethereum === "undefined") {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    })
    return accounts[0] || null
  } catch (error) {
    return null
  }
}

export async function disconnectWallet(): Promise<void> {
  const savedProvider = localStorage.getItem("walletProvider")

  if (savedProvider === "walletconnect" && walletConnectProvider) {
    await walletConnectProvider.disconnect()
    walletConnectProvider = null
  }

  localStorage.removeItem("walletProvider")
}

export function getCurrentProvider() {
  const savedProvider = localStorage.getItem("walletProvider")
  if (savedProvider === "walletconnect" && walletConnectProvider) {
    return walletConnectProvider
  }
  return window.ethereum
}

declare global {
  interface Window {
    ethereum?: any
  }
}
