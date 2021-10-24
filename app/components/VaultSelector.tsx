import styles from '../styles/Home.module.css'
import { VAULT_ADDRESS } from "../common/constants";

interface VaultSelectorProps {
    onSelectVault: (vaultAddress: string) => void
}

const VaultSelector = ({ onSelectVault }: VaultSelectorProps) => {
    return (
        <>
        <h1 className={styles.title}>
          Buyer
        </h1>
        <p className={styles.description}>
            Select your fractionalized debt below
        </p>
        <div className={styles.grid} >
            <div className={styles.card} onClick={() => {onSelectVault(VAULT_ADDRESS)}} style={{'borderColor': '#F39C12'}}>
                <h2>Contract 1 &rarr;</h2>
                {/* <p>This contract here</p> */}
            </div>
        </div>
        </>
    )
}

export default VaultSelector;