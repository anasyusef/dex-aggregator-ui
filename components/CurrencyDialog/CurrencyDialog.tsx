import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  ListSubheader,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useGetTokensListQuery } from "state/tokenListsApi";
import { TokenInfo } from "@uniswap/token-lists";
import TokensList from "./components/TokensList";

export interface Props {
  open: boolean;
  selectedToken?: TokenInfo;
  onClose: () => void;
  onSelectToken: (value: TokenInfo) => void;
}

export default function CurrencyDialog(props: Props) {
  const { onClose, onSelectToken, selectedToken, open } = props;
  const { data, isLoading, isSuccess } = useGetTokensListQuery("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };

  const handleTokenItemClick = (value: TokenInfo) => {
    onSelectToken(value);
    setSearchTerm("");
  };

  return (
    <Dialog scroll="paper" fullWidth onClose={handleClose} open={open}>
      <Box
        sx={{ backgroundColor: (theme) => theme.palette.background.default }}
      >
        <DialogTitle sx={{ position: "sticky", top: "12px" }}>
          Select a token
        </DialogTitle>
        <FormControl fullWidth sx={{ px: 2, pt: 2 }} variant="outlined">
          <OutlinedInput
            placeholder="Find a token by name or address"
            id="outlined-adornment-password"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            }
            endAdornment={
              searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </FormControl>
      </Box>
      <ListSubheader
        sx={{ backgroundColor: (theme) => theme.palette.background.default }}
      >
        <Stack
          sx={{ mt: 2, mx: 4 }}
          direction="row"
          justifyContent={"space-between"}
        >
          <Typography variant="overline">Token name</Typography>
          <Typography variant="overline">Balance</Typography>
        </Stack>
      </ListSubheader>
      <DialogContent dividers>
        <TokensList
          selectedToken={selectedToken}
          onTokenItemClick={handleTokenItemClick}
          searchTerm={searchTerm}
          isLoading={isLoading}
          data={data?.tokens}
          isSuccess={isSuccess as any}
        />
      </DialogContent>
    </Dialog>
  );
}
