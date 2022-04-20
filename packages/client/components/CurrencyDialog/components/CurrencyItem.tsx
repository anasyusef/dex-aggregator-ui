import CurrencyLogo from "@/components/CurrencyLogo";
import {
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { Currency } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import useCurrencyBalance from "hooks/useCurrencyBalance";

interface Props {
  currency: Currency;
  disabled?: boolean;
  onSelect: () => void;
}

export default function CurrencyItem({ currency, onSelect, disabled }: Props) {
  const { account } = useActiveWeb3();
  const balance = useCurrencyBalance(account ?? undefined, currency);
  return (
    <ListItemButton disabled={disabled} onClick={onSelect} sx={{ px: 2 }}>
      <ListItemAvatar>
        <CurrencyLogo size={30} currency={currency} />
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
