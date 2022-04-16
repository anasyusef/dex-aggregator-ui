import { useWeb3 } from "contexts/Web3Provider";
import React from "react";
import { getProviderName } from "utils/provider";
import Image, { ImageProps } from "next/image";
import coinbaseWalletIcon from "assets/images/coinbaseWalletIcon.svg";
import metamaskIcon from "assets/images/metamask.png";
import walletConnectIcon from "assets/images/walletConnectIcon.svg";
import jazzicon from "@metamask/jazzicon";

type Props = {
  height?: number;
  width?: number;
};

export default function ProviderIcon({ height = 20, width = 20 }: Props) {
  const { account, provider } = useWeb3();
  if (!provider || !account) return null;

  const providerName = getProviderName(provider.provider);
  let Icon = null;

  const props: Omit<ImageProps, "src"> = {
    height,
    width,
  };

  switch (providerName) {
    case "coinbasewallet": {
      Icon = (
        <Image {...props} src={coinbaseWalletIcon} alt="coinbase wallet icon" />
      );
      break;
    }
    case "metamask": {
      Icon = (
        <div
          style={{ display: "flex", alignItems: "center" }}
          dangerouslySetInnerHTML={{
            __html: jazzicon(
              Math.floor((height + width) / 2),
              parseInt(account.slice(2, 10), 16)
            ).outerHTML,
          }}
        />
      );
      break;
    }
    case "walletconnect": {
      Icon = (
        <Image {...props} src={walletConnectIcon} alt="walletconnect icon" />
      );
      break;
    }
  }
  return Icon;
}
