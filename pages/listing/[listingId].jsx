import {
  MediaRenderer,
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useAddress,
  useConnect,
  useGnosis,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import Web3 from "web3";
import { doc, getDoc } from "firebase/firestore";
import db from "../../db";
import { ethers } from "ethers";

const ListingPage = () => {
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();
  const [delivery, setDelivery] = useState("");
  const [rentingPrice, setRentingPrice] = useState("");
  const [rentTimeMax, setRentTimeMax] = useState("");
  const [rentTaken, setRentTaken] = useState("");
  const [rentShowing, setRentShowing] = useState("");
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const { listingId } = router.query;
  // const connectwithGnosis = useGnosis();
  const address = useAddress();
  // Hooks to detect user is on the right network and switch them if they are not
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // Initialize the marketplace contract
  const marketplace = useMarketplace(
    "0xF1A004Bb5298E95e599CC0dc634bE2B1ec556a40" // Your marketplace contract address here
  );

  // const contract = "0xF9079f7949A856eBd0b000223F0bdAb110196233";
  // Fetch the listing from the marketplace contract
  const { data: listing, isLoading: loadingListing } = useListing(
    marketplace,
    listingId
  );

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState("");

  if (loadingListing && address !== undefined) {
    return <div className={styles.loadingOrError}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
  }

  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(4);
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Rinkeby].wrapped.address, // Wrapped Ether address on Rinkeby
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      // if (listing?.type === ListingType.Auction) {
      //   await marketplace?.auction.makeBid(listingId, bidAmount);
      // }

      // alert(
      //   `${
      //     listing?.type === ListingType.Auction ? "Bid" : "Offer"
      //   } created successfully!`
      // );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function dataFromDb() {
    const usersBeta = await getDoc(doc(db, "usersBeta", address));
    const createData = await getDoc(
      doc(
        db,
        "CreateData",
        listing.assetContractAddress.concat(listing.tokenId)
      )
    );
    console.log(listing.tokenId);
    const usersBetaJson = await usersBeta.data();
    const deliveryAddress = await usersBetaJson.multiSigWallet;
    setDelivery(deliveryAddress);
    console.log(delivery);
    const createDataJson = await createData.data();
    const assetAddress = await createDataJson.NFTAddress;
    console.log(assetAddress);
    const rentSubmitted = await createDataJson.rentPrice;
    console.log(rentSubmitted);
    const rentTimeSubmitted = (await createDataJson.rentTime) - 1;
    setRentTimeMax(rentTimeSubmitted);
    console.log(rentTimeMax);
    const rentInWei = ethers.utils.parseEther(rentSubmitted);
    const price = rentInWei * rentTaken;
    console.log(price);
    setRentingPrice(price);
    const showcase = rentSubmitted * rentTaken;
    setRentShowing(showcase);
  }
  dataFromDb();

  // 08042161729
  //getDoc of both
  //from usersbeta, store multiSig
  //from createData , store rentPrice and Date Time and multiply them and store as price
  //send multiSig to reciever address
  async function buyNft() {

    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(5);
        return;
      }
      // const newAddress = await connectwithGnosis({
      //   safeAddress: delivery,
      //   safeChainId: 4,
      // });
      // console.log("*****************************************", ( newAddress).data.account);
      console.log(listing.assetContractAddress);
      console.log(listing.sellerAddress);

      // Simple one-liner for buying the NFT
      if (rentShowing > 0) {
        console.log(listingId);
        await marketplace?.buyoutListing(listingId, 1, delivery)
        //await setDoc from paper
        //router push to  main page based on above Promise
        router.push("/");
        // web3.eth
        //   .sendTransaction({
        //     from: address,
        //     to: listing.sellerAddress,
        //     value: rentingPrice,
        //   })
        //   .once("receipt", async function (receipt) {
        //     console.log(receipt);

        //   })
        //   .on("error", console.error);
      } else {
        alert("Set Duration");
      }
    } catch (error) {
      console.error(error);

    }
  }

  return (
    <div className={styles.container} style={{}}>
      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
          />
        </div>

        <div className={styles.rightListing}>
          <h1>{listing.asset.name}</h1>
          <p>
            Owned by{" "}
            <b>
              {listing.sellerAddress?.slice(0, 6) +
                "..." +
                listing.sellerAddress?.slice(36, 40)}
            </b>
          </p>

          <h2>
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol} per Day
            <br />
            <b>Total : {rentShowing} </b>
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
            }}
          >
            <button
              style={{ borderStyle: "none" }}
              className={styles.mainButton}
              onClick={buyNft}
            >
              Rent
            </button>
            <p style={{ color: "grey" }}></p>
            <div
              style={{
                display: "flex",
                flexDirection: "  ",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="number"
                min="10"
                onChange={(e) => {
                  setRentTaken(e.target.value);
                }}
                max={rentingPrice}
                className={styles.textInput}
                required
                placeholder="Duration"
                style={{ marginTop: 0, marginLeft: 0, width: 128 }}
              />
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default ListingPage;
