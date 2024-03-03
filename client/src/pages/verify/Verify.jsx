import { useState, useRef, useEffect } from "react";
import "./verify.scss";
import axios from "axios";
export default function Verify() {
  const [hashAsInput, setInput] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("VERIFY");
  const inputRef = useRef(null);
  const headingRef = useRef(null);
  let isCertificateValid = true;
  useEffect(() => {
    if (hashAsInput) {
      // Access the current property of the ref to get the input element
      const inputElement = inputRef.current; // Check if the input element exists before focusing
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [hashAsInput]);

  function initiateVerification() {
    //Make call
    setVerificationStatus("VERIFYING");
    const verify = async () => {
      try {
          const response = await axios.get(`http://localhost:8080/verifyCertificate/${inputRef.current.value}`);
          if(response)setVerificationStatus("VALID");
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
  return (
    <div className="verify page">
      <div className="heading">
        <span ref={headingRef}>Verify.</span>
      </div>
      {verificationStatus == "VERIFY" ? (
        <div className="button-wrapper">
          <button className="cta">Upload PDF</button>
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
          <div class="tick-container">
            <img className="result-img" src="images/valid.gif" alt="" />
          </div>
          <div className="document-info">
            <span>Certificate ID : {'NA'}</span>
            <span>Issuer ID : {'NA'}</span>
            <span>Date of Issuance : {'NA'}</span>
            <span>CValid Till : {'NA'}</span>
          </div>
          <div className="button-wrapper">
            <button className="cta">Download</button>
            <button className="cta">Bulk Verify</button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {verificationStatus == "INVALID" ? (
        <div className="content-wrapper">
          <div class="cross-container">
            <img className="result-img" src="images/invalid.gif" alt="" />
          </div>
          <div className="button-wrapper">
            <button className="cta">Verify Again</button>
            <button className="cta">Bulk Verify</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
