import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import db from '../db';
import {  doc, setDoc } from "firebase/firestore";

export default function Header() {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const data = {
    address,
    multiSigAddress : "",
    collectionName: [],
  }
  if(address){
    setDoc(doc(db, "usersBeta", address), data)
  }

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div>
          <Link href="/" passHref role="button">
            <h2 style={{ cursor: "pointer" }}>NREFT</h2>
          </Link>
        </div>
      </div>

      <div className={styles.right}>
      <Link href="/collections">
            <a className={styles.mainButton} style={{ textDecoration: "none" }}>
              Create
            </a>
          </Link>
        {address ? (
          <>
            <a
              className={styles.secondaryButton}
              onClick={() => disconnectWallet()}
            >
              Disconnect Wallet
            </a>
            <p style={{ marginLeft: 8, marginRight: 8, color: "grey" }}>|</p>
            <p>{address.slice(0, 6).concat("...").concat(address.slice(-4))}</p>
          </>
        ) : (
          <a
            className={styles.mainButton}
            onClick={() => connectWithMetamask()}
          >
            Connect Wallet
          </a>
        )}
      </div>
    </div>
  );
}
