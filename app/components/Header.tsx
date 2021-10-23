import { useWalletProvider } from "./WalletContext"

const Header = () => {
    const context = useWalletProvider();
    const address = context?.address;
    const connectWallet = () => {
        if(context) {
            context.connectWallet();
        }
    }

    return (
        <div> 
            {
                address && <div> {address} </div>
            }
            {
                !address && <button onClick={connectWallet}> Connect wallet </button>
            }
        </div>
    )
}

export default Header