require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const blockchain = require("./utils/connection");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Making connection with blockchain network
blockchain.connectWeb3();

app.post("/generateCertificate", (req, res) => {
  const {
    eventName,
    dateOfIssuance,
    issuerName,
    issuerID,
    recieverName,
    recipientID,
    organizationID,
    organizationName,
    hash,
  } = req.body;

  blockchain
    .generateCertificate(
      eventName,
      dateOfIssuance,
      issuerName,
      issuerID,
      recieverName,
      recipientID,
      organizationID,
      organizationName,
      hash
    )
    .then((obj) => {
      const { transactionHash, blockHash } = obj.receipt;
      console.log(transactionHash);
      console.log(blockHash);
      res.status(201).send({
        receipt: {
          transactionHash,
          blockHash,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/verifyCertificate/:hash", (req, res) => {
  const _hash = req.params;

  blockchain
    .verifyCertificate(_hash.hash)
    .then((obj) => {
      res.status(200).send(obj);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        err: `No data found for the given certificate hash : ${_hash.hash}`,
      });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

module.exports = app;
