import React from 'react';

function Certificate({ backgroundImage, receiverName, eventName, organizationName, issuerName, issuerID, organizationID, recipientID, dateOfIssuance }) {
    console.log(receiverName)
    return (
    <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px' , backgroundImage: `url(${backgroundImage})`}}>
      <img className="issuer-logo" src="https://digipramaan.s3.ap-south-1.amazonaws.com/fed.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZI2LDQ6AW4VCVHGD%2F20240310%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240310T120728Z&X-Amz-Expires=900&X-Amz-Signature=02422eed590f7816bb15dc3267ced42acdf69b17acbf824148c865f8e4fe001c&X-Amz-SignedHeaders=host" alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
      <img className="digi-logo" src="images/logo.png" alt="Digi Logo" style={{ height: '250px', position: 'absolute', right: '-30px', top: '-80px' }} />
      <div className="content-wrapper">
        <h1 className="title" style={{ fontSize: '50px', marginBottom: '50px' }}>Certificate of Participation</h1>
        <p className="content" style={{ fontSize: '24px' }}>
          This is to certify that <strong><u>{receiverName}</u></strong> has successfully participated in the event: <em>{eventName}</em>
          <br />
          Organized by {organizationName}
        </p>
        <div className="certificate-info" style={{ textAlign: 'left', marginTop: '100px' }}>
          {/* <div className="issuer-info">Issued by: {issuerName} (Issuer ID: {issuerID})</div> */}
          <div className="organization-id">Organization ID: {organizationID}</div>
          <div className="recipient-id">Received by: {receiverName}</div>
          <div className="recipient-id">Recipient ID: {recipientID}</div>
          <div className="issuer-info">Date of Issuance: {dateOfIssuance}</div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
