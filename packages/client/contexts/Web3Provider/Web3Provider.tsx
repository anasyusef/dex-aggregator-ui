import {
  createContext,
  ReactChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Authereum from "authereum";
import Web3Modal, { IProviderOptions } from "web3modal";
import { ethers, providers } from "ethers";

interface IWeb3State {
  provider?: ethers.providers.Web3Provider;
  account?: string;
  chainId?: number;
  isAccountActive: boolean;
  // modal: Web3Modal;
}

export interface IWeb3Provider extends IWeb3State {
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const Web3Context = createContext<IWeb3Provider>(
  null as unknown as IWeb3Provider
);

const INFURA_ID = "7449d8ef8c5946acb839c0f74fcc9036";

export default function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<number>();
  const provider = useRef<ethers.providers.Web3Provider>();
  const web3Modal = useRef<Web3Modal>();
  const connector = useRef<any>();
  // const web3Modal = useRef<Web3Modal>()
  const providerOptions: IProviderOptions = useMemo(
    () => ({
      /* See Provider Options Section */
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
          appName: "My Awesome App", // Required
          infuraId: INFURA_ID, // Required
          rpc: "", // Optional if `infuraId` is provided; otherwise it's required
          chainId: 1, // Optional. It defaults to 1 if not provided
          darkMode: false, // Optional. Use dark theme, defaults to false
        },
      },
      authereum: {
        package: Authereum, // required
      },
    }),
    []
  );

  const getWeb3Modal = useCallback(() => {
    if (!web3Modal.current && typeof window !== "undefined") {
      web3Modal.current = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });
    }
    return web3Modal.current as Web3Modal;
  }, [providerOptions]);

  const handleConnect = async (connection: any) => {
    const ethersProvider = new ethers.providers.Web3Provider(connection);
    const account = await ethersProvider.getSigner().getAddress();
    connector.current = connection;
    setAccount(account);
    setChainId(Number(connection.chainId));
    provider.current = ethersProvider;
    console.log(provider.current.provider instanceof WalletConnectProvider);
  };

  const disconnect = () => {
    const web3Modal = getWeb3Modal();
    web3Modal.clearCachedProvider();
    setAccount(undefined);
  };

  const setup = useCallback(async () => {
    const web3Modal = getWeb3Modal();
    if (web3Modal.cachedProvider) {
      const connection = await web3Modal.connect();
      await handleConnect(connection);
    }
  }, [getWeb3Modal]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    console.log(connector);
    if (connector.current) {
      // Subscribe to provider connection
      connector.current.on("accountsChanged", (accounts: string[]) => {
        console.log(accounts);
        setAccount(accounts[0]);
        console.log(provider.current?.provider);
      });

      // Subscribe to chainId change
      connector.current.on("chainChanged", (chainId: string) => {
        setChainId(Number(chainId));
      });

      // Subscribe to provider connection
      connector.current.on("connect", (info: { chainId: string }) => {
        setChainId(Number(chainId));
      });

      // Subscribe to provider disconnection
      connector.current.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          console.log(error);
        }
      );
    }
    return () => {
      if (connector.current) {
        connector.current.removeAllListeners();
        // console.log(connector.current.listenerCount());
      }
    };
  }, [account, chainId]);

  // if (typeof window !== "undefined") {
  //   console.log("registered")
  //   getWeb3Modal().on(
  //     "connect",
  //     (info: { chainId: number }) => {
  //       console.log("Connection");
  //       console.log(info);
  //     }
  //   );
  // }

  async function connect() {
    try {
      const web3Modal = getWeb3Modal();
      const connection = await web3Modal.connect();
      await handleConnect(connection);
    } catch (err) {
      console.log("error:", err);
    }
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        connect,
        provider: provider.current,
        isAccountActive: !!account,
        chainId,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
