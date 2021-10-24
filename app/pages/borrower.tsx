import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useState } from "react";
import Header from "../components/Header";
import VaultSelector from '../components/VaultSelector';
import VaultViewer from '../components/VaultViewer';
import Head from "../components/Head";
import Footer from '../components/Footer';

const Home: NextPage = () => {
  const [ selectedVault, setSelectedVault ] = useState<string | null>(null);
  
  const onSelectVault = (vaultAddress: string) => {
    setSelectedVault(vaultAddress);
  }

  return (
    <div className={styles.container}>
      <Head/>
      <Header/>

      <main className={styles.main}>

          {!selectedVault && <VaultSelector onSelectVault={onSelectVault}/> }
          {selectedVault && <VaultViewer vaultAddress={selectedVault}/>}

      </main>
      {/* <Footer/> */}
    </div>
  )
}

export default Home
