import SettingsIcon from "@mui/icons-material/Settings";
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Stack,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Percent } from "@uniswap/sdk-core";
import { DEFAULT_DEADLINE_FROM_NOW } from "constants/misc";
import React, { useState } from "react";
import {
  useSetUserSlippageTolerance,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from "state/user/hooks";

type Props = {
  placeholderSlippage: Percent;
};

enum SlippageError {
  InvalidInput = "InvalidInput",
}

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

const THREE_DAYS_IN_SECONDS = 4320;

export default function SwapSettings({ placeholderSlippage }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const userSlippageTolerance = useUserSlippageTolerance();
  const setSlippageTolerance = useSetUserSlippageTolerance();

  const [slippageError, setSlippageError] = useState<SlippageError | false>(
    false
  );
  const [slippageInput, setSlippageInput] = useState<string>("");

  const [deadline, setDeadline] = useUserTransactionTTL();

  const [deadlineInput, setDeadlineInput] = useState("");
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(
    false
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function parseSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value);
    setSlippageError(false);

    if (value.length === 0) {
      setSlippageTolerance("auto");
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100);

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setSlippageTolerance("auto");
        if (value !== ".") {
          setSlippageError(SlippageError.InvalidInput);
        }
      } else {
        setSlippageTolerance(new Percent(parsed, 10_000));
      }
    }
  }

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value);
    setDeadlineError(false);

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW);
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60);
        if (
          !Number.isInteger(parsed) ||
          parsed < 60 ||
          parsed > THREE_DAYS_IN_SECONDS
        ) {
          setDeadlineError(DeadlineError.InvalidInput);
        } else {
          setDeadline(parsed);
        }
      } catch (error) {
        console.error(error);
        setDeadlineError(DeadlineError.InvalidInput);
      }
    }
  }

  const tooLow =
    userSlippageTolerance !== "auto" &&
    userSlippageTolerance.lessThan(new Percent(5, 10_000));
  const tooHigh =
    userSlippageTolerance !== "auto" &&
    userSlippageTolerance.greaterThan(new Percent(1, 100));

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;
  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography fontWeight={"bold"} sx={{ mx: 2, pt: 2 }}>
          Transaction settings
        </Typography>
        <Stack
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <ToggleButton
              size="small"
              fullWidth
                selected={userSlippageTolerance === "auto"}
                onClick={() => parseSlippageInput("")}
                value={"auto"}
              >
                Auto
              </ToggleButton>
            </Grid>
            <Grid item xs={9}>
              <FormControl size="small" variant="outlined">
                <InputLabel htmlFor="slippage-tolerance-input">
                  Slippage tolerance
                </InputLabel>
                <OutlinedInput
                  size="small"
                  id="slippage-tolerance-input"
                  error={!!slippageError}
                  color={tooLow || tooHigh ? "warning" : "primary"}
                  onChange={(e) => parseSlippageInput(e.target.value)}
                  value={
                    slippageInput.length > 0
                      ? slippageInput
                      : userSlippageTolerance === "auto"
                      ? ""
                      : userSlippageTolerance.toFixed(2)
                  }
                  onBlur={() => {
                    setSlippageInput("");
                    setSlippageError(false);
                  }}
                  placeholder={placeholderSlippage.toFixed(2)}
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  label="Slippage tolerance"
                />
                {slippageError || tooLow || tooHigh ? (
                  slippageError ? (
                    <FormHelperText error>
                      Enter a valid slippage percentage
                    </FormHelperText>
                  ) : tooLow ? (
                    <FormHelperText>Your transaction may fail</FormHelperText>
                  ) : (
                    <FormHelperText>
                      Your transaction may be frontrun
                    </FormHelperText>
                  )
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
          <FormControl size="small" variant="outlined">
            <InputLabel htmlFor="transaction-deadline-input">
              Transaction deadline
            </InputLabel>
            <OutlinedInput
              size="small"
              id="transaction-deadline-input"
              error={!!deadlineError}
              onChange={(e) => parseCustomDeadline(e.target.value)}
              placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
              value={
                deadlineInput.length > 0
                  ? deadlineInput
                  : deadline === DEFAULT_DEADLINE_FROM_NOW
                  ? ""
                  : (deadline / 60).toString()
              }
              endAdornment={
                <InputAdornment position="end">minutes</InputAdornment>
              }
              onBlur={() => {
                setDeadlineInput("");
                setDeadlineError(false);
              }}
              label="Transaction deadline"
            />
          </FormControl>
          <Stack
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          ></Stack>
        </Stack>
      </Popover>
    </>
  );
}
