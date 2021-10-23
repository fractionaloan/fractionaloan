import styles from '../styles/Home.module.css'
import { NFT } from "../common/types" 
import { useState } from "react";

interface FractionalizerProps {
    nft: NFT
}

const Fractionalizer = ({nft}: FractionalizerProps) => {
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    return (
        <>
            { !isApproved && !isCompleted &&
                <>
                    <p className={styles.description}>
                        First, approve your NFT to transfer it.
                    </p>
                    <button onClick={() => {setIsApproved(true)}}> Approve </button>
                </>
            }

            {
                isApproved && !isCompleted && 
                <>
                    <p className={styles.description}>
                        Now, choose the total supply of ERC20 tokens to mint.
                    </p>
                    <input type="number" id="tentacles" name="tentacles"></input>
                    <button onClick={() => {setIsCompleted(true)}}> Mint </button>
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