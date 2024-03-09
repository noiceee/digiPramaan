import React from 'react';

function Certificate({ backgroundImage, receiverName, eventName, organizationName, issuerName, issuerID, organizationID, recipientID, dateOfIssuance }) {
    console.log(receiverName)
    return (
    <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px' , backgroundImage: `url(${backgroundImage})`}}>
      <img className="issuer-logo" src="https://dpu.edu.in/img/logo.png" alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
      <img className="digi-logo" src="images/logo.png" alt="Digi Logo" style={{ height: '250px', position: 'absolute', right: '-30px', top: '-80px' }} />
      <div className="content-wrapper">
        <h1 className="title" style={{ fontSize: '50px', marginBottom: '50px' }}>Certificate of Participation</h1>
        <p className="content" style={{ fontSize: '24px' }}>
          This is to certify that <strong><u>{receiverName}</u></strong> has successfully participated in the event: <em>{eventName}</em>
          <br />
          Organized by {organizationName}
        </p>
        <div className="certificate-info" style={{ textAlign: 'left', marginTop: '100px' }}>
          <div className="issuer-info">Issued by: {issuerName} (Issuer ID: {issuerID})</div>
          <div className="organization-id">Organization ID: {organizationID}</div>
          <div className="recipient-id">Received by: {receiverName} (Recipient ID: {recipientID})</div>
          <div className="issuer-info">Date of Issuance: {dateOfIssuance}</div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
