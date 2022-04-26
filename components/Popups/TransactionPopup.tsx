import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { IconButton, Snackbar, Stack, Box } from "@mui/material";
import { useActiveWeb3 } from "contexts/Web3Provider";
import Link from "next/link";
import { useTransaction } from "../../state/transactions/hooks";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import TransactionSummary from "../TransactionSummary";

export default function TransactionPopup({
  hash,
  removeAfterMs,
  open,
  onClose,
}: {
  hash: string;
  removeAfterMs: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const { chainId } = useActiveWeb3();

  const tx = useTransaction(hash);

  // const theme = useContext(ThemeContext);
  if (!tx) return null;
  const { info } = tx;

  const success = Boolean(tx.receipt && tx.receipt.status === 1);
  console.log(success);
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  return (
    <Snackbar
      anchorOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      open={open}
      action={action}
      onClose={onClose}
      message={
        <Stack alignItems={"center"} direction="row">
          <Box sx={{ mr: 1 }}>
            {success ? (
              <CheckCircleOutlineIcon fontSize="large" color="success" />
            ) : (
              <ErrorOutlineIcon fontSize="large" color="error" />
            )}
          </Box>
          <Stack>
            <TransactionSummary info={tx.info} />
            {chainId && (
              <Link
                href={getExplorerLink(
                  chainId,
                  hash,
                  ExplorerDataType.TRANSACTION
                )}
              >
                View on Explorer
              </Link>
            )}
          </Stack>
        </Stack>
      }
      autoHideDuration={removeAfterMs}
    />
  );
}
