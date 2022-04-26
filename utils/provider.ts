import { ExternalProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import Authereum from "authereum";

type SupportedProviders =
  | "walletconnect"
  | "coinbasewallet"
  | "authereum"
  | "metamask"
  | undefined;

export function getProviderName(
  provider: ExternalProvider
): SupportedProviders {
  if (provider.isMetaMask) return "metamask";
  if (provider instanceof WalletConnectProvider) return "walletconnect";
  if (provider instanceof CoinbaseWalletProvider) return "coinbasewallet";
  if (provider instanceof Authereum) return "authereum";
}

export function getFormattedProviderName(provider: ExternalProvider) {
  const name = getProviderName(provider);

  switch (name) {
    case "walletconnect": {
      return "WalletConnect";
    }
    case "coinbasewallet": {
      return "Coinbase";
    }
    case "authereum": {
      return "Authereum";
    }
    case "metamask": {
      return "MetaMask";
    }
    default: {
      return "Unknown";
    }
  }
}
