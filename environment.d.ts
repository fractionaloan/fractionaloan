declare namespace NodeJS {
  export interface ProcessEnv {
    ALCHEMY_API_KEY: string;
    INFURA_API_KEY: string;
    DEPLOYMENT_ACCOUNT_PRIVATE_KEY: string;
    MNEMONIC_WORDS: string;
    WALLET_INITIAL_INDEX: string;
    ETHERSCAN_API_KEY: string;
  }
}
