import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import {
  ChainId,
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from "@uniswap/sdk";
import UniswapRouterV2Abi from "../abis/UniswapV2Router02.json";

const provider = waffle.provider;

describe("Swap", function () {
  it("Should return the assigned factory address", async function () {
    const [owner] = await ethers.getSigners();
    const uniswapFactoryAddress = ethers.utils.getAddress(
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    );
    console.log(
      `Owner's balance: ${ethers.utils.formatEther(await owner.getBalance())}`
    );
    const LiquidityValueCalculator = await ethers.getContractFactory(
      "LiquidityValueCalculator",
      owner
    );
    const liquidityValueCalculator = await LiquidityValueCalculator.deploy(
      uniswapFactoryAddress
    );
    await liquidityValueCalculator.deployed();

    expect(await liquidityValueCalculator.factory()).to.equal(
      uniswapFactoryAddress
    );

    const DAI = ethers.utils.getAddress(
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    );

    const LINK = ethers.utils.getAddress(
      "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    );

    const [tokenAAmount, tokenBAmount] =
      await liquidityValueCalculator.computeLiquidityShareValue(
        ethers.utils.parseUnits("999"),
        DAI,
        LINK
      );

    console.log(
      ethers.utils.formatUnits(tokenAAmount.toString()).toString(),
      ethers.utils.formatUnits(tokenBAmount.toString()).toString()
    );

    console.log(
      `Owner's balance: ${ethers.utils.formatEther(await owner.getBalance())}`
    );

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it.only("should swap from eth to token", async function () {
    const [owner] = await ethers.getSigners();
    const Swap = await ethers.getContractFactory("Swap");
    const swap = await Swap.deploy(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
    await swap.deployed();

    const uniswapV2RouterAddress = ethers.utils.getAddress(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
    const sushiswapRouterAddress = ethers.utils.getAddress(
      "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
    );

    const shibaswapRouterAddress = ethers.utils.getAddress(
      "0x03f7724180AA6b939894B5Ca4314783B0b36b329"
    );

    await swap.addRouter(0, uniswapV2RouterAddress);
    await swap.addRouter(1, sushiswapRouterAddress);
    await swap.addRouter(2, shibaswapRouterAddress);

    expect(await swap.getRouter(0)).to.equal(uniswapV2RouterAddress);
    const DAIAddress = ethers.utils.getAddress(
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    );

    const chainId = ChainId.MAINNET;
    const DAI = new Token(chainId, DAIAddress, 18);

    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const route = new Route([pair], WETH[DAI.chainId]);
    const amountIn = ethers.utils.parseEther("10");
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], amountIn.toBigInt()),
      TradeType.EXACT_INPUT
    );
    const path = [WETH[DAI.chainId].address, DAI.address];
    const deadline = Math.floor(Date.now() / 1000) + 120;
    const slippageTolerance = new Percent("50", "10000");
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    const tx = await swap.swapExactETHForTokens(
      2,
      amountOutMin.toString(),
      owner.address,
      path,
      deadline,
      {
        value: amountIn,
      }
    );
    await tx.wait();

    const DAIAbi = new ethers.utils.Interface([
      "function balanceOf(address account) external view returns (uint256)",
    ]);
    const DAIContract = new ethers.Contract(DAI.address, DAIAbi, owner);
    console.log(
      ethers.utils.formatUnits(await DAIContract.balanceOf(owner.address), 18)
    );
    // const contractBalance = await provider.getBalance(swap.address);
    // console.log(ethers.utils.formatEther(contractBalance));
    console.log(
      `Owner's balance: ${ethers.utils.formatEther(await owner.getBalance())}`
    );
  });
});
