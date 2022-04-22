import { Stack, Link, CircularProgress, Box } from "@mui/material";
import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useAllTransactions } from "state/transactions/hooks";
import TransactionSummary from "@/components/TransactionSummary";

type Props = {
  hash: string;
};

export default function Transaction({ hash }: Props) {
  const { chainId } = useActiveWeb3();
  const allTransactions = useAllTransactions();

  const tx = allTransactions?.[hash];
  const info = tx?.info;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === "undefined");

  if (!chainId) return null;
  return (
    <Stack
      key={hash}
      direction={"row"}
      alignItems="center"
      alignContent={"center"}
      justifyContent={"space-between"}
    >
      <TransactionSummary variant="subtitle2" info={info} />
      <Box
        display={"flex"}
        alignContent="center"
        alignItems={"center"}
        justifyContent="center"
      >
        {pending ? (
          <CircularProgress size={16} />
        ) : success ? (
          <CheckCircleOutlineIcon color="success" fontSize="small" />
        ) : (
          <ErrorOutlineIcon color="error" fontSize="small" />
        )}
      </Box>
    </Stack>
  );
}
