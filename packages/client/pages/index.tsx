import { Container } from "@mui/material";
import type { NextPage } from "next";
import { TopBar } from "../components";
import Web3Provider, { useWeb3 } from "contexts/Web3Provider";

const Home: NextPage = () => {
  return (
    <Web3Provider>
      <TopBar />
      <Container maxWidth="sm"></Container>
    </Web3Provider>
  );
};

export default Home;
