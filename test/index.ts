import { expect } from "chai";
import { ethers } from "hardhat";

describe("LiquidityValueCalculator", function () {
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
        ethers.utils.parseUnits("15"),
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
});
