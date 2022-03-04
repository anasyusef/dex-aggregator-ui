import { expect } from "chai";
import { ethers } from "hardhat";

describe("LiquidityValueCalculator", function () {
  it("Should return the assigned factory address", async function () {
    const uniswapFactoryAddress = ethers.utils.getAddress(
      "0x6c2d83262ff84cbadb3e416d527403135d757892"
    );
    const LiquidityValueCalculator = await ethers.getContractFactory(
      "LiquidityValueCalculator"
    );
    const liquidityValueCalculator = await LiquidityValueCalculator.deploy(
      uniswapFactoryAddress
    );
    await liquidityValueCalculator.deployed();

    expect(await liquidityValueCalculator.factory()).to.equal(
      uniswapFactoryAddress
    );

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
