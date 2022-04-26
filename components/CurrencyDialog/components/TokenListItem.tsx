import TokenIcon from "@/components/TokenIcon";
import {
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import parseIPFSURI from "utils/parseIPFSURI";

interface Props {
  logoURI?: string;
  symbol: string;
  disabled?: boolean;
  onClick: () => void;
}

export default function TokenListItem({
  onClick,
  logoURI,
  disabled,
  symbol,
}: Props) {
  const [error, setError] = useState(false);
  const SIZE = 30;
  return (
    <ListItemButton disabled={disabled} onClick={onClick} sx={{ px: 2 }}>
      <ListItemAvatar>
        <TokenIcon size={SIZE} logoURI={logoURI} symbol={symbol} />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="button">{symbol}</Typography>}
      />
      <ListItemSecondaryAction>
        {/* TODO - Get balance of each token using a multicall contract */}
        <Typography variant="button">0</Typography>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}
