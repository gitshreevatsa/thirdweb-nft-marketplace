import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useMarketplace,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";
import { useAddress } from "@thirdweb-dev/react";
import {
  collection,
  doc,
  query,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../db";

const Home = () => {
  const router = useRouter();
  const address = useAddress();
  const [safeFound, setSafeFound] = useState("");
  const [savedAddress, setSavedAddress] = useState("");

  // Connect your marketplace smart contract here (replace this address)
  const marketplace = useMarketplace(
    "0xF9079f7949A856eBd0b000223F0bdAb110196233" // Your marketplace contract address here
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);

  


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

        <hr className={styles.divider} />

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
                    onClick={() => router.push(`/listing/${listing.id}`)}
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
