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
const multer = require("multer");
const addCertificates = require("./middlewares/appendCertDetails");
const { error } = require("console");

const app = express();
const saltRounds = 10;
const upload = multer();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Making connection with blockchain network
blockchain.connectWeb3();

// Upload Image to AWS bucket
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const image = req.file.buffer;
  const key = "fed.jpg";
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: image,
  };
  console.log(params);

  try {
    await s3.upload(params).promise();

    const urlParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: 0,
    };

    const signedURL = s3.getSignedUrl("getObject", urlParams);

    res.send({ success: true, url: signedURL });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
});

// LOGIN AND SIGNUP FACILITY FOR COMPANIES/ORGANISATIONS
app.post("/orgRegistration", (req, res) => {
  const { email, isIndividual, orgName, orgLogo, orgSignature, password } =
    req.body;

  let hashedPassword;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }

    const orgUser = new Companies({
      email,
      isIndividual,
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
        res.status(500).send("Given Company is not registered");
      }
      bcrypt
        .compare(password, obj.password)
        .then((match) => {
          if (!match) {
            res.status(500).send("Incorrect Password");
          }

          const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000;
          const Token = jwt.sign(
            { userId: obj._id, exp: expirationTime },
            process.env.JWT_KEY
          );

          const resObj = {
            data: obj,
            token: Token,
          };

          res.status(200).send(resObj);
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

          const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000;
          const token = jwt.sign(
            { userId: resObj._id, exp: expirationTime },
            process.env.JWT_KEY
          );

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
  const { eventName, recieverName, recieverEmail, template } = req.body;

  const token = req.headers["authorization"];

  // fetching issuer data from the database
  let issuerData;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.userId;

    if (!userId) {
      throw new Error("User ID is undefined or null");
    }
    issuerData = await Companies.findOne({ _id: userId })
      .then((obj) => {
        if (obj) {
          return obj;
        } else {
          throw err;
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Not a registered Organization user!");
  }

  // Creating the required variable for creation of certificates
  const dateOfIssuance = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const organizationName = issuerData.orgName;
  const organizationId = String(issuerData._id);
  const certificateId = uuidv4();
  const orgLogo = issuerData.orgLogo;
  const orgSignature = issuerData.orgSignature;

  // create certificate buffer
  const certificateBuffer = await genCertificate({
    template,
    orgLogo,
    eventName,
    dateOfIssuance,
    recieverName,
    certificateId,
    organizationId,
    organizationName,
  });

  const folderName = recieverEmail;
  const certificateFileName = certificateId + ".pdf";
  const key = `${folderName}/${certificateFileName}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: certificateBuffer,
    ContentType: "application/pdf",
  };

  try {
    const uploadCert = await s3.upload(uploadParams).promise();

    if (!uploadCert || !uploadCert.Location) {
      throw new Error();
    }
  } catch (err) {
    console.log("Failed to upload certificate to AWS S3");
    res.status(500).send(err);
  }
  const urlParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: 0,
  };

  const certLink = s3.getSignedUrl("getObject", urlParams);
  console.log("Certificate uploaded to S3:", certLink);

  try {
    await addCertificates({
      eventName,
      orgLogo,
      certLink,
      dateOfIssuance,
      certificateId,
    });
  } catch (err) {
    res.status(500).send(err);
    throw err;
  }

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
      recieverName,
      certificateId,
      organizationId,
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

// Error handeling done
app.get("/verifyCertificate/:hash", async (req, res) => {
  const _hash = req.params.hash; // Access the hash from params

  try {
    const obj = await blockchain.verifyCertificate(_hash);
    console.log(obj);
    res.status(200).send(obj);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: `No data found for the given certificate hash : ${_hash}`,
    });
  }
});

app.get("/getCertificates/:recieverEmail", verifyToken, async (req, res) => {
  const { recieverEmail } = req.params;

  // User validation by checking through token

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${recieverEmail}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    const certificateKeys = data.Contents.map((obj) => obj.Key);
    const preSignedUrls = certificateKeys.map((key) => {
      const urlParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: 0,
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
