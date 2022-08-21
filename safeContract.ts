import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import Safe, { ContractNetworksConfig, SafeFactory } from "@gnosis.pm/safe-core-sdk";

async function safeDeploy(address: string) {
  const web3 = new Web3(Web3.givenProvider);
  const safeOwner = address;
  console.log(web3);
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: safeOwner,
  });
  const id = await ethAdapter.getChainId();
  const contractNetworks: ContractNetworksConfig = {
    [id]: {
      multiSendAddress: "0x95EeC5282a5429D6415aC1ace3457C75e1Ac03C7",
      safeMasterCopyAddress: "0x3E5c63644E683549055b9Be8653de26E0B4CD36E",
      safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    },
  };
  const safeFactory = await SafeFactory.create({
    ethAdapter,
    contractNetworks,
    isL1SafeMasterCopy: false,
  });
  const owners = ["0xBbefc461F6D944932EEea9C6d4c26C21e9cCeFB8", address];
  const threshold = 1;
  const safeAccountConfig = {
    owners,
    threshold,
  };

  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
  const safeAddress =  safeSdk.getAddress();
  return safeAddress;
}

//0xa624c7ca4327b6f0d7daa471efe69935d1e81cb4

export default safeDeploy;
