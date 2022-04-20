import TokenIcon from "@/components/TokenIcon";
import {
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";

interface Props {
  logoURI?: string;
  symbol: string;
  disabled?: boolean;
  onClick: () => void;
  decimals: number;
  balance?: BigNumber;
}

export default function TokenListItem({
  onClick,
  logoURI,
  disabled,
  symbol,
  decimals,
  balance,
}: Props) {
  const SIZE = 30;
  if (balance) {
    console.log(formatUnits(balance, decimals));
  }
  return (
    <ListItemButton disabled={disabled} onClick={onClick} sx={{ px: 2 }}>
      <ListItemAvatar>
        <TokenIcon size={SIZE} logoURI={logoURI} symbol={symbol} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="button">{symbol}</Typography>}
      />
      <ListItemSecondaryAction>
        {balance ? (
          <Typography variant="button">
            {Math.round(+formatUnits(balance, decimals) * 10) / 10}
          </Typography>
        ) : (
          <Skeleton width={25} />
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}
