import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit";
import { SupportedChainId } from "constants/chains";
import { DEFAULT_TXN_DISMISS_MS } from "constants/misc";

export type PopupContent =
  | {
      txn: {
        hash: string;
      };
    }
  | {
      failedSwitchNetwork: SupportedChainId;
    };

type PopupList = Array<{
  key: string;
  show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;
interface AppState {
  popupList: PopupList;
}
const initialState: AppState = {
  popupList: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
      addPopup(state, { payload: { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } }) {
        state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
          {
            key: key || nanoid(),
            show: true,
            content,
            removeAfterMs,
          },
        ])
      },
      removePopup(state, { payload: { key } }) {
        state.popupList.forEach((p) => {
          if (p.key === key) {
            p.show = false
          }
        })
      },
    },
  })

export const { addPopup, removePopup } = appSlice.actions;

export default appSlice.reducer;
