import styles from '../styles/Home.module.css'
import { PAGE_AUTO_REFRESH_INTERVAL_MS } from "../common/constants"
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
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [availableAmount, setAvailableAmount] = useState<number>(0);
    const [availableInterestAmount, setAvailableInterestAmount] = useState<number>(0);
    const [availablePrincipalAmount, setAvailablePrincipalAmount] = useState<number>(0);
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
            const availableWithdrawAmount = await vault._getWithdrawAmount(contractOwnedTokens);
            const interestAndPrincipal = await vault.getInterestAndPrincipal();
            // it looks like the first index should return the interest available but it returns principal?
            // https://github.com/goldfinch-eng/goldfinch-contracts/blob/55a7799bd7d30778bc026ab6b4f9b956115c76ff/v2.0/protocol/core/TranchedPool.sol#L466
            const withdrawInterestAmount = interestAndPrincipal[1];
            const withdrawPrincipalAmount = interestAndPrincipal[0];

            setAvailableAmount(availableWithdrawAmount.toNumber());
            setAvailableInterestAmount(withdrawInterestAmount.toNumber());
            setAvailablePrincipalAmount(withdrawPrincipalAmount.toNumber());
            setOwnedTokens(contractOwnedTokens.toNumber());
            setTotalTokens(totalTokens.toNumber());
        }
    }

    // Refresh the vault data every PAGE_AUTO_REFRESH_INTERVAL_MS so the user doesnt have to refresh
    // theres probably some cool websocket thing that does this?
    const [_, setTime] = useState(Date.now());
    useEffect(() => {
    const interval = setInterval(() => {
        readVaultData();
        setTime(Date.now())
    }, PAGE_AUTO_REFRESH_INTERVAL_MS);
        return () => {
            clearInterval(interval);
        };
    }, []);


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
            {totalTokens === 0 && <p>
                ⚠️ NFT owner has not yet minted ERC20 tokenized shares ⚠️
            </p>}
            <p>
                Available Amount to Withdraw: {availableAmount} USDC
            </p>
            <p>
                Available Principal to Withdraw: {availablePrincipalAmount} USDC
            </p>
            <p>
                Available Interest to Withdraw: {availableInterestAmount} USDC
            </p>
            <p>
                Owned tokens: {ownedTokens}
            </p>
            <p>
                Total tokens: {totalTokens}
            </p>
            {totalTokens !== 0 && <div><p>
                Percent Ownership of Pool: {((ownedTokens / totalTokens) * 100).toFixed(2) + '%'}
            </p>
            <p className={styles.description}>
                Burn tokens
            </p>
            </div>}
            <input type="number" id="tentacles" name="tentacles" value={burnAmount} onChange={async (e) => {
                setBurnAmount(Number(e.target.value));
                if(context?.provider) {
                    const provider = context?.provider;
                    const signer = provider.getSigner();
                    const vault: Vault = await VaultFactory.connect(VAULT_ADDRESS, signer)
                    const withdrawAmount = await vault._getWithdrawAmount(String(e.target.value));
                    setWithdrawAmount(withdrawAmount.toNumber());
                    console.log('withdrawAmount ==>', withdrawAmount);
                }
            }
            }></input>
            <p>withdraw amount: {withdrawAmount} USDC</p>
            <button onClick={onWithdraw} disabled={totalTokens === 0} className={styles.card} style={{'fontSize':'1rem', 'fontFamily':'inherit', 'padding':'1rem'}}> Burn and withdraw </button>
        </>
    )
}

export default VaultViewer;