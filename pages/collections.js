import React, { useState } from "react";
import { useAddress, useSDK, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import toast, { Toast, Toaster } from "react-hot-toast";


function Collections() {
  const [collectionName, setCollectionName] = useState("");
  const[verified, setverified] = useState()
  const [royaltyFee, setRoyaltyFee] = useState("");
  const address = useAddress()
  const sdk = useSDK()
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();


  const nameVerification = (e) => {
    console.log("---------------")
    setCollectionName(e.target.value.trim())
    setverified(false)

    console.log(verified)
  }
  async function handleChange(e) {
    e.preventDefault();
    //verification of form data (form validation)
    if(!address){
        toast.error("Connect Wallet")
      }
    //Pushing to Database
    if(collectionName.length <= 0){
      setverified(true)
    }else{
      setverified(false)

    }
    //thirdweb integration begins
    if(collectionName.length > 0 && address){

    const contractAddress = await sdk.deployer.deployNFTCollection({
      name: collectionName,
      primary_sale_recipient: address,
    });

    contractAddress;

    console.log(contractAddress)
  }
    //thirdweb integration ends

  }
  return (
    <>
    <div className={styles.header}>
    <div className={styles.left}>
        <div>

        </div>
      </div>
    <div className={styles.right}>

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
    <div>
        <Toaster
        position="bottom-left"
        reverseOrder = {false}
        />
    </div>
    <form onSubmit={(e) => handleChange(e)}>
      <div className={styles.container}>
        {/* Form Section */}
        <div className={styles.collectionContainer}>
          <h1 className={styles.ourCollection}>
            Create your Collection
          </h1>


          {/* NFT Collection name Field */}
          <input
            type="text"
            name="collectionName"
            value={collectionName}
            className={styles.textInput}
            placeholder="Collection name"
            onChange={(e) => {nameVerification(e)}}
          />
            {verified && <div>Add a Valid Name</div>}

          {/* Royalty Field */}
          <input
            type="text"
            name="royaltyFee"
            className={styles.textInput}
            placeholder="Royalty Fee"
            onChange={(e) => {setRoyaltyFee(e.target.value)}}

          />

          <button
            type="submit"
            className={styles.mainButton}
            style={{ marginTop: 32, borderStyle: "none" }}
          >
            Create
          </button>
        </div>
      </div>
    </form>
    </>
  );
}

export default Collections;
