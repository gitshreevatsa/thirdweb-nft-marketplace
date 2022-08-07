import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import safeDeploy from "../safeContract";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import db from "../db";
import toast, { Toaster } from "react-hot-toast";
import { async } from "@firebase/util";

export default function Header() {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress(); //has address
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const [safeFound, setSafeFound] = useState(""); //has safe address
  const [connected, setConnected] = useState(false);
  const [reDirect, setReDirected] = useState("");

  async function dqQuery() {
    const docRef = doc(db, "usersBeta", address);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const documentdata = docSnap.data();
      const safeAdd = await documentdata.address;
      const safeDB = await documentdata.multiSigWallet;
      if (
        address === safeAdd &&
        (safeDB === undefined || safeDB.length <= 0)
      ) {
        console.log("**************************");
        const safeAddress = await safeDeploy(address);
        setSafeFound(safeAddress)
        await updateDoc(docRef, {
          multiSigWallet: safeAddress,
        });
        console.log("------------------------");
        setConnected(true);
        const redirect = "https://gnosis-safe.io/app/gor:" + safeFound;
        setReDirected(redirect);
      } else {
        setConnected(true);
        setSafeFound(safeDB);
        const redirect = "https://gnosis-safe.io/app/gor:" + safeFound;
        setReDirected(redirect);
      }
      // if(safeDeploy.length <= 0) {
      //   await updateDoc(docRef,{
      //     multiSigWallet: safeFound
      //   })
      //   setConnected(true)
      // }

      //retreive data from db
      // if address present
      //set connected to true
      //safefound is multisig from db
      //else connected to false
      //update doc with multisig from site
    } else {
      // doc.data() will be undefined in this case
      const safeAddress = await safeDeploy(address)
      const data = {
          address,
          multiSigWallet: safeAddress
      }
      setDoc(doc(db, "usersBeta", address), data)
    }
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
      {!address ? (
        <div>Connect your Wallet</div>
      ) : connected ? (
        <div>
          Your Safe : <Link href={reDirect} target="_blank">{safeFound}</Link>
        </div>
      ) : (
        <div>
          Create your safe{" "}
          <a
            onClick={dqQuery}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            here
          </a>
        </div>
      )}
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
            <a
              className={styles.mainButton}
              onClick={() => connectWithMetamask()}
            >
              <button style={{ background: "none", border: "none" }}>
                Connect Wallet
              </button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
