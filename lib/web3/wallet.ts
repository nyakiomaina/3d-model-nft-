"use client"

import { SCROLL_MAINNET_CONFIG, WALLETCONNECT_PROJECT_ID } from "./config"

export { WALLETCONNECT_PROJECT_ID }

export type WalletProvider = "metamask" | "walletconnect"

let walletConnectProvider: any = null

function selectInjectedMetaMask(): any | null {
  if (typeof window === "undefined") return null
  const eth: any = (window as any).ethereum
  if (!eth) return null
  // Prefer a true MetaMask provider (exclude Rabby/others that spoof isMetaMask)
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const strictMetaMask = eth.providers.find(
      (p: any) => p && p.isMetaMask && !p.isRabby && typeof p._metamask === "object"
    )
    if (strictMetaMask) return strictMetaMask

    const nonRabbyMetaMask = eth.providers.find((p: any) => p && p.isMetaMask && !p.isRabby)
    if (nonRabbyMetaMask) return nonRabbyMetaMask

    const anyMetaMask = eth.providers.find((p: any) => p && p.isMetaMask)
    if (anyMetaMask) return anyMetaMask

    return eth.providers[0]
  }

  // Single provider case
  if (eth.isMetaMask && !eth.isRabby) return eth
  // If it's Rabby (spoofs isMetaMask), avoid selecting it so we can fall back to WC
  if (eth.isRabby) return null
  return eth
}

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
  const eth = selectInjectedMetaMask()
  if (!eth) {
    alert("Please install MetaMask or use WalletConnect for mobile wallets!")
    return null
  }

  try {
    const accounts = await eth.request({
      method: "eth_requestAccounts",
    })

    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SCROLL_MAINNET_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await eth.request({
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

  try {
    const eth = selectInjectedMetaMask()
    if (!eth) return null
    const accounts = await eth.request({
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
  return selectInjectedMetaMask() || (window as any).ethereum
}

declare global {
  interface Window {
    ethereum?: any
  }
}
