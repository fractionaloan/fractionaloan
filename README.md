## Abstract

Fractionaloan is a decentralized protocol where lenders can mint tokenized fractional ownership of their NFTs that represent their credit.

## Develop Locally

1. Clone this repo and yarn install

```bash
  git clone https://github.com/flactionaloan/flactionaloan-contracts
  cd flactionaloan-contracts
  yarn install
```

2. Create an [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) account and get their api key.

3. Declare environment variables

I encourage you to declare environment variables in your `.bash_profile`(or .zprofile and others) to avoid sharing your credentials accidentally. You can also make `.env` file in the root of this repository although I do not recommend it.

`.bash_profile`

```bash
export ALCHEMY_API_KEY = <alchemy_api_key>
export INFURA_API_KEY = <infura_api_key>
export DEPLOYMENT_ACCOUNT_PRIVATE_KEY = <deployment_account_private_key>
export MNEMONIC_WORDS = <mnemonic_words>
export WALLET_INITIAL_INDEX = "0"
export ETHERSCAN_API_KEY = <etherscan_api_key>
```

You can leave `DEPLOYMENT_ACCOUNT_PRIVATE_KEY` and `ETHERSCAN_API_KEY` empty until you deploy to the mainnet. I recommend obtaining your mnemonic words from MetaMask and storing in `MNEMONIC_WORDS`.

You are ready to write code!

## Npm Script

`npm run compile`: compiles your contracts, and generate artifacts & cache.

`npm run deploy:mainnet_forked`: deploys your contracts to the mirrored version of the mainnet in your local network.

`npm run node`: runs the default network configured in the `hardhat.config.ts`.

`cd app && yarn dev`: runs the web app


## Developing on the App

### Start Hardhat node

First, run `yarn node` to start your own hardhat test network. This will print out a few wallets with existing ETH. 

Select one of these public/private key pairs to use as your own test wallet. 


### Deploy contracts

In `scripts/deploy.ts` change `TEST_WALLET` and `TEST_PRIVATE_KEY` to be your own wallet, then run `yarn deploy`

You should see a printed out address that says `Deployed contract to {{address}}`
### Start App

Set `VAULT_ADDRESS` in `app/common/contants` to match the deployed address.

Then start the app with 
```
cd app/
yarn install && yarn dev
```


