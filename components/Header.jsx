import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";
import {
  collection,
  doc,
  query,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../db";
import toast, { Toaster } from "react-hot-toast";

export default function Header() {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const [safeFound, setSafeFound] = useState("");
  const [savedAddress, setSavedAddress] = useState(false);
  const [connected, setConnected] = useState(false)

  const data = {
    address,
    multiSigWallet: "",
  };
  if (address) {
    setDoc(doc(db, "usersBeta", address), data);
    settingSafe();
  }

  async function safeContract() {
    const web3 = new Web3(Web3.givenProvider);
    const safeOwner = address;

    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: safeOwner,
    });

    const txServiceUrl = "https://safe-transaction.gnosis.io";
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = ["0xBbefc461F6D944932EEea9C6d4c26C21e9cCeFB8", address];
    const threshold = 2;

    const safeAccountConfig = {
      owners,
      threshold,
    };

    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const safeView = safeFactory.getAddress();
    safeSdk;
    console.log(safeView);
    console.log(safeSdk.getAddress());
    const safeAddress = safeSdk.getAddress();
    setSafeFound(safeAddress);
    setSavedAddress(true);
  }
  async function settingSafe() {
    const q = query(collection(db, "usersBeta"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      // doc.data() is never undefined for query doc snapshots
      if (document.id === address) {
        const multiSig = document.data();
        
        console.log(multiSig)
        if (multiSig.length > 0) {
          safeContract();
          if (savedAddress) {
            setSavedAddress(false);
            const data = {
              multiSig: safeFound,
            };
            console.log(data);
            updateDoc(doc(db, "usersBeta", address), {
              multiSig: safeFound,
            });
          }
        } else {
          return;
        }
      }
    });
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
        {address ? (
          <>
            <Link href="/collections">
              <a
                className={styles.mainButton}
                style={{ textDecoration: "none" }}
              >
                Create
              </a>
            </Link>
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
          <>
            <a className={styles.mainButton} onClick={() => connectWithMetamask()}>
              <button style={{  background: "none", border: "none" }} onClick = {() => {settingSafe()}}>Connect Wallet</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
