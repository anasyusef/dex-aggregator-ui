import SettingsIcon from "@mui/icons-material/Settings";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  OutlinedInputProps,
} from "@mui/material";
import React from "react";
import { ChangeEvent } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "state";
import {
  GasMode,
  setGasMode,
  setSlippageTolerance,
  setTransactionDeadline,
} from "state/userSlice";

type Props = {};

function isSlippageToleranceWarning(
  slippageTolerance: string
): [boolean, string?] {
  if (slippageTolerance === "") return [false];
  const parsedSlippageTolerance = +slippageTolerance;
  const isFrontrun =
    parsedSlippageTolerance > 1 && parsedSlippageTolerance <= 50;
  const mayFail =
    parsedSlippageTolerance >= 0 && parsedSlippageTolerance < 0.05;

  if (isFrontrun) return [true, "Your transaction may be frontrun"];
  if (mayFail) return [true, "Your transaction may fail"];
  return [false];
}

function isSlippageToleranceError(slippageTolerance: string) {
  if (slippageTolerance === "") return true;
  const parsedSlippageTolerance = +slippageTolerance;
  return (
    Number.isNaN(parsedSlippageTolerance) ||
    parsedSlippageTolerance > 50 ||
    parsedSlippageTolerance < 0
  );
}

function isTransactionTTLError(transactionTTL: string) {
  const parsedTransactionTTL = +transactionTTL;
  return (
    Number.isNaN(parsedTransactionTTL) ||
    parsedTransactionTTL <= 0 ||
    parsedTransactionTTL > 4320 ||
    parsedTransactionTTL < 1
  );
}

export default function SwapSettings({}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { transactionDeadline, gasMode, slippageTolerance } = useAppSelector(
    (state) => state.user
  );
  const [slippageToleranceState, setSlippageToleranceState] = useState<string>(
    slippageTolerance.toString()
  );
  const [transactionTTL, setTransactionTTL] = useState(
    transactionDeadline.toString()
  );
  const dispatch = useAppDispatch();

  let slippageInputColor: OutlinedInputProps["color"] = "primary";

  if (isSlippageToleranceError(slippageToleranceState)) {
    slippageInputColor = "error";
  } else if (isSlippageToleranceWarning(slippageToleranceState)[0]) {
    slippageInputColor = "warning";
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    const isErrorSlippageTolerance = isSlippageToleranceError(
      slippageToleranceState
    );
    const isErrorTransactionTTL = isTransactionTTLError(transactionTTL);
    if (!isErrorSlippageTolerance) {
      dispatch(setSlippageTolerance(slippageToleranceState));
    } else {
      setSlippageToleranceState(slippageTolerance.toString());
    }

    if (!isErrorTransactionTTL) {
      dispatch(setTransactionDeadline(transactionTTL));
    } else {
      setTransactionTTL(transactionDeadline.toString());
    }
    setAnchorEl(null);
  };

  const handleGasMode = (
    event: React.MouseEvent<HTMLElement>,
    newGasMode: GasMode | null
  ) => {
    if (newGasMode) {
      dispatch(setGasMode(newGasMode));
    }
  };

  const handleSlippageToleranceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippageToleranceState(e.target.value);
  };

  const handleTransactionTTLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransactionTTL(e.target.value);
  };

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
          <FormControl size="small" variant="outlined">
            <InputLabel htmlFor="slippage-tolerance-input">
              Slippage tolerance
            </InputLabel>
            <OutlinedInput
              size="small"
              id="slippage-tolerance-input"
              error={isSlippageToleranceError(slippageToleranceState)}
              color={slippageInputColor}
              onChange={handleSlippageToleranceChange}
              value={slippageToleranceState}
              placeholder={"0.10"}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              label="Slippage tolerance"
            />
            {isSlippageToleranceWarning(slippageToleranceState)[0] && (
              <FormHelperText>
                {isSlippageToleranceWarning(slippageToleranceState)[1]}
              </FormHelperText>
            )}
            {isSlippageToleranceError(slippageToleranceState) && (
              <FormHelperText error>Invalid slippage tolerance</FormHelperText>
            )}
          </FormControl>
          <FormControl size="small" variant="outlined">
            <InputLabel htmlFor="transaction-deadline-input">
              Transaction deadline
            </InputLabel>
            <OutlinedInput
              size="small"
              id="transaction-deadline-input"
              error={isTransactionTTLError(transactionTTL)}
              onChange={handleTransactionTTLChange}
              placeholder={"30"}
              value={transactionTTL}
              endAdornment={
                <InputAdornment position="end">minutes</InputAdornment>
              }
              label="Transaction deadline"
            />
          </FormControl>
          <Stack
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography>Gas price</Typography>
            <ToggleButtonGroup
              value={gasMode}
              exclusive
              size="small"
              onChange={handleGasMode}
              aria-label="text alignment"
            >
              <ToggleButton value="normal" aria-label="normal">
                Normal
              </ToggleButton>
              <ToggleButton value="fast" aria-label="fast">
                Fast
              </ToggleButton>
              <ToggleButton value="instant" aria-label="instant">
                Instant
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}
