import {
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import toast, { Toast, Toaster } from "react-hot-toast";
import Header from "../components/Header";
import { setDoc, doc, getDoc } from "firebase/firestore";
import db from "../db";

const Create = () => {
  // Next JS Router hook to redirect to other pages
  const address = useAddress();
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [rentListing, setRentListing] = useState(true);
  const [rentTime, setRentTime] = useState("");
  const [NFTAddress, setContractAddress] = useState("");
  const [rentPrice, setRentPrice] = useState("")
  const [TokenId, setTokenId] = useState("")
  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    "0xF9079f7949A856eBd0b000223F0bdAb110196233" // Your marketplace contract address here
  );

  // if(address){
  //   toast.error("Connect Wallet")
  // }

  // This function gets called when the form is submitted.
  async function handleCreateListing(e) {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(4);
        return;
      }

      // Prevent page from refreshing
      e.preventDefault();

      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult = undefined;

      // De-construct data from form submission
      const { listingType, contractAddress, tokenId } =
        e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          rentPrice
        );

      }
      // For Auction Listings:

      //Renting algorithm

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        console.log(transactionResult);
        const createData = {
          NFTAddress,
          "Owner Address" : address,
          rentTime,
          rentPrice,
          TokenId
        };
        //Pushing to DB
        const fieldName = NFTAddress + "||||" + TokenId
        setDoc(doc(db, "CreateData", fieldName), createData);
        console.log("******", createData);
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(contractAddress, tokenId, price) {
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header />
      <div></div>
      <form onSubmit={(e) => handleCreateListing(e)}>
        <div className={styles.container}>
          {/* Form Section */}
          <div className={styles.collectionContainer}>
            <h1 className={styles.ourCollection}>
              Rent your NFT in the marketplace:
            </h1>

            {/* Toggle between direct listing and auction listing */}
            <div className={styles.listingTypeContainer}>
              <input
                type="radio"
                name="listingType"
                id="rentListing"
                value="directListing"
                className={styles.listingType}
                onClick={() => {
                  setRentListing(true);
                }}
                defaultChecked
              />
              <label htmlFor="rentListing" className={styles.listingTypeLabel}>
                Rent{" "}
              </label>
            </div>
            {/* NFT Contract Address Field */}
            <input
              type="text"
              name="contractAddress"
              className={styles.textInput}
              placeholder="NFT Contract Address"
              onChange={(e)=> {setContractAddress(e.target.value)}}
            />

            {/* NFT Token ID Field */}
            <input
              type="text"
              name="tokenId"
              className={styles.textInput}
              placeholder="NFT Token ID"
              onChange = {(e) => {setTokenId(e.target.value)}}
            />

            {/* Sale Price For Listing Field */}

            {/*Renting price*/}

            {rentListing && (
              <input
                type="string"
                min="0"
                name="price"
                className={styles.textInput}
                placeholder="Rent Price Per Day"
                onChange = {(e) => {setRentPrice(e.target.value)}}
              />
            )}

            <input
              type="number"
              min="0"
              max="45"
              name="rentDuration"
              className={styles.textInput}
              placeholder="Maximum Renting Time"
              onChange={(e) => {
                setRentTime(e.target.value);
              }}
            />
            <button
              onClick={(e) => {
                if (!address) {
                  toast.error("Connect Wallet");
                }
              }}
              type="submit"
              className={styles.mainButton}
              style={{ marginTop: 32, borderStyle: "none" }}
            >
              Rent NFT
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Create;
