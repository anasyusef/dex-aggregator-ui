import { DEFAULT_TXN_DISMISS_MS, L2_TXN_DISMISS_MS } from "constants/misc";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "state";
import { useAddPopup } from "../application/hooks";
import { checkedTransaction, finalizeTransaction } from "./actions";

import { TransactionReceipt } from "@ethersproject/abstract-provider";
import useBlockNumber, {
  useFastForwardBlockNumber,
} from "hooks/useBlockNumber";
import { useEffect } from "react";
import { retry, RetryableError, RetryOptions } from "utils/retry";

interface Transaction {
  addedTime: number;
  receipt?: unknown;
  lastCheckedBlockNumber?: number;
}

export function shouldCheck(lastBlockNumber: number, tx: Transaction): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending =
    ((new Date().getTime() - tx.addedTime) / 1) * 60 * 1_000; // 1 minute in milliseconds
  if (minutesPending > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 };

interface UpdaterProps {
  pendingTransactions: { [hash: string]: Transaction };
  onCheck: (tx: { chainId: number; hash: string; blockNumber: number }) => void;
  onReceipt: (tx: {
    chainId: number;
    hash: string;
    receipt: TransactionReceipt;
  }) => void;
}

function LibUpdater({
  pendingTransactions,
  onCheck,
  onReceipt,
}: UpdaterProps): null {
  const { chainId, library } = useActiveWeb3();

  const lastBlockNumber = useBlockNumber();
  const fastForwardBlockNumber = useFastForwardBlockNumber();

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library || !chainId) throw new Error("No library or chainId");
      const retryOptions = DEFAULT_RETRY_OPTIONS;
      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt: any) => {
            if (receipt === null) {
              console.debug(`Retrying tranasaction receipt for ${hash}`);
              throw new RetryableError();
            }
            return receipt;
          }),
        retryOptions
      );
    },
    [chainId, library]
  );

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return;

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) => shouldCheck(lastBlockNumber, pendingTransactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash);
        promise
          .then((receipt) => {
            if (receipt) {
              onReceipt({ chainId, hash, receipt });
            } else {
              onCheck({ chainId, hash, blockNumber: lastBlockNumber });
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.warn(
                `Failed to get transaction receipt for ${hash}`,
                error
              );
            }
          });
        return cancel;
      });

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [
    chainId,
    library,
    lastBlockNumber,
    getReceipt,
    fastForwardBlockNumber,
    onReceipt,
    onCheck,
    pendingTransactions,
  ]);

  return null;
}

export default function Updater() {
  const { chainId } = useActiveWeb3();
  const addPopup = useAddPopup();

  const dispatch = useAppDispatch();
  const onCheck = useCallback(
    ({ chainId, hash, blockNumber }: any) =>
      dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  );
  const onReceipt = useCallback(
    ({ chainId, hash, receipt }: any) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: {
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            from: receipt.from,
            status: receipt.status,
            to: receipt.to,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
          },
        })
      );
      console.log({ hash })
      addPopup(
        {
          txn: { hash },
        },
        hash,
        100000000000
        // DEFAULT_TXN_DISMISS_MS
      );
    },
    [dispatch, addPopup]
  );

  const state = useAppSelector((state) => state.transactions);
  const pendingTransactions = useMemo(
    () => (chainId ? state[chainId] ?? {} : {}),
    [chainId, state]
  );

  return (
    <LibUpdater
      pendingTransactions={pendingTransactions}
      onCheck={onCheck}
      onReceipt={onReceipt}
    />
  );
}
