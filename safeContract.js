import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";

async function safeDeploy( address ) {

      const web3 = new Web3(Web3.givenProvider);
      const safeOwner = address;

      const ethAdapter = new Web3Adapter({
        web3,
        signerAddress: safeOwner,
      });
      const safeFactory = await SafeFactory.create({ ethAdapter });

      const owners = ["0xBbefc461F6D944932EEea9C6d4c26C21e9cCeFB8", address];
      const threshold = 2;

      const safeAccountConfig = {
        owners,
        threshold,
      };

      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
      console.log(safeSdk.getAddress());
      const safeAddress = safeSdk.getAddress();
      return safeAddress;
    }



export default safeDeploy;
