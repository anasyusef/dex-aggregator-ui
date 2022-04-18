import BrandingProvider from "@/components/BrandingProvider";
import SwapField from "@/components/SwapField/SwapField";
import SettingsIcon from "@mui/icons-material/Settings";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { CurrencyDialog, TopBar } from "../components";
import { TokenInfo } from "@uniswap/token-lists";

const Home: NextPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [token0, setToken0] = useState<TokenInfo>();
  const [token1, setToken1] = useState<TokenInfo>();

  const handleSwapTokenPositions = () => {
    setToken0(token1);
    setToken1(token0);
  };

  return (
    <BrandingProvider>
      <TopBar />
      <Container sx={{ mt: 8 }} maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{
            pt: 3,
            pb: 6,
            px: 5,
          }}
        >
          <Stack
            sx={{ mb: 2 }}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <Typography display={"flex"} alignItems="center" variant="h6">
              Swap
            </Typography>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SwapField
                otherTokenSelected={token1}
                onTokenSelect={(val) => setToken0(val)}
                selectedToken={token0}
              />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={12}>
              <IconButton
                onClick={handleSwapTokenPositions}
                color="primary"
                size="large"
              >
                <SwapVertIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <SwapField
                otherTokenSelected={token0}
                onTokenSelect={(val) => setToken1(val)}
                selectedToken={token1}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                Swap
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </BrandingProvider>
  );
};

export default Home;
