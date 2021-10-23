
import { JsonRpcProvider } from '@ethersproject/providers';
import { goldfinchConfigAbi } from "../abis/GoldfinchConfig";
import { poolTokensAbi } from "../abis/PoolTokens";
import {
  Vault,
  Vault__factory as VaultFactory
} from "../typechain"
import * as hre from "hardhat";
import {ethers } from "ethers";
import {Wallet } from "ethers";
// import { ethers } from "hardhat";


const CHAIN_ID = 4;
const JSON_RPC_ENDPOINT = "127.0.0.1:8545";
// const TEST_PRIVATE_KEY = "0x84a8bb71450a1b82be2b1cdd25d079cbf23dc8054e94c47ad14510aa967f45de";
const METAMASK_ADDRESS = "0x5409ED021D9299bf6814279A6A1411A7e866A631"

const TEST_WALLET = "0x959fd7ef9089b7142b6b908dc3a8af7aa8ff0fa1"
const TEST_PRIVATE_KEY = "0xabf82ff96b463e9d82b83cb9bb450fe87e6166d4db6d7021d0c71d7e960d5abe"


const GOLDFINCH_ADMIN_ADDRESS = "0xa083880f7a5df37bf00a25380c3eb9af9cd92d8f";
const NFT_OWNER_ADDRESS = "0xb39Fbb76E7677fF97397a1683D01F04df4cFeD82";

const USDC_TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const GOLDFINCH_CONFIG_ADDRESS = "0x4eb844Ff521B4A964011ac8ecd42d500725C95CC";
const POOL_TOKEN_ADDRESS = "0x57686612c601cb5213b01aa8e80afeb24bbd01df";
const TRANCHED_POOL_ADDRESS = "0xefeB69eDf6B6999B0e3f2Fa856a2aCf3bdEA4ab5";
const TOKEN_ID = 34;

async function start() {
  //   const args = require('minimist')(process.argv.slice(2));
  const args = { chainId: CHAIN_ID };

  if (!args.chainId) {
    throw new Error('--chainId chain ID is required');
  }
  
  const provider = new JsonRpcProvider();
  const wallet = new Wallet(TEST_PRIVATE_KEY, provider);
  // const [wallet] = await ethers.getSigners(

  // );


  const goldfinchConfig = new ethers.Contract(
    GOLDFINCH_CONFIG_ADDRESS,
    goldfinchConfigAbi,
    wallet
  );

  const poolTokens = new ethers.Contract(
    POOL_TOKEN_ADDRESS,
    poolTokensAbi,
    wallet
  );
  console.log("deploy");
  const vault = await (await new VaultFactory(wallet)).deploy(
    POOL_TOKEN_ADDRESS,
    TRANCHED_POOL_ADDRESS,
    "myGoldfinchCredit",
    "MGC"
  );
  
  console.log("goldfinch")
  // use goldfinch admin signer to approve vault contract and test wallet
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [GOLDFINCH_ADMIN_ADDRESS]
  });
  const adminSigner = provider.getSigner(GOLDFINCH_ADMIN_ADDRESS);
  await goldfinchConfig.connect(adminSigner).addToGoList(vault.address);
  await goldfinchConfig.connect(adminSigner).addToGoList(wallet.address);

  console.log("nft transfer")
  // use nftOwner to transfer to test metamask wallet
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [NFT_OWNER_ADDRESS]
  });
  const nftSigner = provider.getSigner(NFT_OWNER_ADDRESS)
  await poolTokens.connect(nftSigner).approve(wallet.address, TOKEN_ID);
  await poolTokens.connect(nftSigner).safeTransferFrom(nftSigner._address, wallet.address, TOKEN_ID);

  console.log(`Contracts deployed and configured.`);

  process.exit();
}
start().catch((e: Error) => {
    console.error(e);
    process.exit(1);
});
  