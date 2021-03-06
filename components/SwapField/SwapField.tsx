import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Chip,
  Grid,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { TokenInfo } from "@uniswap/token-lists";
import { CurrencyDialog, CurrencyLogo } from "components";
import { ChangeEvent, useState } from "react";
import { Currency, Percent } from "@uniswap/sdk-core";
import useCurrencyBalance from "hooks/useCurrencyBalance";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";
import FiatValue from "./components/FiatValue";

type Props = {
  otherCurrency?: Currency | null;
  currency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  onUserInput: (val: string) => void;
  fiatValue?: CurrencyAmount<Token> | null;
  showMaxButton: boolean;
  priceImpact?: Percent;
  onMax?: () => void;
  loading?: boolean;
  value: string;
};

export default function SwapField({
  onCurrencySelect,
  otherCurrency,
  currency,
  onUserInput,
  value: amount,
  onMax,
  priceImpact,
  showMaxButton,
  loading,
  fiatValue,
}: Props) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const { account } = useActiveWeb3();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const [open, setOpen] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!Number.isNaN(+value)) {
      onUserInput(value);
    }
  };

  const handleSelectToken = (value: Currency) => {
    setOpen(false);
    onCurrencySelect(value);
  };

  return (
    <Paper
      sx={{
        py: 1,
        ...(isFocused
          ? {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.primaryDark.main,
              borderWidth: 2,
            }
          : {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[700],
            }),
        "&:hover": {
          borderColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[900]
              : theme.palette.grey[300],
          borderWidth: "1px solid",
        },
      }}
      variant="outlined"
    >
      <Grid alignItems="center" justifyContent={"space-between"} container>
        <Grid item xs={6}>
          <Box sx={{ ml: 2 }}>
            {loading ? (
              <Skeleton
                variant="text"
                height={theme.typography.h4.fontSize}
                width={100}
              />
            ) : (
              <InputBase
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                type="text"
                inputProps={{
                  inputMode: "decimal",
                  pattern: "^[0-9]*[.,]?[0-9]*$",
                  minLength: 1,
                  maxLength: 79,
                }}
                onChange={handleChange}
                placeholder="0.0"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={amount}
                disabled={loading}
                fullWidth
                sx={{
                  fontSize: (theme) => theme.typography.h4,
                  fontWeight: (theme) => theme.typography.fontWeightSemiBold,
                }}
              />
            )}
            {loading ? (
              <Skeleton width={80} />
            ) : (
              <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
            )}
          </Box>
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"end"}
          sx={{ mr: 2 }}
          item
          xs={12}
          md={5}
        >
          <Stack display={"flex"} alignItems={"end"} spacing={0.5}>
            <Button
              endIcon={<KeyboardArrowDownIcon />}
              onClick={() => setOpen(true)}
              startIcon={
                currency && (
                  <CurrencyLogo
                    key={currency.symbol}
                    size={30}
                    currency={currency}
                  />
                )
              }
              variant="contained"
            >
              {currency ? currency.symbol : "Select a token"}
            </Button>
            {selectedCurrencyBalance && (
              <Stack
                display={"flex"}
                spacing={1}
                alignItems="center"
                direction="row"
              >
                <Typography color={"ButtonText"} variant="body2">
                  Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}
                </Typography>
                {showMaxButton && (
                  <Chip
                    clickable
                    onClick={onMax}
                    label="Max"
                    size="small"
                    variant="filled"
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
      <CurrencyDialog
        selectedCurrency={otherCurrency}
        onCurrencySelect={handleSelectToken}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Paper>
  );
}
