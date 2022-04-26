import BrandingProvider from "@/components/BrandingProvider";
import SwapField from "@/components/SwapField/SwapField";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "state";
import {
  setInputToken,
  setOutputToken,
  swapTokenPositions,
} from "state/swapSlice";
import { SwapSettings, TopBar } from "../components";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const { input, output } = useAppSelector((state) => state.swap);

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
            <SwapSettings />
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <SwapField
                selectedToken={input}
                otherTokenSelected={output}
                onTokenSelect={(val) => dispatch(setInputToken(val))}
              />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={12}>
              <IconButton
                onClick={() => dispatch(swapTokenPositions())}
                color="primary"
                size="large"
              >
                <SwapVertIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <SwapField
                selectedToken={output}
                otherTokenSelected={input}
                onTokenSelect={(val) => dispatch(setOutputToken(val))}
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
