import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { ProviderIcon } from "components";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useCallback, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppDispatch } from "state";
import { clearAllTransactions } from "state/transactions/actions";
import { shortenAddress } from "utils";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";
import { getFormattedProviderName } from "utils/provider";
import Transaction from "./Transaction";

function renderTransactions(transactions: string[]) {
  return (
    <>
      {transactions.map((hash, i) => (
        <Transaction key={i} hash={hash} />
      ))}
    </>
  );
}
export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  pendingTransactions: string[]; // hashes of pending
  confirmedTransactions: string[]; // hashes of confirmed
}

export default function WalletDialog(props: SimpleDialogProps) {
  const { onClose, open, confirmedTransactions, pendingTransactions } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <AccountCard
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AccountCardProps {
  onClose: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
}

function AccountCard({
  onClose,
  confirmedTransactions,
  pendingTransactions,
}: AccountCardProps) {
  const { account, chainId, disconnect, library: provider } = useActiveWeb3();
  const [copyText, setCopyText] = useState("Copy Address");

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const dispatch = useAppDispatch();

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  if (!account) return null;
  return (
    <Stack spacing={2}>
      <Card variant="outlined" sx={{ minWidth: 300 }}>
        <CardContent>
          {provider && (
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Connected with {getFormattedProviderName(provider.provider)}
            </Typography>
          )}
          <Stack direction="row" spacing={3} justifyContent="space-between">
            <Stack direction={"row"} spacing={2}>
              <ProviderIcon />
              <Typography variant="h5" sx={{ mb: 1.5 }} color="text.primary">
                {shortenAddress(account)}
              </Typography>
            </Stack>
            <Button
              startIcon={<LogoutIcon />}
              variant="outlined"
              onClick={handleDisconnect}
              size="small"
            >
              Disconnect
            </Button>
          </Stack>
        </CardContent>
        <CardActions>
          <CopyToClipboard onCopy={() => setCopyText("Copied!")} text={account}>
            <Button startIcon={<ContentCopyIcon />} size="small">
              {copyText}
            </Button>
          </CopyToClipboard>
          {chainId && (
            <Button
              startIcon={<OpenInNewIcon />}
              target={"_blank"}
              href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}
              size="small"
            >
              View on Explorer
            </Button>
          )}
        </CardActions>
      </Card>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack
                alignItems={"center"}
                justifyContent={"space-between"}
                direction="row"
              >
                <Typography>Recent Transactions</Typography>
                <Button onClick={clearAllTransactionsCallback}>
                  Clear all
                </Button>
              </Stack>
              {renderTransactions(pendingTransactions)}
              {renderTransactions(confirmedTransactions)}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography>Your transactions will appear here...</Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
