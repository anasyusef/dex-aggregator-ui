import ethereumLogoUrl from "assets/images/ethereum-logo.png";
import arbitrumLogoUrl from "assets/svg/arbitrum_logo.svg";
import optimismLogoUrl from "assets/svg/optimistic_ethereum.svg";
import polygonMaticLogo from "assets/svg/polygon-matic-logo.svg";
import { StaticImageData } from "next/image";

import { SupportedChainId } from "./chains";

export enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly networkType: NetworkType;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  //   readonly infoLink: string;
  readonly logoUrl: StaticImageData;
  readonly label: string;
  readonly helpCenterUrl?: string;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
}

export type ChainInfoMap = { readonly [chainId: number]: BaseChainInfo } & {
  readonly [chainId in SupportedChainId]: BaseChainInfo;
};

export const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    networkType: NetworkType.L1,
    docs: "https://docs.uniswap.org/",
    explorer: "https://etherscan.io/",
    // infoLink: "https://info.uniswap.org/#/",
    label: "Ethereum",
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  [SupportedChainId.ROPSTEN]: {
    networkType: NetworkType.L1,
    docs: "https://docs.uniswap.org/",
    explorer: "https://ropsten.etherscan.io/",
    // infoLink: "https://info.uniswap.org/#/",
    label: "Ropsten",
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: "Ropsten Ether", symbol: "ropETH", decimals: 18 },
  },
  [SupportedChainId.POLYGON]: {
    networkType: NetworkType.L1,
    // blockWaitMsBeforeWarning: ms`10m`,
    bridge: "https://wallet.polygon.technology/bridge",
    docs: "https://polygon.io/",
    explorer: "https://polygonscan.com/",
    label: "Polygon",
    logoUrl: polygonMaticLogo,
    nativeCurrency: { name: "Polygon Matic", symbol: "MATIC", decimals: 18 },
  },
  [SupportedChainId.POLYGON_MUMBAI]: {
    networkType: NetworkType.L1,
    // blockWaitMsBeforeWarning: ms`10m`,
    bridge: "https://wallet.polygon.technology/bridge",
    docs: "https://polygon.io/",
    explorer: "https://mumbai.polygonscan.com/",
    label: "Polygon Mumbai",
    logoUrl: polygonMaticLogo,
    nativeCurrency: {
      name: "Polygon Mumbai Matic",
      symbol: "mMATIC",
      decimals: 18,
    },
  },
};
