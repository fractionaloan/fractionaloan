
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

const TEST_WALLET = "0xf986f4620340832c84b71f72da981c18a69eebb1"
const TEST_PRIVATE_KEY = "0x92714bfb5004cb3d173198146edbf36376e16752e4fe3aa0091591355859e727"

const GOLDFINCH_ADMIN_ADDRESS = "0xa083880f7a5df37bf00a25380c3eb9af9cd92d8f";
const NFT_OWNER_ADDRESS = "0xb39Fbb76E7677fF97397a1683D01F04df4cFeD82";

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

  console.log(`Deployed contract to ${vault.address}`)

  console.log("goldfinch")
  // use goldfinch admin signer to approve vault contract and test wallet
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [GOLDFINCH_ADMIN_ADDRESS]
  });
  const adminSigner = provider.getSigner(GOLDFINCH_ADMIN_ADDRESS);
  await (await goldfinchConfig.connect(adminSigner)).addToGoList(vault.address);
  await (await goldfinchConfig.connect(adminSigner)).addToGoList(wallet.address);

  console.log("nft transfer")
  // use nftOwner to transfer to test metamask wallet
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [NFT_OWNER_ADDRESS]
  });
  const nftSigner = provider.getSigner(NFT_OWNER_ADDRESS)
  const poolTokenAsSigner = await poolTokens.connect(nftSigner);
  await poolTokenAsSigner.approve(wallet.address, TOKEN_ID);
  await poolTokenAsSigner.transferFrom(nftSigner._address, wallet.address, TOKEN_ID);

  // Trying to debug why the approval fails.
  // const poolTokenAsOwner = await poolTokens.connect(wallet.address);
  // await poolTokenAsOwner.approve(vault.address, TOKEN_ID);

  console.log(`Contracts deployed and configured.`);

  process.exit();
}
start().catch((e: Error) => {
    console.error(e);
    process.exit(1);
});
