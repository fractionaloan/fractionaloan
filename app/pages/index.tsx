import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Footer from '../components/Footer'
import Head from '../components/Head'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head/>
      <main className={styles.main}>
        <div className="main-logo">
          <Image src="/fractionloan.png" alt="Fractionloan Logo" width={400} height={400} />
        </div>
        {/* <p>
          Decentralized protocol where lenders fractionalize credit NFT’s
        </p> */}
        {/* <h1 className={styles.title}>
          Fractionaloan
        </h1> */}

        <p className={styles.description}>
          Buy or sell fractionalized credit NFT's.
        </p>

        <div className={styles.grid}>
          <a href="/borrower" className={styles.card} style={{ }}>
            <h2>Buyer &rarr;</h2>
            {/* <p> Manage your fractional shares.</p> */}
          </a>

          <a href="/lender" className={styles.card} style={{'borderColor': '#F39C12'}}>
            <h2>Seller &rarr;</h2>
            {/* <p>Fractionalize your debt obligation.</p> */}
          </a>
        </div>
      </main>


      <Footer/>
    </div>
  )
}

export default Home
