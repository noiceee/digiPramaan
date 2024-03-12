import { useState, useRef, useEffect } from "react";
import "./verify.scss";
import sha256 from 'js-sha256';


import axios from "axios";
export default function Verify() {
  const [hashAsInput, setInput] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("VERIFY");
  const [certificateData, setCertificateData] = useState();
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const inputRef = useRef(null);
  const uploadRef = useRef(null);
  const headingRef = useRef(null);

  const calculateSHA256 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        const hash = sha256(fileContent);
        resolve(hash);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
      try {
        const fileHash = await calculateSHA256(selectedFile);
        console.log(fileHash);
        setFile(selectedFile);
        setInput(true);
        setHash(fileHash);
      } catch (error) {
        console.error('Error calculating hash:', error);
      }
    }
  };
  
  useEffect(() => {
    if (hashAsInput) {
      // Access the current property of the ref to get the input element
      const inputElement = inputRef.current; // Check if the input element exists before focusing
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [hashAsInput]);
  
  useEffect(() => {
    if (hashAsInput) {
      // Access the current property of the ref to get the input element
      const inputElement = inputRef.current; // Check if the input element exists before focusing
      if (inputElement) {
        inputElement.focus();
        inputElement.value = hash;
      }
    }
  }, [hash]);

  function initiateVerification() {
    //Make call
    setVerificationStatus("VERIFYING");
    const verify = async () => {
      try {
          const response = await axios.get(`http://localhost:8080/verifyCertificate/${inputRef.current.value}`);
          if(response){
            setVerificationStatus("VALID");
            setCertificateData(response.data);
          };
      } catch (error) {
        setVerificationStatus("INVALID");
          console.error('Error fetching data:', error);
      }
  };
  verify();
  }
  useEffect(() => {
    if (verificationStatus == "VERIFYING") {
      headingRef.current.innerHTML = "Verifying . . .";
    } else if (verificationStatus == "VALID") {
      headingRef.current.innerHTML = "Valid.";
    } else if (verificationStatus == "INVALID") {
      headingRef.current.innerHTML = "Invalid.";
    }
  }, [verificationStatus]);

  const onUploadClick = () => {
    // Trigger the file input click event
    uploadRef.current.click();
  };

  return (
    <div className="verify page">
      <div className="heading">
        <span ref={headingRef}>Verify.</span>
      </div>
      {verificationStatus == "VERIFY" ? (
        <div className="button-wrapper">
           <input type="file" onChange={handleFileChange} ref={uploadRef} style={{visibility: "hidden"}} />
          <button className="cta" onClick={onUploadClick}>Upload PDF</button>
          {hashAsInput ? (
            <input ref={inputRef} type="text" className="cta input" />
          ) : (
            <button
              className="cta"
              onClick={() => {
                setInput((prev) => !prev);
              }}
            >
              Enter Hash
            </button>
          )}
          <button className="continue cta" onClick={initiateVerification}>
            Continue {">>>"}
          </button>
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "VERIFYING" ? (
        <div className="verifying-image">
          <img src="images/verifying.webp" alt="" />
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "VALID" ? (
        <div className="content-wrapper">
          <div className="tick-container">
            <img className="result-img" src="images/valid.gif" alt="" />
          </div>
          <div className="document-info">
            <span>Event Name : {certificateData.eventName}</span>
            <span>Reciever Name : {certificateData.recieverName}</span>
            <span>Issuer Name : {certificateData.organizationName}</span>
            <span>Date of Issuance : {certificateData.dateOfIssuance}</span>
            <span>Certificate ID : {certificateData.certificateId}</span>
            <span>Organization ID : {certificateData.organizationId}</span>
          </div>
          <div className="button-wrapper">
            {/* <button className="cta">Download</button> */}
            <button className="cta">Bulk Verify</button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "INVALID" ? (
        <div className="content-wrapper">
          <div className="cross-container">
            <img className="result-img" src="images/invalid.gif" alt="" />
          </div>
          <div className="button-wrapper">
            <button className="cta" onClick={()=>{
              window.location.href = "/verify"
            }}>Verify Again</button>
            <button className="cta">Bulk Verify</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
