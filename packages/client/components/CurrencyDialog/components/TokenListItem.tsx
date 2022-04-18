import { useState } from "react";
import {
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
} from "@mui/material";
import Image from "next/image";
import { TokenInfo } from "@uniswap/token-lists";
import parseIPFSURI from "utils/parseIPFSURI";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

interface Props {
  logoURI?: string;
  address: string;
  symbol: string;
}

export default function TokenListItem({ logoURI, address, symbol }: Props) {
  const [error, setError] = useState(false);
  const SIZE = 30;
  return (
    <ListItemButton sx={{ px: 2 }}>
      <ListItemAvatar>
        <Avatar sx={{ height: SIZE, width: SIZE }}>
          {error || !logoURI ? (
            <QuestionMarkIcon color="disabled" />
          ) : (
            <Image
              layout="fill"
              src={parseIPFSURI(logoURI ?? "")}
              alt={symbol}
              onError={() => setError(true)}
            />
          )}
        </Avatar>
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
