import { Currency } from "@uniswap/sdk-core";
import { SupportedChainId } from "constants/chains";
import useHttpLocations from "hooks/useHttpLocations";
import { useMemo } from "react";
import { WrappedTokenInfo } from "state/lists/wrappedTokenInfo";

// import EthereumLogo from "../../assets/images/ethereum-logo.png";
// import MaticLogo from "../../assets/svg/matic-token-icon.svg";

type Network = "ethereum";

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  return "ethereum";
}

function getNativeLogoURI(
  chainId: SupportedChainId = SupportedChainId.MAINNET
): string {
  switch (chainId) {
    case SupportedChainId.POLYGON_MUMBAI:
    case SupportedChainId.POLYGON:
      return "/assets/svg/matic-token-icon.svg";
    default:
      return "/assets/images/ethereum-logo.png";
  }
}

function getTokenLogoURI(
  address: string,
  chainId: SupportedChainId = SupportedChainId.MAINNET
): string | void {
  const networkName = chainIdToNetworkName(chainId);
  const networksWithUrls = [SupportedChainId.MAINNET];
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`;
  }
}

export default function useCurrencyLogoURIs(
  currency?: Currency | null
): string[] {
  const locations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );
  return useMemo(() => {
    const logoURIs = [...locations];
    if (currency) {
      if (currency.isNative) {
        logoURIs.push(getNativeLogoURI(currency.chainId));
      } else if (currency.isToken) {
        const logoURI = getTokenLogoURI(currency.address, currency.chainId);
        if (logoURI) {
          logoURIs.push(logoURI);
        }
      }
    }
    return logoURIs;
  }, [currency, locations]);
}
