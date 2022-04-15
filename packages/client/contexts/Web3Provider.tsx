import {
  createContext,
  ReactChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Authereum from "authereum";
import Web3Modal, { IProviderOptions } from "web3modal";
import { ethers, providers } from "ethers";

const Web3Context = createContext<any>(null);

export default function Web3Provider({ children }: { children: ReactNode }) {
  // const web3Modal = useRef<Web3Modal>()
  const providerOptions: IProviderOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "7449d8ef8c5946acb839c0f74fcc9036",
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: "7449d8ef8c5946acb839c0f74fcc9036", // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 1, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
    authereum: {
      package: Authereum, // required
    },
  };

  const connect = async () => {
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
  };
  let web3Modal: Web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
  }
  //   if (!)
  //   useEffect(() => {
  //       web3Modal.current = new Web3Modal({
  //         disableInjectedProvider: false,
  //         network: "mainnet", // optional
  //         cacheProvider: false, // optional
  //         providerOptions, // required
  //       });
  //   }, [])

  const getProvider = (instance: any) => {
    return new ethers.providers.Web3Provider(instance);
  };

  return (
    <Web3Context.Provider
      value={{ connect: web3Modal?.connect, getProvider: getProvider }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const web3Provider = useContext(Web3Context);
  if (!web3Provider) {
    throw new Error(
      "Calling hook from outside context. Make sure the app is wrapped with Web3Provider"
    );
  }
  return web3Provider;
}
