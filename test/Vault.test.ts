import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import * as hre from "hardhat";
import { ethers } from "hardhat";
import { ERC20Abi } from "../abis/ERC20";
import { goldfinchConfigAbi } from "../abis/GoldfinchConfig";
import { poolTokensAbi } from "../abis/PoolTokens";
import { tranchedPoolAbi } from "../abis/TranchedPool";

let deployer: any;
let goldfinchAdmin: any;
let nftOwner: any;

(async () => {
  [deployer] = await ethers.getSigners();
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0xa083880f7a5df37bf00a25380c3eb9af9cd92d8f"]
  });
  goldfinchAdmin = await ethers.getSigner(
    "0xa083880f7a5df37bf00a25380c3eb9af9cd92d8f"
  );
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0xb39Fbb76E7677fF97397a1683D01F04df4cFeD82"]
  });
  nftOwner = await ethers.getSigner(
    "0xb39Fbb76E7677fF97397a1683D01F04df4cFeD82"
  );
})().catch((err) => {
  console.error(err);
});

describe("Vault", function () {
  let USDCToken: any;
  let goldfinchConfig: any;
  let poolTokens: any;
  let tranchedPool: any;
  let vault: any;

  const USDC_TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const GOLDFINCH_CONFIG_ADDRESS = "0x4eb844Ff521B4A964011ac8ecd42d500725C95CC";
  const POOL_TOKEN_ADDRESS = "0x57686612c601cb5213b01aa8e80afeb24bbd01df";
  const TRANCHED_POOL_ADDRESS = "0xefeB69eDf6B6999B0e3f2Fa856a2aCf3bdEA4ab5";
  const TOKEN_ID = 34;

  before("...should make some contract instances", async function () {
    USDCToken = new ethers.Contract(USDC_TOKEN_ADDRESS, ERC20Abi, deployer);
    goldfinchConfig = new ethers.Contract(
      GOLDFINCH_CONFIG_ADDRESS,
      goldfinchConfigAbi,
      deployer
    );
    poolTokens = new ethers.Contract(
      POOL_TOKEN_ADDRESS,
      poolTokensAbi,
      deployer
    );
    tranchedPool = new ethers.Contract(
      TRANCHED_POOL_ADDRESS,
      tranchedPoolAbi,
      deployer
    );
  });

  it("...should deploy a Vault contract", async function () {
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(
      POOL_TOKEN_ADDRESS,
      TRANCHED_POOL_ADDRESS,
      "myGoldfinchCredit",
      "MGC"
    );
    console.log("Deploying Vault...");
    console.log("vault deployed to:", vault.address);
  });

  it("...should add the vault contract to goList", async function () {
    await goldfinchConfig.connect(goldfinchAdmin).addToGoList(vault.address);
  });

  it("...the nftOwner should approve the vault to transfer the nft on their behalf", async () => {
    await poolTokens.connect(nftOwner).approve(vault.address, TOKEN_ID);
    const approvedAddress = await poolTokens
      .connect(nftOwner)
      .getApproved(TOKEN_ID);
    expect(approvedAddress).to.eq(vault.address);
  });

  it("...should transfer the NFT to the vault and mint 100 ERC20 fractional tokens", async () => {
    await vault
      .connect(nftOwner)
      .mint(
        POOL_TOKEN_ADDRESS,
        TOKEN_ID,
        BigNumber.from(100).mul(BigNumber.from(10).pow(18))
      );
    const newOwnerAddress = await poolTokens
      .connect(nftOwner)
      .ownerOf(TOKEN_ID);
    expect(newOwnerAddress).to.eq(vault.address);
    const nftOwnerErc20Balance = await vault
      .connect(nftOwner)
      .balanceOf(nftOwner.address);
    expect(nftOwnerErc20Balance.toString()).to.eq((100 * 10 ** 18).toString());
  });

  it("...should transfer 50 ERC20 fractional tokens to the deployer", async () => {
    await vault
      .connect(nftOwner)
      .transfer(
        deployer.address,
        BigNumber.from(50).mul(BigNumber.from(10).pow(18))
      );
    const nftOwnerBalance = await vault.balanceOf(nftOwner.address);
    expect(nftOwnerBalance.toString()).to.eq((50 * 10 ** 18).toString());
    const deployerBalance = await vault.balanceOf(deployer.address);
    expect(deployerBalance.toString()).to.eq((50 * 10 ** 18).toString());
  });

  it("...the deployer should withdraw principal and interest from goldfinch", async () => {
    await vault.withdrawFractional(
      BigNumber.from(25).mul(BigNumber.from(10).pow(18))
    );
    const withdrawAmount = await vault._getWithdrawAmount(
      BigNumber.from(25).mul(BigNumber.from(10).pow(18))
    );
    const balance = await USDCToken.connect(nftOwner).balanceOf(vault.address);
    expect(balance.toString()).to.eq(withdrawAmount.toString());
  });

  /// withdrawAmount and USDC balance doesn't much. this needs to be fixed
});
