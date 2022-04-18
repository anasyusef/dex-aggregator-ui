import FolderIcon from "@mui/icons-material/Folder";
import {
  ListItemButton,
  ListItemSecondaryAction,
  Skeleton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { TokenInfo } from "@uniswap/token-lists";
import * as React from "react";
import Image from "next/image";
import { useWeb3 } from "contexts/Web3Provider";
import { SupportedChainId } from "constants/chains";
import TokenListItem from "./TokenListItem";
import useDebounce from "hooks/useDebounce";

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

type Props = {
  isLoading: boolean;
  searchTerm: string;
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
  return tokens.filter((token) => {
    const isChainIdMatch = token.chainId === chainId;
    const isStartsWithMatch = token.symbol.toLowerCase().startsWith(searchTerm);
    const isAddressMatch =
      token.address.toLowerCase() === searchTerm.toLowerCase();
    return isChainIdMatch && (isStartsWithMatch || isAddressMatch);
  });
}

export default function TokensList({
  isLoading,
  isSuccess,
  data,
  searchTerm,
}: Props) {
  let { chainId, isAccountActive, isNetworkSupported } = useWeb3();
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

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
    console.log(tokens);
    const SIZE = 30;
    return (
      <List>
        {tokens.map((value) => (
          <TokenListItem
            key={value.address}
            address={value.address}
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
