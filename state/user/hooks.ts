import { Percent } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "state";
import { setSlippageTolerance, setTransactionDeadline } from "./slice";
/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | "auto" {
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.slippageTolerance;
  });

  return useMemo(
    () =>
      userSlippageTolerance === "auto"
        ? "auto"
        : new Percent(userSlippageTolerance, 10_000),
    [userSlippageTolerance]
  );
}

export function useSetUserSlippageTolerance(): (
  slippageTolerance: Percent | "auto"
) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (userSlippageTolerance: Percent | "auto") => {
      let value: "auto" | number;
      try {
        value =
          userSlippageTolerance === "auto"
            ? "auto"
            : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient);
      } catch (error) {
        value = "auto";
      }
      dispatch(setSlippageTolerance(value));
    },
    [dispatch]
  );
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(
  defaultSlippageTolerance: Percent
): Percent {
  const allowedSlippage = useUserSlippageTolerance();
  return useMemo(
    () =>
      allowedSlippage === "auto" ? defaultSlippageTolerance : allowedSlippage,
    [allowedSlippage, defaultSlippageTolerance]
  );
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userDeadline = useAppSelector(
    (state) => state.user.transactionDeadline
  );
  const deadline = userDeadline;

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(setTransactionDeadline(userDeadline));
    },
    [dispatch]
  );

  return [deadline, setUserDeadline];
}
