const Web3 = require("web3");
const contract = require("truffle-contract");
const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();

const certificationArtifact = require("../build/contracts/Certifications.json");
const certificationInstance = contract(certificationArtifact);

const getAccounts = async function () {
  const self = this;

  try {
    const accounts = await self.web3.eth.getAccounts();
    return accounts;
  } catch (error) {
    console.error("Error fetching accounts: ", error);
    throw error;
  }
};

const connectWeb3 = function () {
  const self = this;

  try {
    if (process.env.NODE_ENV === "development") {
      self.web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.LOCAL_ENDPOINT)
      );
    } else {
      self.web3 = new Web3(
        new HDWalletProvider(process.env.MNEMONIC, process.env.PROJECT_ENDPOINT)
      );
    }

    certificationInstance.setProvider(self.web3.currentProvider);

    if (typeof certificationInstance.currentProvider.sendAsync !== "function") {
      certificationInstance.currentProvider.sendAsync = function () {
        return certificationInstance.currentProvider.send.apply(
          certificationInstance.currentProvider,
          arguments
        );
      };
    }

    process.env.NODE_ENV === "development"
      ? console.log("Current host: " + self.web3.currentProvider.host)
      : console.log(
          "Current host: " +
            self.web3.currentProvider.engine._providers[3].provider.host
        );
  } catch (error) {
    console.error("Error connecting to Web3:", error);
    throw error;
  }
};

const verifyCertificate = async function (_hash) {
  const self = this;

  try {
    certificationInstance.setProvider(self.web3.currentProvider);

    const instance = await certificationInstance.deployed();
    const result = await instance.verifyCertification.call(_hash);

    return result;
  } catch (error) {
    console.error("Error verifying certificate:", error);
    throw error;
  }
};

const generateCertificate = async function (
  eventName,
  dateOfIssuance,
  recieverName,
  recipientID,
  organizationID,
  organizationName,
  hash
) {
  const self = this;

  try {
    certificationInstance.setProvider(self.web3.currentProvider);

    const accounts = await self.getAccounts();
    const accountAddress = accounts[0];

    const instance = await certificationInstance.deployed();
    const gasEstimate = await instance.appendCertificate.estimateGas(
      eventName,
      dateOfIssuance,
      recieverName,
      recipientID,
      organizationID,
      organizationName,
      hash,
      { from: accountAddress.toLowerCase() }
    );

    console.log("Gas Estimate: ", gasEstimate);

    // Adjust the gas limit based on the estimation
    const gasLimit = gasEstimate * 2;
    console.log("Gas Limit: ", gasLimit);

    // Now execute the transaction with the adjusted gas limit
    const receipt = await instance.appendCertificate(
      eventName,
      dateOfIssuance,
      recieverName,
      recipientID,
      organizationID,
      organizationName,
      hash,
      { from: accountAddress.toLowerCase(), gas: gasLimit }
    );

    console.log("Certificate generated successfully!");

    return receipt;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

module.exports = {
  connectWeb3,
  getAccounts,
  generateCertificate,
  verifyCertificate,
};
