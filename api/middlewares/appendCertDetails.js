const Certificates = require("../models/certificates");

const addCertificates = async (certDetails) => {
  const {
    receiverEmail,
    eventName,
    orgLogo,
    certLink,
    dateOfIssuance,
    certificateId,
  } = certDetails;

  try {
    const certInstance = new Certificates({
      receiverEmail,
      eventName,
      orgLogo,
      certLink,
      dateOfIssuance,
      certificateId,
    });

    const savedCert = await certInstance.save();
    console.log("[SUCCESS] Certificate details uploaded successfully!");
    console.log(savedCert);
    return savedCert;
  } catch (err) {
    console.error(
      "[ERROR] Uploading certificate details was unsuccessful:",
      err
    );
    throw err; // Propagate the error to the calling function
  }
};

module.exports = addCertificates;
