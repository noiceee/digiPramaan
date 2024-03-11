// SPDX-License-Identifier: MIT

pragma solidity >=0.4.16 <0.9.0;

contract Certifications {
    struct certDetails {
        string eventName;
        string dateOfIssuance;
        string recieverName;
        string recipientID;
        string organizationID;
        string organizationName;
    }

    mapping(string => certDetails) private hashes;

    function appendCertificate(
        string memory _eventName,
        string memory _dateOfIssuance,
        string memory _recieverName,
        string memory _recipientID,
        string memory _organizationID,
        string memory _organizationName,
        string memory _hash
    ) public{
        // Adding given certificate data to the blockchain
        hashes[_hash] = certDetails(
            _eventName,
            _dateOfIssuance,
            _recieverName,
            _recipientID,
            _organizationID,
            _organizationName
        );

        require(bytes(hashes[_hash].eventName).length > 0, "Certificate creation unsuccessful");
    }

    function verifyCertification(
        string memory _hash
    ) public view returns (certDetails memory) {
        require(bytes(_hash).length > 0, "Hash value cannot be empty");

        require(
            bytes(hashes[_hash].eventName).length > 0,
            "Certificate not found for the given hash"
        );

        return hashes[_hash];
    }
}
