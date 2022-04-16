import { IWeb3Provider, Web3Context } from "./Web3Provider";
import { useContext } from "react";

export function useWeb3(): IWeb3Provider {
  const web3Provider = useContext(Web3Context);
  if (!web3Provider) {
    throw new Error(
      "Calling hook from outside context. Make sure the app is wrapped with Web3Provider"
    );
  }
  return web3Provider;
}
