const Certifications = artifacts.require("Certifications");

contract("Certifications", (accounts) => {
  let certificationsInstance;
  const owner = accounts[0]; // Use the first account as owner

  before(async () => {
    // Deploy the Certifications contract
    certificationsInstance = await Certifications.new({ from: owner });
  });

  after(async () => {
    // Clean up resources after testing
    if (certificationsInstance) {
      // Self-destruct the contract instance
      await certificationsInstance.destroy({ from: owner });
    }
  });

  it("should append certificates and verify certification details", async () => {
    // Prepare sample certificate data
    const cert1 = {
      eventName: "Event 1",
      dateOfIssuance: "2024-04-15",
      receiverName: "John Doe",
      certificateId: "12345",
      organizationId: "Org123",
      organizationName: "Organization A",
    };

    const cert2 = {
      eventName: "Event 2",
      dateOfIssuance: "2024-04-16",
      receiverName: "Jane Smith",
      certificateId: "67890",
      organizationId: "Org456",
      organizationName: "Organization B",
    };

    const hashes = ["hash1", "hash2"];
    const certificates = [cert1, cert2];

    // Append certificates to the contract
    await certificationsInstance.appendCertificates(certificates, hashes, {
      from: owner,
    });

    // Verify that certificates were added successfully and verify certification details
    const retrievedCert1 = await certificationsInstance.verifyCertification(
      "hash1"
    );
    assert.equal(
      retrievedCert1.eventName,
      cert1.eventName,
      "Event name does not match"
    );
    assert.equal(
      retrievedCert1.dateOfIssuance,
      cert1.dateOfIssuance,
      "Date of issuance does not match"
    );
    assert.equal(
      retrievedCert1.receiverName,
      cert1.receiverName,
      "Receiver name does not match"
    );
    assert.equal(
      retrievedCert1.certificateId,
      cert1.certificateId,
      "Certificate ID does not match"
    );
    assert.equal(
      retrievedCert1.organizationId,
      cert1.organizationId,
      "Organization ID does not match"
    );
    assert.equal(
      retrievedCert1.organizationName,
      cert1.organizationName,
      "Organization name does not match"
    );

    const retrievedCert2 = await certificationsInstance.verifyCertification(
      "hash2"
    );
    assert.equal(
      retrievedCert2.eventName,
      cert2.eventName,
      "Event name does not match"
    );
    assert.equal(
      retrievedCert2.dateOfIssuance,
      cert2.dateOfIssuance,
      "Date of issuance does not match"
    );
    assert.equal(
      retrievedCert2.receiverName,
      cert2.receiverName,
      "Receiver name does not match"
    );
    assert.equal(
      retrievedCert2.certificateId,
      cert2.certificateId,
      "Certificate ID does not match"
    );
    assert.equal(
      retrievedCert2.organizationId,
      cert2.organizationId,
      "Organization ID does not match"
    );
    assert.equal(
      retrievedCert2.organizationName,
      cert2.organizationName,
      "Organization name does not match"
    );
  });

  it("should verify certification details for a specific hash", async () => {
    // Prepare a sample certificate data
    const cert = {
      eventName: "Event 3",
      dateOfIssuance: "2024-04-17",
      receiverName: "Alice Johnson",
      certificateId: "54321",
      organizationId: "Org789",
      organizationName: "Organization C",
    };

    const hash = "hash3";

    // Append the certificate to the contract
    await certificationsInstance.appendCertificates([cert], [hash], {
      from: owner,
    });

    // Verify certification details using the verifyCertification function
    const retrievedCert = await certificationsInstance.verifyCertification(
      hash
    );
    assert.equal(
      retrievedCert.eventName,
      cert.eventName,
      "Event name does not match"
    );
    assert.equal(
      retrievedCert.dateOfIssuance,
      cert.dateOfIssuance,
      "Date of issuance does not match"
    );
    assert.equal(
      retrievedCert.receiverName,
      cert.receiverName,
      "Receiver name does not match"
    );
    assert.equal(
      retrievedCert.certificateId,
      cert.certificateId,
      "Certificate ID does not match"
    );
    assert.equal(
      retrievedCert.organizationId,
      cert.organizationId,
      "Organization ID does not match"
    );
    assert.equal(
      retrievedCert.organizationName,
      cert.organizationName,
      "Organization name does not match"
    );
  });
});
