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
const awsSdk = require("aws-sdk");
const multer = require("multer");
const addCertificates = require("./middlewares/appendCertDetails");
const { error } = require("console");
const mongoose = require("mongoose");
const Certificates = require("./models/certificates");

const app = express();
const saltRounds = 10;
const upload = multer();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Making connection with blockchain network
try {
  blockchain.connectWeb3();
} catch (error) {
  console.error("[ERROR] An error occurred while connecting to web3");
  res.status(500).send({ err: error.message });
}

// Error Handling Middleware
app.use(function (err, req, res, next) {
  console.error("[ERROR] An error occurred:", err.message);
  res.status(500).send("An error occurred on the server");
});

// Upload Image to AWS bucket
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  const image = req.file.buffer;

  // Generate a unique key for the uploaded file
  const key = "assets/" + uuidv4() + ".jpg"; // Example: "6c84fb90-12c4-11e1-840d-7b25c5ee775a.jpg"

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: image,
  };

  try {
    // Upload the image to AWS S3
    await s3.upload(params).promise();

    // Generate a signed URL for the uploaded image
    // const urlParams = {
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key: key,
    //   Expires: 0,
    // };

    // const signedURL = s3.getSignedUrl("getObject", urlParams);

    // res.status(200).json({ success: true, url: signedURL });
    const objectUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ success: true, url: objectUrl });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
});

// LOGIN AND SIGNUP FACILITY FOR COMPANIES/ORGANISATIONS
app.post("/orgRegistration", (req, res) => {
  const { email, orgName, orgLogo, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Internal Server Error");
    }

    const orgUser = new Companies({
      email,
      orgName,
      orgLogo,
      password: hashedPassword,
    });

    orgUser
      .save()
      .then((obj) => {
        console.log("Organisation Registered Successfully!");
        res.status(200).send(obj);
      })
      .catch((err) => {
        console.error("Error saving organisation:", err);
        res.status(400).send("Bad Request");
      });
  });
});

app.post("/orgLogin", (req, res) => {
  const { email, password } = req.body;

  Companies.findOne({ email })
    .then((obj) => {
      if (!obj) {
        return res.status(404).send("Company not found");
      }

      bcrypt
        .compare(password, obj.password)
        .then((match) => {
          if (!match) {
            return res.status(401).send("Incorrect password");
          }

          const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000;
          const token = jwt.sign(
            { userId: obj._id, exp: expirationTime },
            process.env.JWT_KEY
          );

          const responseObj = {
            data: obj,
            token: token,
          };

          res.status(200).send(responseObj);
        })
        .catch((err) => {
          console.error("Error comparing passwords:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.error("Error finding company:", err);
      res.status(500).send("Internal Server Error");
    });
});

// LOGIN AND SING UP FACILITY FOR NORMAL USERS
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Internal Server Error");
    }

    const user = new Users({ email, name, password: hashedPassword });
    user
      .save()
      .then((obj) => {
        console.log("User Successfully Registered:", obj);
        res.status(200).send(obj);
      })
      .catch((err) => {
        console.error("Error saving user:", err);
        res.status(400).send("Bad Request");
      });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            return res.status(401).send("Incorrect password");
          }

          const expirationTime = new Date().getTime() + 1 * 60 * 60 * 1000;
          const token = jwt.sign(
            { userId: user._id, exp: expirationTime },
            process.env.JWT_KEY
          );

          const responseObject = {
            data: user,
            token: token,
          };

          res.status(200).send(responseObject);
        })
        .catch((err) => {
          console.error("Error comparing passwords:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/generateCertificate", verifyToken, async (req, res) => {
  const { recipients, template, backgroundImage } = req.body;
  const token = req.headers["authorization"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.userId;

    if (!userId) {
      throw new Error("User ID is undefined or null");
    }

    const issuerData = await Companies.findOne({ _id: userId });
    if (!issuerData) {
      throw new Error("Issuer data not found");
    }

    const dateOfIssuance = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const { orgName, orgLogo } = issuerData;
    const organizationId = String(issuerData._id);

    const certificatesData = [];
    const hashes = [];

    for (const recipient of recipients) {
      const { eventName, receiverName, receiverEmail } = recipient;
      const certificateId = uuidv4();

      const certificateBuffer = await genCertificate({
        template,
        orgLogo,
        backgroundImage,
        eventName,
        dateOfIssuance,
        receiverName,
        certificateId,
        organizationId,
        organizationName: orgName,
      });

      const folderName = receiverEmail;
      const certificateFileName = certificateId + ".pdf";
      const key = `${folderName}/${certificateFileName}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: certificateBuffer,
        ContentType: "application/pdf",
      };

      const uploadCert = await s3.upload(uploadParams).promise();
      if (!uploadCert || !uploadCert.Location) {
        throw new Error("Failed to upload certificate to AWS S3");
      }

      const certLink = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;

      await addCertificates({
        receiverEmail,
        eventName,
        orgLogo,
        certLink,
        dateOfIssuance,
        certificateId,
      });

      const hash = crypto
        .createHash("sha256")
        .update(certificateBuffer)
        .digest("hex");

      certificatesData.push({
        eventName,
        dateOfIssuance,
        receiverName,
        certificateId,
        organizationId,
        organizationName: orgName,
      });

      hashes.push(hash);
    }

    const blockchainResponse = await blockchain.generateCertificates(
      certificatesData,
      hashes
    );

    const { transactionHash, blockHash } = blockchainResponse.receipt;
    console.log("Transaction Hash:", transactionHash);
    console.log("Block Hash:", blockHash);

    // Send response with transaction and block hashes
    res.status(201).send({
      receipt: {
        transactionHash,
        blockHash,
      },
    });
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
});

app.get("/verifyCertificate/:hash", async (req, res) => {
  const _hash = req.params.hash;

  try {
    const data = await blockchain.verifyCertificate(_hash);

    const formattedData = {
      eventName: data[0],
      dateOfIssuance: data[1],
      receiverName: data[2],
      certificateId: data[3],
      organizationId: data[4],
      organizationName: data[5],
    };

    res.status(200).json(formattedData);
  } catch (err) {
    res.status(400).json({
      error: `No data found for the given certificate hash : ${_hash}`,
    });
  }
});

app.get("/getCertificates/:certOwnerEmail", verifyToken, async (req, res) => {
  const { certOwnerEmail } = req.params;

  try {
    // User validation by checking through token
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.userId;

    if (!userId) {
      throw new Error("User ID is undefined or null");
    }

    const user = await Users.findOne({ _id: userId });

    if (!user) {
      throw new Error("[ERROR] Invalid User!");
    }

    if (user.email !== certOwnerEmail) {
      throw new Error(
        "[ERROR] You cannot access certificates of different users!"
      );
    }

    // Fetching all certificates issued to a user
    const certDetails = await Certificates.find({
      receiverEmail: certOwnerEmail,
    });

    console.log("[SUCCESS] Certificates retrieved successfully");
    res.status(200).json(certDetails);
  } catch (err) {
    console.error("Error retrieving certificates:", err);
    res.status(500).send(err.message);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

module.exports = app;
