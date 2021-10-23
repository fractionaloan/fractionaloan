import styles from '../styles/Home.module.css'
import { NFT } from "../common/types";

interface NFTSelectorProps {
    onSelectNFT: (nft: NFT) => void
}

const mockNFT: NFT = { 
    tokenId: 12,
    tokenAddress: "address"
}

const NFTSelector = ({ onSelectNFT }: NFTSelectorProps) => {
    return (
        <>
        <p className={styles.description}>
            Select your Goldfinch Debt Obligation below
        </p>
        <div className={styles.grid} >
            <div className={styles.card} onClick={() => {onSelectNFT(mockNFT)}}>
                <h2>Contract 1 &rarr;</h2>
                <p>This contract here</p>
            </div>
        </div>
        </>
    )
}

export default NFTSelector;