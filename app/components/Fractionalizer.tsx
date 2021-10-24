import styles from '../styles/Home.module.css'
import { NFT } from "../common/types" 
import { useState } from "react";
import { useWalletProvider } from './WalletContext';
import { VAULT_ADDRESS, POOL_TOKEN_ID } from "../common/constants";
import { poolTokensAbi } from "../../abis/PoolTokens";
import { ethers } from "ethers";
import {
    Vault__factory as VaultFactory,
    Vault
} from "../typechain";


interface FractionalizerProps {
    nft: NFT
}

const Fractionalizer = ({nft}: FractionalizerProps) => {
    const context = useWalletProvider();
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [totalSupply, setTotalSupply] = useState<number>(0);

    console.log(totalSupply)

    const approveNFT = async() => {
        if(context?.provider) {
            const provider = context?.provider;
            const signer = provider.getSigner();
            const poolTokens = new ethers.Contract(
                nft.tokenAddress,
                poolTokensAbi,
                signer
            );
            const poolTokenAsSigner = await poolTokens.connect(signer);
            console.log(await poolTokenAsSigner.ownerOf(nft.tokenId))
            await poolTokenAsSigner.approve(VAULT_ADDRESS, nft.tokenId);
        } 
    }

    const onApprove = () => {
        approveNFT().then(
            () => {
                setIsApproved(true)
            },
            (err) => {
                setIsApproved(true)
            }
        )
    }

    const mintTokens = async(totalSupply: number) => {
        if(context?.provider) {
            const provider = context?.provider;
            const signer = provider.getSigner();
            const vault: Vault = await VaultFactory.connect(VAULT_ADDRESS, signer)

            await vault.mint(nft.tokenAddress, nft.tokenId, totalSupply)
        }
    }


    const onMint = (totalSupply: number) => {
        mintTokens(totalSupply).then(
            () => {
                setIsCompleted(true)
            }
        )
    }

    return (
        <>
            { !isApproved && !isCompleted &&
                <>
                    <p className={styles.description}>
                        First, approve your NFT to transfer it.
                    </p>
                    <button onClick={onApprove} className={styles.card} style={{'borderColor': '#F39C12', 'fontSize':'1.5rem', 'fontFamily':'inherit'}}> Approve </button>
                </>
            }

            {
                isApproved && !isCompleted && 
                <>
                    <p className={styles.description}>
                        Now, choose the total supply of ERC20 tokens to mint.
                    </p>
                    <input type="number" id="tentacles" name="tentacles" value={totalSupply} onChange={e => setTotalSupply(Number(e.target.value))}></input>
                    <button onClick={() => {onMint(totalSupply)}} className={styles.card} style={{'borderColor': '#F39C12', 'fontSize':'1.5rem', 'fontFamily':'inherit', 'marginTop':'4rem'}}> Mint </button>
                </>
            }

            {
                isCompleted && 
                <p className={styles.description}>
                    Success! Your ERC20 tokens have been minted and transferred to your account.
                </p>
            }

        </>
    )
}

export default Fractionalizer;