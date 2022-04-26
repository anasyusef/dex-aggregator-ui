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
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useWeb3 } from "contexts/Web3Provider";
import useDebounce from "hooks/useDebounce";
import * as React from "react";
import TokenListItem from "./TokenListItem";

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

interface IGetTokens {
  chainId?: number;
  tokens: TokenInfo[];
  searchTerm: string;
  isNetworkSupported: boolean;
  isAccountActive: boolean;
}

function getTokens({
  chainId,
  isAccountActive,
  isNetworkSupported,
  searchTerm,
  tokens,
}: IGetTokens) {
  if (!chainId || (!isNetworkSupported && isAccountActive)) {
    chainId = SupportedChainId.MAINNET;
  }
  const chainInfo = CHAIN_INFO[chainId];
  const nativeCurrencyTokenInfo: TokenInfo = {
    ...chainInfo.nativeCurrency,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId,
    logoURI: chainInfo.logoUrl,
  };
  const tokensWithNative = [nativeCurrencyTokenInfo, ...tokens];
  return tokensWithNative.filter((token) => {
    const isChainIdMatch = token.chainId === chainId;
    const isStartsWithMatch = token.symbol
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());
    const isAddressMatch =
      token.address.toLowerCase() === searchTerm.toLowerCase();
    return isChainIdMatch && (isStartsWithMatch || isAddressMatch);
  });
}

type Props = {
  isLoading: boolean;
  searchTerm: string;
  onTokenItemClick: (value: TokenInfo) => void;
  selectedToken?: TokenInfo;
} & (
  | {
      isSuccess: true;
      data: TokenInfo[];
    }
  | {
      isSuccess: false;
      data: undefined;
    }
);

export default function TokensList({
  isLoading,
  isSuccess,
  data,
  searchTerm,
  selectedToken,
  onTokenItemClick,
}: Props) {
  let { chainId, isAccountActive, isNetworkSupported } = useWeb3();
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  const handleTokenItemClick = (value: TokenInfo) => {
    onTokenItemClick(value);
  };

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
    const tokens = getTokens({
      chainId,
      isAccountActive,
      isNetworkSupported,
      searchTerm: debouncedSearchTerm,
      tokens: data,
    });
    return (
      <List>
        {tokens.length === 0 && "No results found"}
        {tokens.map((value) => (
          <TokenListItem
            disabled={
              selectedToken
                ? selectedToken.address.toLowerCase() ===
                  value.address.toLowerCase()
                : false
            }
            onClick={() => handleTokenItemClick(value)}
            key={value.address}
            logoURI={value.logoURI}
            symbol={value.symbol}
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
