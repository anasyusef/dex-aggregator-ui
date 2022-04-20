import CurrencyLogo from "@/components/CurrencyLogo";
import {
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import useCurrencyBalance from "hooks/useCurrencyBalance";
import { useState } from "react";
import { Currency } from "@uniswap/sdk-core";
import useCurrencyLogoURIs from "hooks/useCurrencyLogoURIs";

interface Props {
  currency: Currency;
  disabled?: boolean;
  onClick: () => void;
  decimals: number;
}

export default function CurrencyItem({ currency, onClick, disabled }: Props) {
  const SIZE = 30;
  const { account } = useActiveWeb3();
  const balance = useCurrencyBalance(account ?? undefined, currency);
  return (
    <ListItemButton disabled={disabled} onClick={onClick} sx={{ px: 2 }}>
      <ListItemAvatar>
        <CurrencyLogo size={SIZE} currency={currency} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="button">{currency.symbol}</Typography>}
      />
      <ListItemSecondaryAction>
        {balance ? (
          <Typography variant="button">{balance.toSignificant(4)}</Typography>
        ) : (
          <Skeleton width={25} />
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}
