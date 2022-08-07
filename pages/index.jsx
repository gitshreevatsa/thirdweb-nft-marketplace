import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useMarketplace,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();
  const address = useAddress();

  const guidelines = "https://periwinkle-thorium-69c.notion.site/NREFT-Onboarding-BETA-5732219a79b747058861dc3050aa9e64"
  // Connect your marketplace smart contract here (replace this address)
  const marketplace = useMarketplace(
    "0xECe5C99a6723dD0490159B9a4Fb6A08D6cA143F1" // Your marketplace contract address here
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);

    const sendThem = async() => {
      if(address !== undefined){
        alert("Connect Wallet")
      }else{

      }
    }
    // const gnosis = "0xE152ECA5688E8EF476F8248f0Bef825e97BFDa4a"
    // console.log("***********************",gnosis.length)
    // console.log("-----------------------",address.length)

  return (
    <>
      <Header />
      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>
          NREFT first-of-a-kind Non-Collateral NFT renting marketplace
        </h1>
        <p className={styles.explain}>
          Your NFT Marketplace to rent safely without collaterals along with
          auction or for direct sale.
        </p>
        <p>Please go through <Link href={guidelines}>guidelines</Link> before interacting :)</p>

        <hr className={styles.divider} />
        <p></p>
        <div style={{ marginTop: 32, marginBottom: 32 }}>
          {address && (
            <Link href="/create">
              <a
                className={styles.mainButton}
                style={{ textDecoration: "none" }}
              >
                List Collection
              </a>
            </Link>
          )}
        </div>

        <div className="main">
          {
            // If the listings are loading, show a loading message
            loadingListings ? (
              <div>Loading listings...</div>
            ) : (
              // Otherwise, show the listings
              <div className={styles.listingGrid}>

                {listings?.map((listing) => (
                  <div
                    key={listing.id}
                    className={styles.listingShortView}
                    onClick={() =>  router.push(`/listing/${listing.id}`)}
                  >
                    <MediaRenderer
                      src={listing.asset.image}
                      style={{
                        borderRadius: 16,
                        // Fit the image to the container
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <h2 className={styles.nameContainer}>
                      <Link href={`/listing/${listing.id}`}>
                        <a className={styles.name}>{listing.asset.name}</a>
                      </Link>
                    </h2>

                    <p>
                      <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Home;
