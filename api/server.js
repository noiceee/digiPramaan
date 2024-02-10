require("dotenv").config();

const express = require("express");
const Users = require("./models/userSchema");
const Companies = require("./models/companySchema");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blockchain = require("./utils/connection");

const app = express();
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Making connection with blockchain network
blockchain.connectWeb3();

// LOGIN AND SIGNUP FACILITY FOR COMPANIES/ORGANISATIONS
app.post("/orgRegistration", (req, res) => {
  const { email, orgName, orgLogo, orgSignature, password } = req.body;

  let hashedPassword;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }

    const orgUser = new Companies({
      email,
      orgName,
      orgLogo,
      orgSignature,
      password: hash,
    });

    orgUser
      .save()
      .then((obj) => {
        console.log("Organisation Registered Successfully!");
        res.status(200).send(obj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
});

app.post("/orgLogin", (req, res) => {
  const { email, password } = req.body;

  Companies.findOne({ email })
    .then((obj) => {
      if (!obj) {
        console.log(err);
        res.status(500).send("Given Company is not registered");
      }
      bcrypt
        .compare(password, obj.password)
        .then((match) => {
          if (!match) {
            res.status(500).send("Incorrect Password");
          }

          const token = jwt.sign({ userId: obj._id }, "My_Secret_Key@2024", {
            expiresIn: "1h",
          });

          const resObj = {
            data: obj,
            token: token,
          };

          res.status(200).send(obj);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

// LOGIN AND SING UP FACILITY FOR NORMAL USERS
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  let hashedPassword;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }

    const user = new Users({ email, name, password: hash });
    user
      .save()
      .then((obj) => {
        console.log("User Successfully Registered : ");
        res.status(200).send(obj);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .then((resObj) => {
      if (!resObj) {
        res.status(500).send("User not Found");
      }
      bcrypt
        .compare(password, resObj.password)
        .then((match) => {
          if (!match) {
            res.status(500).send("Incorrect password");
          }

          const token = jwt.sign({ userId: resObj._id }, "My_Secret_Key@2024", {
            expiresIn: "1h",
          });

          const responseObject = {
            data: resObj,
            token: token,
          };

          res.status(200).send(responseObject);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

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
