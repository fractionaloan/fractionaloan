import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Footer from '../components/Footer'
import Head from '../components/Head'
import Header from '../components/Header';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head/>
      <main className={styles.main}>
        <Header/>
        <h1 className={styles.title}>
          Welcome to Fractionaloan
        </h1>

        <p className={styles.description}>
          Select whether you want to buy or sell a fractioanlized debt obligation.
        </p>

        <div className={styles.grid}>
          <a href="/borrower" className={styles.card}>
            <h2>Buyer &rarr;</h2>
            <p> Manage your fractionalized shares.</p>
          </a>

          <a href="/lender" className={styles.card}>
            <h2>Seller &rarr;</h2>
            <p>Fractionalize your debt obligation.</p>
          </a>
        </div>
      </main>


      <Footer/>
    </div>
  )
}

export default Home
