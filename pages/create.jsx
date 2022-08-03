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

const Create = () => {
  // Next JS Router hook to redirect to other pages
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [rentListing, setRentListing] = useState(true);

  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    "0xF9079f7949A856eBd0b000223F0bdAb110196233" // Your marketplace contract address here
  );



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
      const { listingType, contractAddress, tokenId, price } =
        e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      //Renting algorithm

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(contractAddress, tokenId, price) {
    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
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
      <div className={styles.header}>
        <div className={styles.left}>
          <div></div>
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
              <p>
                {address.slice(0, 6).concat("...").concat(address.slice(-4))}
              </p>
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
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
      <form onSubmit={(e) => handleCreateListing(e)}>
        <div className={styles.container}>
          {/* Form Section */}
          <div className={styles.collectionContainer}>
            <h1 className={styles.ourCollection}>
              Rent your NFT in the marketplace:
            </h1>

            {/* Toggle between direct listing and auction listing */}
            <div className={styles.listingTypeContainer}>
              {/* <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className={styles.listingType}
              onClick={() => {
                setRentListing(false);
              }}
            />
            <label htmlFor="directListing" className={styles.listingTypeLabel}>
              Direct Listing
            </label>

            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className={styles.listingType}
              onClick={() => {
                setRentListing(false);
              }}
            />
            <label htmlFor="auctionListing" className={styles.listingTypeLabel}>
              Auction Listing
            </label> */}
              {/* <input
              type="radio"
              name="listingType"
              id="rentListing"
              value="rentListing"
              className={styles.listingType}
              onClick={() => {
                setRentListing(true);
              }}
            />
            <label htmlFor="rentListing" className={styles.listingTypeLabel}>
              Rent{" "}
            </label> */}
            </div>

            {/* NFT Contract Address Field */}
            <input
              type="text"
              name="contractAddress"
              className={styles.textInput}
              placeholder="NFT Contract Address"
            />

            {/* NFT Token ID Field */}
            <input
              type="text"
              name="tokenId"
              className={styles.textInput}
              placeholder="NFT Token ID"
            />

            {/* Sale Price For Listing Field */}
            {/* {!rentListing &&
          <input
            type="text"
            name="price"
            className={styles.textInput}
            placeholder="Sale Price"
          />
} */}

            {/*Renting price*/}

            {rentListing && (
              <input
                type="number"
                min="0"
                name="rentPrice"
                className={styles.textInput}
                placeholder="Rent Price Per Day"
              />
            )}

            <input
              type="number"
              min="0"
              name="rentDuration"
              className={styles.textInput}
              placeholder="Maximum Renting Time"
            />
            <button
              onClick={(e) => {if(!address){
                toast.error("Connect Wallet")
              }}}
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
