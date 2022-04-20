import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { tokensApi } from "./lists/tokenListsApi";
import multicall from "./multicall";
import swap from "./swap/reducer";
import transactions from "./transactions/reducer";
import user from "./user/slice";
import web3Reducer from "./web3Slice";
import { routingApi } from "./routing/slice";
import { save, load } from "redux-localstorage-simple";

const PERSISTED_KEYS: string[] = ["user"];

export function makeStore() {
  return configureStore({
    reducer: {
      web3: web3Reducer,
      user,
      swap,
      transactions,

      multicall: multicall.reducer,
      [tokensApi.reducerPath]: tokensApi.reducer,
      [routingApi.reducerPath]: routingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(tokensApi.middleware)
        .concat(routingApi.middleware)
        .concat(save({ states: PERSISTED_KEYS, debounce: 400 })),
    preloadedState: load({ states: PERSISTED_KEYS }),
  });
}

const store = makeStore();

setupListeners(store.dispatch);
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
