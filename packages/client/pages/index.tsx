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
import { CurrencyDialog, TopBar } from "../components";

const Home: NextPage = () => {
  const theme = useTheme();
  console.log({ theme: theme.palette.mode });
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
              <SwapField />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={12}>
              <IconButton color="primary" size="large">
                <SwapVertIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <SwapField />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                Swap
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <CurrencyDialog />
    </BrandingProvider>
  );
};

export default Home;
