import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

export interface WalletContextInterface {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  connectWallet: () => void;
}

const WalletContext = createContext<WalletContextInterface | null>(null);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (userAddress && provider) {
      return;
    }
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.enable();
      } catch (e) {
        throw Error("Metamask connection declined");
      }
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
      setProvider(provider);
    } else {
      throw Error("Metamask needs to be installed");
    }
  };

  useEffect(() => {
    if(!userAddress || !provider) {
        connectWallet()
    }
  }, []);

  const state: WalletContextInterface = {
    address: userAddress,
    provider: provider,
    connectWallet: connectWallet,
  };

  return <WalletContext.Provider value={state}>{children}</WalletContext.Provider>;
};

export const useWalletProvider = () => React.useContext(WalletContext);

export const WalletContextProvider = WalletContext;
