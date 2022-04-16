import { Web3Provider } from "@ethersproject/providers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import type { RootState } from ".";

// Define a type for the slice state
interface Web3State {
  // signer: ethers.providers.JsonRpcSigner | null
  address?: string;
  balance?: number;
}

// Define the initial state using that type
const initialState: Web3State = {};

export const web3Slice = createSlice({
  name: "web3",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setup: (state, action) => {
      // state.provider = action.payload.provider;
      state.address = action.payload.address;
      //   state.address = action.payload.address;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { setup } = web3Slice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.web3.address;

export default web3Slice.reducer;
