import { Currency, Token } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import useCurrencyLogoURIs from "hooks/useCurrencyLogoURIs";
import { useCallback, useState } from "react";

export default function useAddTokenToMetamask(
  currencyToAdd: Currency | undefined
): {
  addToken: () => void;
  success: boolean | undefined;
} {
  const { library } = useActiveWeb3();

  const token: Token | undefined = currencyToAdd?.wrapped;

  const [success, setSuccess] = useState<boolean | undefined>();
  const logoURL = useCurrencyLogoURIs(token)[0];

  const addToken = useCallback(() => {
    if (
      library &&
      library?.provider?.isMetaMask &&
      library.provider.request &&
      token
    ) {
      library.provider
        .request({
          method: "wallet_watchAsset",
          params: {
            //@ts-ignore // need this for incorrect ethers provider type
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: logoURL,
            },
          },
        })
        .then((success) => {
          setSuccess(success);
        })
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [library, logoURL, token]);

  return { addToken, success };
}
