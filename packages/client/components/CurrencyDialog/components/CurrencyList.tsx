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
import { Currency, Token } from "@uniswap/sdk-core";
import { useAllTokens } from "hooks/Tokens";
import useDebounce from "hooks/useDebounce";
import useNativeCurrency from "hooks/useNativeCurrency";
import { getTokenFilter } from "hooks/useTokenList/filtering";
import {
  tokenComparator,
  useSortTokensByQuery,
} from "hooks/useTokenList/sorting";
import * as React from "react";
import { useMemo } from "react";
import { useAllTokenBalances } from "state/wallet/hooks";
import CurrencyItem from "./CurrencyItem";

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

type Props = {
  searchTerm: string;
  onCurrencySelect: (value: Currency) => void;
  selectedCurrency?: Currency | null;
};

export default function CurrencyList({
  searchTerm,
  selectedCurrency,
  onCurrencySelect,
}: Props) {
  const debouncedQuery = useDebounce(searchTerm, 100);

  const handleCurrencySelect = (value: Currency) => {
    onCurrencySelect(value);
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
            onSelect={() => handleCurrencySelect(value)}
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
