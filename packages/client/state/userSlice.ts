import { createSlice } from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";
import type { RootState } from ".";

// Define a type for the slice state
interface UserState {
  // signer: ethers.providers.JsonRpcSigner | null
  mode: "dark" | "light";
}

// Define the initial state using that type
const initialState: UserState = {
  mode: "dark",
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.user.mode;

export default userSlice.reducer;
