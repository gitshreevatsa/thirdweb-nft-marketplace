import React from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider, useGnosis } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Rinkeby;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>NREFT Non Collateral NFT Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="keywords"
          content="NREFT, Marketplace, NFT Marketplace, NFT Auction , How To Make OpenSea, NFT Renting, RENT NFTs, Non COllateral NFT Renting"
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
