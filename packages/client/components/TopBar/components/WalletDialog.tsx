import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { ProviderIcon } from "components";
import { useActiveWeb3 } from "contexts/Web3Provider";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { shortenAddress } from "utils";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";
import { getFormattedProviderName } from "utils/provider";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <AccountCard onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}

interface AccountCardProps {
  onClose: () => void;
}

function AccountCard({ onClose }: AccountCardProps) {
  const { account, chainId, disconnect, library: provider } = useActiveWeb3();
  const [copyText, setCopyText] = useState("Copy Address");
  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  if (!account) return null;
  return (
    <Card variant="outlined" sx={{ minWidth: 300 }}>
      <CardContent>
        {provider && (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
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
  );
}
