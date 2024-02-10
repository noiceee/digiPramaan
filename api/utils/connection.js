const Web3 = require("web3");
const contract = require("truffle-contract");
const HDWalletProvider = require("truffle-hdwallet-provider");
require("dotenv").config();

const certificationArtifact = require("../build/contracts/Certifications.json");
const certificationInstance = contract(certificationArtifact);

const getAccounts = function () {
  const self = this;

  return self.web3.eth.getAccounts();
};

const connectWeb3 = function () {
  const self = this;

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
};

const verifyCertificate = function (_hash) {
  const self = this;
  certificationInstance.setProvider(self.web3.currentProvider);

  return certificationInstance
    .deployed()
    .then((instance) => {
      return instance.verifyCertification.call(_hash);
    })
    .catch((err) => {
      console.log(err);
      Promise.reject(
        "No certificate found with the given hash value : " + _hash
      );
    });
};

const generateCertificate = function (
  eventName,
  dateOfIssuance,
  issuerName,
  issuerID,
  recieverName,
  recipientID,
  organizationID,
  organizationName,
  hash
) {
  const self = this;

  certificationInstance.setProvider(self.web3.currentProvider);

  return self.getAccounts().then((accounts) => {
    let accountAddress = accounts[0];

    return certificationInstance
      .deployed()
      .then((instance) => {
        // Estimate gas for the transaction
        return instance.appendCertificate.estimateGas(
          eventName,
          dateOfIssuance,
          issuerName,
          issuerID,
          recieverName,
          recipientID,
          organizationID,
          organizationName,
          hash,
          { from: accountAddress.toLowerCase() }
        );
      })
      .then((gasEstimate) => {
        console.log("Gas Estimate:", gasEstimate);

        // Adjust the gas limit based on the estimation
        const gasLimit = gasEstimate * 2;

        // Now execute the transaction with the adjusted gas limit
        return certificationInstance.deployed().then((instance) => {
          return instance.appendCertificate(
            eventName,
            dateOfIssuance,
            issuerName,
            issuerID,
            recieverName,
            recipientID,
            organizationID,
            organizationName,
            hash,
            { from: accountAddress.toLowerCase(), gas: gasLimit }
          );
        });
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(err.toString());
      });
  });
};

module.exports = {
  connectWeb3,
  getAccounts,
  generateCertificate,
  verifyCertificate,
};