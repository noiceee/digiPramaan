// SPDX-License-Identifier: MIT

pragma solidity >=0.4.16 <0.9.0;

contract Certifications {
    struct certDetails {
        string eventName;
        string dateOfIssuance;
        string receiverName;
        string certificateId;
        string organizationId;
        string organizationName;
    }

    mapping(string => certDetails) private hashes;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    function destroy() public {
        require(
            msg.sender == owner,
            "Only the contract owner can destroy the contract"
        );
        selfdestruct(payable(owner));
    }

    function appendCertificates(
        certDetails[] memory _certificates,
        string[] memory _hashes
    ) public {
        require(
            _certificates.length == _hashes.length,
            "Array lengths do not match"
        );

        for (uint256 i = 0; i < _certificates.length; i++) {
            hashes[_hashes[i]] = _certificates[i];
            require(
                bytes(hashes[_hashes[i]].eventName).length > 0,
                "Certificate creation unsuccessful"
            );
        }
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
