import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
import type { RootState } from ".";

// Define a type for the slice state

export type GasMode = "normal" | "fast" | "instant";
interface UserState {
  // signer: ethers.providers.JsonRpcSigner | null
  mode: "dark" | "light";
  slippageTolerance: number;
  transactionDeadline: number;
  gasMode: GasMode;
}

// Define the initial state using that type
const initialState: UserState = {
  mode: "dark",
  slippageTolerance: 0.1,
  transactionDeadline: 10,
  gasMode: "fast",
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state, action: { payload: PaletteMode }) => {
      state.mode = action.payload;
    },
    setSlippageTolerance: (state, action: { payload: string }) => {
      const parsedPayload = +action.payload;
      if (!Number.isNaN(parsedPayload) && parsedPayload > 0) {
        state.slippageTolerance = parsedPayload;
      }
    },
    setTransactionDeadline: (state, action: { payload: string }) => {
      const parsedPayload = +action.payload;
      if (!Number.isNaN(parsedPayload) && parsedPayload > 0) {
        state.transactionDeadline = parsedPayload;
      }
    },
    setGasMode: (state, action: { payload: GasMode }) => {
      state.gasMode = action.payload;
    },
  },
});

export const {
  setMode,
  setGasMode,
  setSlippageTolerance,
  setTransactionDeadline,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.user.mode;

export default userSlice.reducer;
