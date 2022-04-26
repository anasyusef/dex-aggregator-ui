import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
import { DEFAULT_DEADLINE_FROM_NOW } from "constants/misc";
import type { RootState } from "..";

// Define a type for the slice state

export type GasMode = "normal" | "fast" | "instant";
interface UserState {
  // signer: ethers.providers.JsonRpcSigner | null
  mode: "dark" | "light";
  slippageTolerance: number | "auto";
  transactionDeadline: number;
  // gasMode: GasMode;
}

// Define the initial state using that type
const initialState: UserState = {
  mode: "dark",
  slippageTolerance: "auto",
  transactionDeadline: DEFAULT_DEADLINE_FROM_NOW,
  // gasMode: "fast",
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state, action: { payload: PaletteMode }) => {
      state.mode = action.payload;
    },
    setSlippageTolerance: (state, action) => {
      state.slippageTolerance = action.payload;
    },
    setTransactionDeadline: (state, action) => {
      state.transactionDeadline = action.payload;
    },
  },
  // setGasMode: (state, action: { payload: GasMode }) => {
  //   state.gasMode = action.payload;
  // },
});

export const {
  setMode,
  // setGasMode,
  setSlippageTolerance,
  setTransactionDeadline,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.user.mode;

export default userSlice.reducer;
