import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Grid, InputBase, Paper } from "@mui/material";
import { TokenInfo } from "@uniswap/token-lists";
import { CurrencyDialog, TokenIcon } from "components";
import { ChangeEvent, useState } from "react";

type Props = {
  otherTokenSelected?: TokenInfo;
  selectedToken?: TokenInfo;
  onTokenSelect: (token: TokenInfo) => void;
  onAmountChange: (val: string) => void;
  amount?: string;
};

export default function SwapField({
  onTokenSelect,
  otherTokenSelected,
  selectedToken,
  onAmountChange,
  amount,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!Number.isNaN(+value) && value.length <= 18) {
      onAmountChange(e.target.value);
    }
  };

  const handleSelectToken = (value: TokenInfo) => {
    setOpen(false);
    onTokenSelect(value);
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
              selectedToken && (
                <TokenIcon
                  key={selectedToken.address}
                  size={30}
                  symbol={selectedToken.symbol}
                  logoURI={selectedToken.logoURI}
                />
              )
            }
            // fullWidth
            variant="contained"
          >
            {selectedToken ? selectedToken.symbol : "Select a token"}
          </Button>
        </Grid>
      </Grid>
      <CurrencyDialog
        selectedToken={otherTokenSelected}
        onSelectToken={handleSelectToken}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Paper>
  );
}
