import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CardActions,
  DialogContent,
  Stack,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useWeb3 } from "contexts/Web3Provider";
import React, { useState } from "react";
import { shortenAddress } from "utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";

const emails = ["username@gmail.com", "user02@gmail.com"];

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  account: string;
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
        <AccountCard account={props.account} />
      </DialogContent>
    </Dialog>
  );
}

interface AccountCardProps {
  account: string;
}

function AccountCard({ account }: AccountCardProps) {
  const { provider, chainId, disconnect } = useWeb3();
  const [copyText, setCopyText] = useState("Copy Address");

  const handleChange = async () => {
    // await modal.toggleModal;
  };

  const handleDisconnect = () => {
    // modal.clearCachedProvider()
    disconnect();
  };

  return (
    <Card variant="outlined" sx={{ minWidth: 300 }}>
      <CardContent>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Connected with MetaMask
        </Typography> */}
        <Stack direction="row" spacing={3} justifyContent="space-between">
          <Typography variant="h5" sx={{ mb: 1.5 }} color="text.primary">
            {shortenAddress(account)}
          </Typography>
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

// export default function WalletDialog() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value: string) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1" component="div">
//         Selected: {selectedValue}
//       </Typography>
//       <br />
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <WalletDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
