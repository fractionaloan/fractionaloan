import styles from '../styles/Home.module.css'
import { NFT } from "../common/types" 
import { useEffect, useState } from "react";
import { useWalletProvider } from './WalletContext';
import { VAULT_ADDRESS,  } from "../common/constants";
import { poolTokensAbi } from "../../abis/PoolTokens";
import {ethers } from "ethers";
import {
    Vault__factory as VaultFactory,
    Vault
} from "../typechain";


interface VaultViewerProps {
    vaultAddress: string
}

const VaultViewer = ({vaultAddress}: VaultViewerProps) => {
    const context = useWalletProvider();
    const [burnAmount, setBurnAmount] = useState<number>(0);
    const [availableAmount, setAvailableAmount] = useState<number>(0);
    const [ownedTokens, setOwnedTokens] = useState<number>(0);
    const [totalTokens, setTotalTokens] = useState<number>(0);

    const readVaultData = async() => {
        if(context?.provider) {
            const provider = context?.provider;
            const signer = provider.getSigner();
            const vault: Vault = await VaultFactory.connect(VAULT_ADDRESS, signer)

            console.log(await signer.getAddress());
            console.log(VAULT_ADDRESS);
            const contractOwnedTokens = await vault.balanceOf(await signer.getAddress());
            const totalTokens = await vault.totalSupply();
            const withdrawAmount = await vault._getWithdrawAmount(contractOwnedTokens)

            setAvailableAmount(withdrawAmount.toNumber());
            setOwnedTokens(contractOwnedTokens.toNumber());
            setTotalTokens(totalTokens.toNumber());
        }
    }

    useEffect(() => {
     readVaultData();            
    }, [])

    const withdraw = async(burnAmount: number) => {
        if(context?.provider) {
            const provider = context?.provider;
            const signer = provider.getSigner();
            const vault: Vault = await VaultFactory.connect(VAULT_ADDRESS, signer)

            await vault.withdrawFractional(burnAmount);
        }
    }

    const onWithdraw = () => {
        if(burnAmount > 0) {
            withdraw(burnAmount).then(
                () => {
                    setBurnAmount(0);
                }
            )
        }
    }


    return (
        <>
            <p className={styles.description}>
                Debt Details
            </p>
            <p>
                Available Amount to Withdraw: {availableAmount}
            </p>
            <p>
                Owned tokens: {ownedTokens}
            </p>
            <p>
                Total tokens: {totalTokens}
            </p>
            <p className={styles.description}>
                Burn tokens
            </p>
            <input type="number" id="tentacles" name="tentacles" value={burnAmount} onChange={e => setBurnAmount(Number(e.target.value))}></input>
            <button onClick={onWithdraw}> Burn and withdraw </button>
        </>
    )
}

export default VaultViewer;