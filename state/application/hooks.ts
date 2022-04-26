import { DEFAULT_TXN_DISMISS_MS } from "constants/misc";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector, RootState } from "state";
import { PopupContent, addPopup, removePopup } from "./slice";

export function useAddPopup(): (
  content: PopupContent,
  key?: string,
  removeAfterMs?: number
) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number) => {
      dispatch(
        addPopup({
          content,
          key,
          removeAfterMs: removeAfterMs ?? DEFAULT_TXN_DISMISS_MS,
        })
      );
    },
    [dispatch]
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

// get the list of active popups
export function useActivePopups(): RootState["app"]["popupList"] {
  const list = useAppSelector((state: RootState) => state.app.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
