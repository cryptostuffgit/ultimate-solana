import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head';
import MainView from '../components/MainView';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="layout">
      <canvas id="my-target" className="confetti"></canvas>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar connected={connected} />
        <div className={styles.container}>
          <MainView connected={connected} />
        </div>
      </div>
    </div>
  );
}
