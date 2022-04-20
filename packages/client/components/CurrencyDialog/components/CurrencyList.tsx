import { Interface } from "@ethersproject/abi";
import FolderIcon from "@mui/icons-material/Folder";
import {
  ListItemButton,
  ListItemSecondaryAction,
  Skeleton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { TokenInfo } from "@uniswap/token-lists";
import { Erc20Interface } from "abis/types/Erc20";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useActiveWeb3, useWeb3 } from "contexts/Web3Provider";
import { useMultipleContractSingleData } from "hooks/multicall";
import useDebounce from "hooks/useDebounce";
import * as React from "react";
import CurrencyItem from "./CurrencyItem";
import ERC20ABI from "abis/erc20.json";
import { useMemo } from "react";
import { CallState, CallStateResult } from "@uniswap/redux-multicall";
import useNativeCurrencyBalance from "hooks/useNativeCurrencyBalance";
import { useAllTokens } from "hooks/Tokens";
import useNativeCurrency from "hooks/useNativeCurrency";
import { useAllTokenBalances } from "state/wallet/hooks";
import { getTokenFilter } from "hooks/useTokenList/filtering";
import { Token, Currency } from "@uniswap/sdk-core";
import {
  tokenComparator,
  useSortTokensByQuery,
} from "hooks/useTokenList/sorting";

function generate(items: number, element: React.ReactElement) {
  return Array(items)
    .fill(0, 0, 20)
    .map(() => Math.random())
    .map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
}

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER";
}

interface IGetTokens {
  chainId?: number;
  tokens: Currency[];
  searchTerm: string;
  isNetworkSupported: boolean;
  isAccountActive: boolean;
}

// function getTokens({
//   chainId,
//   isAccountActive,
//   isNetworkSupported,
//   searchTerm,
//   tokens,
// }: IGetTokens) {
//   if (
//     !chainId ||
//     (!isNetworkSupported && isAccountActive) ||
//     !isAccountActive
//   ) {
//     chainId = SupportedChainId.MAINNET;
//   }
//   const tokensWithNative = [...tokens];
//   return tokensWithNative.filter((token) => {
//     const isChainIdMatch = token.chainId === chainId;
//     const isStartsWithMatch = token.symbol
//       .toLowerCase()
//       .startsWith(searchTerm.toLowerCase());
//     const isAddressMatch =
//       token.address.toLowerCase() === searchTerm.toLowerCase();
//     return isChainIdMatch && (isStartsWithMatch || isAddressMatch);
//   });
// }

type Props = {
  // isLoading: boolean;
  searchTerm: string;
  onCurrencySelect: (value: Currency) => void;
  selectedCurrency?: Currency | null;
};
// | {
//     isSuccess: true;
//     data: TokenInfo[];
//   }
// | {
//     isSuccess: false;
//     data: undefined;
//   }
// );

const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface;
const tokenBalancesGasRequirement = { gasRequired: 185_000 };

export default function TokensList({
  // isLoading,
  // isSuccess,
  // data,
  searchTerm,
  selectedCurrency,
  onCurrencySelect: onTokenItemClick,
}: Props) {
  let { chainId, isAccountActive, isNetworkSupported, account, signer } =
    useActiveWeb3();
  const debouncedQuery = useDebounce(searchTerm, 100);

  const { rawBalance, loading } = useNativeCurrencyBalance();

  const handleCurrencySelect = (value: Currency) => {
    onTokenItemClick(value);
  };

  const { allTokens, isLoading, isSuccess } = useAllTokens();

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(allTokens).filter(getTokenFilter(debouncedQuery));
  }, [allTokens, debouncedQuery]);

  const balances = useAllTokenBalances();

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator.bind(null, balances));
  }, [balances, filteredTokens]);

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    sortedTokens
  );

  const native = useNativeCurrency();
  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    if (!native) return filteredSortedTokens;

    const s = debouncedQuery.toLowerCase().trim();
    if (native.symbol?.toLowerCase()?.indexOf(s) !== -1) {
      return native ? [native, ...filteredSortedTokens] : filteredSortedTokens;
    }
    return filteredSortedTokens;
  }, [debouncedQuery, native, filteredSortedTokens]);

  console.log({ balances });
  // const t = getTokens({
  //   chainId,
  //   isAccountActive,
  //   isNetworkSupported,
  //   tokens: data,
  //   searchTerm: debouncedSearchTerm,
  // });

  // const chainInfo = CHAIN_INFO[chainId];

  // const nativeCurrencyTokenInfo: TokenInfo & { balanceInfo: CallState } = {
  //   ...chainInfo.nativeCurrency,
  //   address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //   chainId,
  //   logoURI: chainInfo.logoUrl,
  //   balanceInfo: { result: [{ balance: rawBalance }], loading },
  // };

  // const result = useMultipleContractSingleData(
  //   t.map((v) => v.address),
  //   ERC20Interface,
  //   "balanceOf",
  //   useMemo(() => [account], [account]),
  //   tokenBalancesGasRequirement
  // );
  // let counter = 0;
  // const tokensInfo = t.reduce((acc, current) => {
  //   const newObj = { ...current, balanceInfo: { ...result[counter] } };
  //   counter++;
  //   return [...acc, newObj];
  // }, []);

  // const tf = result[0].

  // const tokensInfoWithNative = [nativeCurrencyTokenInfo, ...tokensInfo];
  // console.log(tokensInfo);

  // console.log(result);

  if (isLoading) {
    return (
      <List>
        {generate(
          5,
          <ListItemButton disabled sx={{ px: 2 }}>
            <Skeleton>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </Skeleton>
            <ListItemText
              sx={{ ml: 1 }}
              primary={
                <Skeleton>
                  <Typography variant="button">ETH</Typography>
                </Skeleton>
              }
            />
            <ListItemSecondaryAction>
              <Skeleton>
                <Typography variant="button">0</Typography>
              </Skeleton>
            </ListItemSecondaryAction>
          </ListItemButton>
        )}
      </List>
    );
  }
  if (isSuccess) {
    return (
      <List>
        {filteredSortedTokensWithETH.length === 0 && "No results found"}
        {filteredSortedTokensWithETH.map((value) => (
          <CurrencyItem
            key={currencyKey(value)}
            disabled={selectedCurrency?.equals(value)}
            onClick={() => handleCurrencySelect(value)}
            currency={value}
          />
        ))}
      </List>
    );
  }

  return (
    <Typography color="error">
      There was an error while fetching the data
    </Typography>
  );
}
