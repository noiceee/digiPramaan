const Certificates = require("../models/certificates");

const addCertificates = async (certDetails) => {
  const { eventName, orgLogo, certLink, dateOfIssuance, certificateId } =
    certDetails;

  try {
    const certDetails = new Certificates({
      eventName,
      orgLogo,
      certLink,
      dateOfIssuance,
      certificateId,
    });

    return certDetails
      .save()
      .then((obj) => {
        console.log("Certificate details uploaded successfully!");
        console.log(obj);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    console.log("[ERROR] Uploading certificate details was unsuccessful");
    throw err;
  }
};

module.exports = addCertificates;
