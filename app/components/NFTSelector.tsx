import styles from '../styles/Home.module.css'
import { NFT } from "../common/types";
import { POOL_TOKEN_ADDRESS, POOL_TOKEN_ID } from "../common/constants";
interface NFTSelectorProps {
    onSelectNFT: (nft: NFT) => void
}

const poolNFT: NFT = { 
    tokenId: POOL_TOKEN_ID,
    tokenAddress: POOL_TOKEN_ADDRESS
}

const NFTSelector = ({ onSelectNFT }: NFTSelectorProps) => {
    return (
        <>
        <h1 className={styles.title}>
          Seller
        </h1>
        <p className={styles.description}>
            Select your Goldfinch Debt Obligation below
        </p>
        <div className={styles.grid} >
            <div className={styles.card} onClick={() => {onSelectNFT(poolNFT)}} style={{'borderColor': '#F39C12'}}>
                <h2>Contract 1 &rarr;</h2>
                {/* <p>This contract here</p> */}
            </div>
        </div>
        </>
    )
}

export default NFTSelector;