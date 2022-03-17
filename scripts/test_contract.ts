import { ethers } from "ethers";
import { readFileSync } from "fs";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const signer = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

async function main() {
  const account = signer.connect(provider);
  const balance = await account.getBalance();
  const parsedUnits = ethers.utils.formatEther(balance);
  const abiBuffer = readFileSync(
    "../artifacts/contracts/LiquidityValueCalculator.sol/LiquidityValueCalculator.json"
  );
  const { abi } = JSON.parse(abiBuffer.toString());
  const hhContract = new ethers.Contract(
    "0x6c2d83262ff84cbadb3e416d527403135d757892",
    abi,
    account
  );
  console.log(await hhContract.factory())
  console.log(parsedUnits.toString());
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
