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
import {
  Utils,
  IERC20,
  Swapper,
  UniswapV2Adapter,
  Executor,
  IWETH,
} from "../typechain";

const provider = waffle.provider;

describe("Swap", function () {
  let swap: Swapper;
  let uniswapV2Adapter: UniswapV2Adapter;
  let executor: Executor;
  let utils: Utils;
  let DAIContract: IERC20;
  let USDCContract: IERC20;
  let WETHContractIWETH: IWETH;
  let WETHContractIERC20: IERC20;
  let uniswapV2RouterAddress: string;
  let sushiswapRouterAddress: string;
  const chainId = ChainId.MAINNET;
  const DAIAddress = ethers.utils.getAddress(
    "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  );
  const ETHAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const USDCAddress = ethers.utils.getAddress(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  );
  const dead = "0x000000000000000000000000000000000000dEaD";
  const DAI = new Token(chainId, DAIAddress, 18);
  const USDC = new Token(chainId, USDCAddress, 6);
  // const IERC20Interface = new ethers.utils.Interface([
  //   "function transfer(address recipient, uint256 amount) external returns (bool)",
  //   "function transferFrom(address sender,address recipient,uint256 amount) external returns (bool)",
  //   "function balanceOf(address account) external view returns (uint256)",
  //   "function allowance(address owner, address spender) external view returns (uint256)",
  // ]);

  let shibaswapRouterAddress: string;

  this.beforeEach(async function () {
    // Deploy contract
    DAIContract = await ethers.getContractAt("IERC20", DAIAddress);
    USDCContract = await ethers.getContractAt("IERC20", USDCAddress);
    WETHContractIWETH = await ethers.getContractAt("IWETH", WETH[1].address);
    WETHContractIERC20 = await ethers.getContractAt("IERC20", WETH[1].address);
    const Utils = await ethers.getContractFactory("Utils");
    utils = await Utils.deploy();
    await utils.deployed();
    const Swapper = await ethers.getContractFactory("Swapper");
    const Executor = await ethers.getContractFactory("Executor");
    const UniswapV2Adapter = await ethers.getContractFactory(
      "UniswapV2Adapter"
    );
    // const ExampleContract = await ethers.getContractFactory("ExampleContract");
    // exampleContract = await ExampleContract.deploy();
    executor = await Executor.deploy();
    swap = await Swapper.deploy(executor.address);
    uniswapV2Adapter = await UniswapV2Adapter.deploy(swap.address);
    await swap.deployed();
    console.log(`Swap contract deployed at: ${swap.address}`);
    await uniswapV2Adapter.deployed();
    console.log(
      `UniswapV2Adapter contract deployed at: ${uniswapV2Adapter.address}`
    );
    // await exampleContract.deployed();
    // console.log(
    //   `ExampleContract contract deployed at: ${exampleContract.address}`
    // );

    // Add useful router addresses
    uniswapV2RouterAddress = ethers.utils.getAddress(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
    sushiswapRouterAddress = ethers.utils.getAddress(
      "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
    );

    shibaswapRouterAddress = ethers.utils.getAddress(
      "0x03f7724180AA6b939894B5Ca4314783B0b36b329"
    );

    const adaptersRouters = [
      {
        adapterAddress: uniswapV2Adapter.address,
        routers: [
          uniswapV2RouterAddress,
          sushiswapRouterAddress,
          shibaswapRouterAddress,
        ],
      },
    ];

    for (let i = 0; i < adaptersRouters.length; i++) {
      await swap.registerAdapter(i, adaptersRouters[i].adapterAddress);

      // Register routers for adapters to use
      for (let j = 0; j < adaptersRouters[i].routers.length; j++) {
        // console.log(`Index: ${j} - Address: ${adaptersRouters[i].routers[j]}`);
        await uniswapV2Adapter.registerRouter(j, adaptersRouters[i].routers[j]);
      }
    }
  });
  it("should swap from eth to token", async function () {
    await expect(
      swap.simpleSwapExactInput(999, 999, 0, 0, [dead, dead], dead, 0)
    ).revertedWith("Adapter not registered");
  });

  it("should swap tokens given ETH", async function () {
    const [owner] = await ethers.getSigners();
    const amountIn = ethers.utils.parseEther("1");
    const slippageTolerance = new Percent("50", "10000");
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const pair2 = await Fetcher.fetchPairData(DAI, USDC);

    const route = new Route([pair], WETH[DAI.chainId]);
    const route2 = new Route([pair2], DAI);
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], amountIn.toString()),
      TradeType.EXACT_INPUT
    );
    const path = [ETHAddress, DAIAddress];

    const path2 = [DAIAddress, USDCAddress];
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    await swap.simpleSwapExactInput(
      0,
      0,
      amountIn,
      amountOutMin.toString(),
      path,
      owner.address,
      deadline,
      {
        value: amountIn,
      }
    );

    const DAIBalance = await DAIContract.balanceOf(owner.address);

    const trade2 = new Trade(
      route2,
      new TokenAmount(USDC, ethers.utils.parseUnits("1000", 6).toString()),
      TradeType.EXACT_OUTPUT
    );
    const amountOutMin2 = trade2.minimumAmountOut(slippageTolerance).raw;

    await DAIContract.approve(swap.address, DAIBalance);
    await swap.simpleSwapExactInput(
      0,
      0,
      DAIBalance,
      amountOutMin2.toString(),
      path2,
      owner.address,
      deadline
    );
  });

  it("should execute simple swaps from uniswap", async function () {
    const [owner] = await ethers.getSigners();
    const amountIn = ethers.utils.parseEther("1");
    const slippageTolerance = new Percent("50", "10000");
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    const uniswapV2Router = await ethers.getContractAt(
      "IUniswapV2Router02",
      uniswapV2RouterAddress
    );

    const route = new Route([pair], WETH[DAI.chainId]);
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], amountIn.toString()),
      TradeType.EXACT_INPUT
    );
    const path = [WETH[DAI.chainId].address, DAIAddress];

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

    WETHContractIWETH.deposit({ value: ethers.utils.parseEther("1") });

    await WETHContractIERC20.approve(uniswapV2RouterAddress, amountIn);
    const tx = await uniswapV2Router.swapExactTokensForTokens(
      amountIn,
      amountOutMin.toString(),
      path,
      owner.address,
      deadline
    );

    const receipt = await tx.wait();
    console.log(receipt.gasUsed.toNumber());
    expect(receipt.gasUsed.toNumber()).to.be.lessThanOrEqual(162789);
  });

  it("should execute simple swaps from WETH to DAI from single swap function", async function () {
    const [owner] = await ethers.getSigners();
    const amountIn = ethers.utils.parseEther("1");
    const slippageTolerance = new Percent("50", "10000");
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    const route = new Route([pair], WETH[DAI.chainId]);
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], amountIn.toString()),
      TradeType.EXACT_INPUT
    );
    const path = [WETH[DAI.chainId].address, DAIAddress];

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

    WETHContractIWETH.deposit({ value: ethers.utils.parseEther("2") });

    await WETHContractIERC20.approve(
      swap.address,
      ethers.utils.parseEther("2")
    );
    const tx = await swap.simpleSwapExactInput(
      0,
      0,
      amountIn,
      amountOutMin.toString(),
      path,
      owner.address,
      deadline
    );
    const txSingle = await swap.simpleSwapExactInputSingle(
      0,
      0,
      amountIn,
      amountOutMin.toString(),
      WETH[DAI.chainId].address,
      DAIAddress,
      owner.address,
      deadline
    );
    const receiptMulti = await tx.wait();
    const receiptSingle = await txSingle.wait();
    console.log(
      `Swap single: Gas ${receiptSingle.gasUsed.toNumber()} | Swap multi: Gas ${receiptMulti.gasUsed.toNumber()}`
    );
    expect(receiptSingle.gasUsed.toNumber()).to.be.lessThan(
      receiptMulti.gasUsed.toNumber()
    );
  });

  it("should execute simple swaps from ETH to DAI from single swap function", async function () {
    const [owner] = await ethers.getSigners();
    const amountIn = ethers.utils.parseEther("1");
    const slippageTolerance = new Percent("50", "10000");
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    const route = new Route([pair], WETH[DAI.chainId]);
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], amountIn.toString()),
      TradeType.EXACT_INPUT
    );
    const path = [ETHAddress, DAIAddress];

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

    const tx = await swap.simpleSwapExactInput(
      0,
      0,
      amountIn,
      amountOutMin.toString(),
      path,
      owner.address,
      deadline,
      { value: amountIn }
    );
    const txSingle = await swap.simpleSwapExactInputSingle(
      0,
      0,
      amountIn,
      amountOutMin.toString(),
      ETHAddress,
      DAIAddress,
      owner.address,
      deadline,
      { value: amountIn }
    );
    const receiptMulti = await tx.wait();
    const receiptSingle = await txSingle.wait();
    console.log(
      `Swap single: Gas ${receiptSingle.gasUsed.toNumber()} | Swap multi: Gas ${receiptMulti.gasUsed.toNumber()}`
    );
    expect(receiptSingle.gasUsed.toNumber()).to.be.lessThan(
      receiptMulti.gasUsed.toNumber()
    );
  });
});

// type OptimalSwap = {

// }

// type RouteT = {
//   percent: number // Might change to complete number instead of percent
//   swap: OptimalSwap
// }

// type Struct = {
//   srcToken: string,
//   srcAmount: number,
//   destToken: string,
//   destAmount: number,
//   side: "BUY" | "SELL"
//   route: RouteT[]
// }
