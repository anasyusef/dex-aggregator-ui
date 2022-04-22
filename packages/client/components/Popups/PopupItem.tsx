import React, { useCallback, useEffect, useState } from "react";
import { useRemovePopup } from "state/application/hooks";
import { PopupContent } from "state/application/slice";
import FailedNetworkSwitchPopup from "./FailedNetworkSwitchPopup";
import TransactionPopup from "./TransactionPopup";

type Props = {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
};

export default function PopupItem({ content, popKey, removeAfterMs }: Props) {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  const [open, setOpen] = useState(true);
  // else if ("failedSwitchNetwork" in content) {
  //   popupContent = (
  //     <FailedNetworkSwitchPopup chainId={content.failedSwitchNetwork} />
  //   );
  // }
  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs + 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);
  if (!("txn" in content)) return null;
  console.log({ open, hash: content.txn.hash })
  return (
    <TransactionPopup
      open={open}
      onClose={() => setOpen(false)}
      hash={content.txn.hash}
      removeAfterMs={removeAfterMs}
    />
  );
}
