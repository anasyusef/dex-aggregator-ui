import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Grid, InputBase, Paper } from "@mui/material";
import { TokenInfo } from "@uniswap/token-lists";
import { CurrencyDialog, CurrencyLogo } from "components";
import { ChangeEvent, useState } from "react";
import { Currency } from "@uniswap/sdk-core";

type Props = {
  otherCurrency?: Currency | null;
  currency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  onUserInput: (val: string) => void;
  value: string;
};

export default function SwapField({
  onCurrencySelect,
  otherCurrency,
  currency,
  onUserInput,
  value: amount,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  // const;
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
      <Grid
        // spacing={2}
        alignItems="center"
        justifyContent={"space-between"}
        container
      >
        <Grid item xs={6}>
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
            fullWidth
            sx={{
              ml: 2,
              fontSize: (theme) => theme.typography.h4,
              fontWeight: (theme) => theme.typography.fontWeightSemiBold,
            }}
          />
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"end"}
          sx={{ mr: 2 }}
          item
          xs={5}
        >
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
            // fullWidth
            variant="contained"
          >
            {currency ? currency.symbol : "Select a token"}
          </Button>
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
