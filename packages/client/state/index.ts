import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { save, load } from "redux-localstorage-simple";
import web3Reducer from "./web3Slice";
import userReducer from "./userSlice";
// ...

const PERSISTED_KEYS: string[] = ["user"];

export function makeStore() {
  return configureStore({
    reducer: { web3: web3Reducer, user: userReducer },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(
    //     save({ states: PERSISTED_KEYS, debounce: 400 })
    //   ),
    // preloadedState: load({ states: PERSISTED_KEYS }),
  });
}

const store = makeStore();

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
