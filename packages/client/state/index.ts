import { configureStore } from "@reduxjs/toolkit";
import web3Reducer from "./web3Slice";
// ...

export function makeStore() {
  return configureStore({
    reducer: { web3: web3Reducer },
  })
}

const store = makeStore()

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
