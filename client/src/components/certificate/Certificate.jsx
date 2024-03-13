import React from 'react';

function Certificate({ orgLogo, backgroundImage, receiverName, eventName, organizationName, issuerName, issuerID, organizationID, recipientID, dateOfIssuance, template }) {
  const renderCertificate = () => {
    console.log(orgLogo);
    switch (template) {
      case 'PARTICIPATION':
        return (
          <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px', backgroundImage: `url(${backgroundImage})` }}>
            <img className="issuer-logo" src={`${orgLogo}`} alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
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
      case 'WINNER':
        return (
          <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px', backgroundImage: `url(${backgroundImage})` }}>
            <img className="issuer-logo" src={`${orgLogo}`} alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
            <img className="digi-logo" src="images/logo.png" alt="Digi Logo" style={{ height: '250px', position: 'absolute', right: '-30px', top: '-80px' }} />
            <div className="content-wrapper">
              <h1 className="title" style={{ fontSize: '50px', marginBottom: '50px' }}>Certificate of Achievement</h1>
              <p className="content" style={{ fontSize: '24px' }}>
                This is to certify that <strong><u>{receiverName}</u></strong> has secured 1st rank in the event: <em>{eventName}</em>
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
      case 'RUNNERUP':
        return (
          <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px', backgroundImage: `url(${backgroundImage})` }}>
            <img className="issuer-logo" src={`${orgLogo}`} alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
            <img className="digi-logo" src="images/logo.png" alt="Digi Logo" style={{ height: '250px', position: 'absolute', right: '-30px', top: '-80px' }} />
            <div className="content-wrapper">
              <h1 className="title" style={{ fontSize: '50px', marginBottom: '50px' }}>Certificate of Achievement</h1>
              <p className="content" style={{ fontSize: '24px' }}>
                This is to certify that <strong><u>{receiverName}</u></strong> has successfully secured Runner Up position in the event: <em>{eventName}</em>
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
      default:
        return (
          <div className="certificate" style={{ backgroundColor: 'rgb(240, 197, 145)', padding: '100px', textAlign: 'center', position: 'relative', backgroundPosition: 'center', backgroundSize: 'cover', width: '900px', maxHeight: '500px', backgroundImage: `url(${backgroundImage})` }}>
            <img className="issuer-logo" src={`${orgLogo}`} alt="Issuer Logo" style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
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
        )
    }
  }
  return(
    <>
    {
      renderCertificate()
    }
    </>
  )
}

export default Certificate;
