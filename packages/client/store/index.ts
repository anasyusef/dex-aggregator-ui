import { configureStore } from "@reduxjs/toolkit";
import web3Slice from "./web3Slice";
// ...

export const store = configureStore({
  reducer: {
    web3: web3Slice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
