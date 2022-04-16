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

export default function getProviderName(
  provider: ExternalProvider
): SupportedProviders {
  if (provider.isMetaMask) return "metamask";
  if (provider instanceof WalletConnectProvider) return "walletconnect";
  if (provider instanceof CoinbaseWalletProvider) return "coinbasewallet";
  if (provider instanceof Authereum) return "authereum";
}
