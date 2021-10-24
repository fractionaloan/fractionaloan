import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NFTSelector from "../components/NFTSelector";
import Footer from "../components/Footer";
import Head from "../components/Head";
import Header from "../components/Header";
import { useState } from "react";
import { NFT } from "../common/types";
import Fractionalizer from '../components/Fractionalizer';




const Home: NextPage = () => {
  const [ selectedNFT, setSelectedNFT ] = useState<NFT | null>(null);
  
  const onSelectNFT = (nft: NFT) => {
    setSelectedNFT(nft);
  }

  return (
    <div className={styles.container}>
      <Head/>
      <Header/>

      <main className={styles.main}>

          {!selectedNFT && <NFTSelector onSelectNFT={onSelectNFT}/> }
          {selectedNFT && <Fractionalizer nft={selectedNFT}/>}

      </main>
    </div>
  )
}

export default Home
