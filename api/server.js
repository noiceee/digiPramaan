require("dotenv").config();

const express = require("express");
const Users = require("./models/userSchema");
const Companies = require("./models/companySchema");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blockchain = require("./utils/connection");
const genCertificate = require("./index");
const crypto = require("crypto");
const s3 = require("./utils/connect_aws");
const verifyToken = require("./middlewares/verifyToken");
const uuidv4 = require("uuid").v4;
const AWS = require("aws-sdk");

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

          const token = jwt.sign({ userId: resObj._id }, process.env.JWT_KEY, {
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

app.post("/generateCertificate", verifyToken, async (req, res) => {
  const {
    eventName,
    dateOfIssuance,
    issuerName,
    issuerID,
    recieverName,
    recipientID,
    organizationID,
    organizationName,
    userEmail,
  } = req.body;

  // create certificate buffer
  const certificateBuffer = await genCertificate({
    eventName,
    dateOfIssuance,
    issuerName,
    issuerID,
    recieverName,
    recipientID,
    organizationID,
    organizationName,
  });

  const folderName = userEmail;
  const certificateFileName = uuidv4() + eventName + ".pdf";
  const key = `${folderName}/${certificateFileName}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: certificateBuffer,
    ContentType: "application/pdf",
    // ACL: "public-read",
  };

  const uploadResult = await s3.upload(uploadParams).promise();

  // Check if the upload was successful
  if (!uploadResult || !uploadResult.Location) {
    throw new Error("Failed to upload certificate to AWS S3");
  }

  console.log("Certificate uploaded to S3:", uploadResult.Location);

  const hash = crypto
    .createHash("sha256")
    .update(certificateBuffer)
    .digest("hex");

  console.log("Certificate Created successfully with hash : " + hash);

  // Storing data on blockchain network
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

app.get("/getCertificates/:userEmail", verifyToken, async (req, res) => {
  const { userEmail } = req.params;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${userEmail}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    const certificateKeys = data.Contents.map((obj) => obj.Key);
    const preSignedUrls = certificateKeys.map((key) => {
      const urlParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: 3600,
      };

      const url = s3.getSignedUrl("getObject", urlParams);
      return url;
    });

    console.log("Url links are : ", preSignedUrls);
    res.status(200).send(preSignedUrls);
  } catch (error) {
    console.error("Error retrieving certificates:", error);
    res.status(500).send("Error retrieving certificates");
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

module.exports = app;
