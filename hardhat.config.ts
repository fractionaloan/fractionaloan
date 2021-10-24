import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/ethers-v5";
import "@typechain/hardhat";
import dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        // url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        blockNumber: 13475972 // use the same block number to make subsequent runs faster with cache.
      },
      chainId: 1337,
      gas: "auto", // gasLimit
      gasPrice: 430000000000, // check the latest gas price market in https://www.ethgasstation.info/
      accounts: {
        mnemonic: process.env.MNEMONIC_WORDS,
        initialIndex: process.env.WALLET_INITIAL_INDEX
          ? parseInt(process.env.WALLET_INITIAL_INDEX)
          : 0 // set index of account to use inside wallet (defaults to 0)
      }
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      // url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      gas: "auto", // gasLimit
      gasPrice: 43000000000, // check the latest gas price market in https://www.ethgasstation.info/
      // accounts: [`0x${process.env.DEPLOYMENT_ACCOUNT_PRIVATE_KEY}`] [omar] couldn't figure out how to fix this lol
      accounts: []
    }
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 2000000
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
