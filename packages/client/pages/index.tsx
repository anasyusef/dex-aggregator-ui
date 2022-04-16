import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
import { TopBar } from "../components";
import Web3Provider, { useWeb3 } from "contexts/Web3Provider";

const Home: NextPage = () => {
  return (
    <Web3Provider>
      <TopBar />
      <Container maxWidth="sm">
        <Paper
          sx={{
            pt: 3,
            pb: 6,
            px: 5,
          }}
          elevation={3}
        >
          <Typography sx={{ mb: 3 }} gutterBottom variant="h6">
            Swap
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField type={"number"} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained">
                Swap
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Web3Provider>
  );
};

export default Home;
