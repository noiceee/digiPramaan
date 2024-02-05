var Certification = artifacts.require("Certifications");

module.exports = function (deployer) {
  deployer.deploy(Certification);
};
