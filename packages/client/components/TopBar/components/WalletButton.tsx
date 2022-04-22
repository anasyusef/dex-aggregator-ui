import ErrorIcon from "@mui/icons-material/Error";
import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ProviderIcon } from "components";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useActiveWeb3, useWeb3 } from "contexts/Web3Provider";
import { useNativeCurrencyBalances } from "hooks/useCurrencyBalance";
import useNativeCurrencyBalance from "hooks/useNativeCurrencyBalance";
import { useMemo, useState } from "react";
import {
  useAllTransactions,
  isTransactionRecent,
} from "state/transactions/hooks";
import { TransactionDetails } from "state/transactions/reducer";
import { shortenAddress } from "utils";
import WalletDialog from "./WalletDialog";

type Props = {};

export default function Wallet({}: Props) {
  const {
    connect,
    isAccountActive,
    account,
    chainId,
    isNetworkSupported,
    library,
  } = useActiveWeb3();
  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[
    account ?? ""
  ];

  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    await connect();
  };

  // we want the latest one to come first, so return negative if a is after b
  function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime;
  }

  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;

  if (!isNetworkSupported) {
    return (
      <Button variant="outlined" startIcon={<ErrorIcon />} color="error">
        Wrong Network
      </Button>
    );
  }

  if (!isAccountActive) {
    return (
      <Button variant="outlined" onClick={handleConnect} color="inherit">
        Connect Wallet
      </Button>
    );
  }

  const { nativeCurrency } = CHAIN_INFO[chainId];

  return (
    <>
      {hasPendingTransactions ? (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<CircularProgress color="inherit" size={20} />}
        >
          {pending.length} Pending
        </Button>
      ) : (
        <>
          <Button
            endIcon={<ProviderIcon />}
            onClick={() => setOpen(true)}
            variant="outlined"
          >
            <Stack
              direction={"row"}
              divider={<Divider orientation="vertical" flexItem />}
              gap={2}
            >
              <Typography variant="button">
                {account &&
                  userEthBalance &&
                  `${userEthBalance.toSignificant(3)} ${nativeCurrency.symbol}`}
              </Typography>
              {shortenAddress(account as string)}
            </Stack>
          </Button>
        </>
      )}
      <WalletDialog
        open={open}
        onClose={() => setOpen(false)}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
function useeNativeCurrencyBalance() {
  throw new Error("Function not implemented.");
}
