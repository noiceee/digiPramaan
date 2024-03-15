import Certificate from "../../components/certificate/Certificate";
import IsIndividualToggle from "../../components/isIndividualToggle/IsIndividualToggle";
import ProgressBar from "../../components/progressBar/ProgressBar";
import "./generate.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import Papa from 'papaparse'; // Import PapaParse for CSV parsing

export default function Generate({ user }) {
    const [step, setStep] = useState(1);
    const [isIndividual, setIsIndividual] = useState(true);
    const [isWinner, setIsWinner] = useState(true);
    const [formData, setFormData] = useState({
        receiverName: "",
        receiverEmail: "",
        eventName: "",
        dateOfIssuance: "",
        backgroundImage: "",
        template: ""
    });
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [published, setPublished] = useState(false);
    const [csvData, setCsvData] = useState([]);

    const handleFileChange = (e) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        setFormData((prevData) => ({
            ...prevData,
            dateOfIssuance: formattedDate
        }));
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    // Assuming the CSV file has headers: Receiver Name, Receiver Email, Event Name
                    const data = result.data; // Remove the header row
                    console.log(data);
                    setCsvData(data);
                },
                header: true // Indicates that the first row contains headers
            });
        }
    };


    const handleUpload = async (file) => {

        // if (!validFileTypes.find(type => type === file.type)) {
        //     //   setError('File must be in JPG/PNG format');
        //     return;
        // }

        const form = new FormData();
        form.append('image', file);

        try {
            const response = await axios.post('http://localhost:8080/uploadImage', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.url instanceof Promise) {
                const url = await response.data.url;
                console.log("lmaoooooo");
                console.log('Image uploaded:', url); // This should log the final URL
                return url;
            } else {
                console.log('Image uploaded:', response.data.url); // This should log the final URL
                return response.data.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle errors
        }

    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setBackgroundImage(reader.result);
            // const { name, value } = e.target;
            // setFormData(prevData => ({
            //     ...prevData,
            //     [name]: value
            // }));
            handleUpload(file).then(url => {
                setFormData(prev => ({
                    ...prev,
                    backgroundImage: url
                }))
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        let template;
        if (isIndividual) {
            if (isWinner) {
                template = 'WINNER';
            } else {
                template = 'RUNNERUP';
            }
        } else {
            template = 'PARTICIPATION';
        }
        setFormData((prevData) => ({
            ...prevData,
            template,
        }));
    }, [isWinner, isIndividual]);

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            backgroundImage,
        }));
        certificateData.backgroundImage = backgroundImage;
        console.table(certificateData);
    }, [backgroundImage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            dateOfIssuance: formattedDate
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setStep((prevStep) => prevStep + 1);
        console.log(certificateData);
    };

    const handleBack = (e) => {
        console.log("Form submitted:", formData);
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log("Form submitted:", formData);
            console.log("CSV submitted:", csvData);
            const toSend = isIndividual ? {
                'recipients' : [formData],
                'template' : formData.template,
                'backgroundImage' : formData.backgroundImage
            } : {
                'recipients' : [...csvData],
                'template' : formData.template,
                'backgroundImage' : formData.backgroundImage
            }
            console.log(toSend);
            setPublished("SENT");
            const token = user.token; // Assuming you store the token in localStorage
            const response = await axios.post(
                "http://localhost:8080/generateCertificate", toSend,
                {
                    headers: {
                        "Authorization": token
                    }
                }
            );
            setPublished("SUCCESS");
        } catch (error) {
            console.log(error.message);
            //   setPublished(error.message);
        }
    };

    const setDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${day}-${month}-${year}`;
        setFormData((prevData) => ({
            ...prevData,
            dateOfIssuance: formattedDate
        }));
    }


    const steps = ["Get Started", "Certificate Data", "User Data", "Publish"];
    const certificateData = {
        backgroundImage: backgroundImage,
        receiverName: "John Doe",
        eventName: "Event Name",
        organizationName: JSON.parse(localStorage.getItem('user')).orgName,
        issuerName: "Issuer Name",
        issuerID: "Issuer ID",
        organizationID: JSON.parse(localStorage.getItem('user'))._id,
        recipientID: "Recipient ID",
        template: formData.template,
        orgLogo: JSON.parse(localStorage.getItem('user')).orgLogo
    };

    const renderStepIndividual = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step step-1">
                        <div className="togglecontainer">
                            <IsIndividualToggle
                                first={"Single"}
                                second={"Bulk"}
                                isIndividual={isIndividual}
                                setIsIndividual={setIsIndividual}
                            />
                        </div>
                        <button className="cta" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="step step-2">
                        <div className="togglecontainer">
                            <IsIndividualToggle
                                first={"Winner"}
                                second={"Runner-up"}
                                isIndividual={isWinner}
                                setIsIndividual={setIsWinner}
                            />
                        </div>
                        <div className="input-wrapper">
                            <h4>Upload background image (Optional)</h4>
                            {/* <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                            <div className="image-input">
                                <input
                                    type="file"
                                    name="backgroundImage"
                                    id="backgroundImage"
                                    accept="image/"
                                    onChange={handleImageChange}
                                />
                                {backgroundImage && (
                                    <div>
                                        <img
                                            src={backgroundImage}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className="cta" onClick={handleBack}>
                                Back
                            </button>
                            <button className="cta" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step step-2">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="receiverName"
                                value={formData.receiverName}
                                onChange={handleChange}
                                placeholder="receiver Name"
                                required
                            />
                            <input
                                type="email"
                                name="receiverEmail"
                                value={formData.receiverEmail}
                                onChange={handleChange}
                                placeholder="receiver Email"
                                required
                            />
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                placeholder="Event Name"
                                required
                            />
                        </div>
                        <div className="button-wrapper">
                            <button className="cta" onClick={handleBack}>
                                Back
                            </button>
                            <button className="cta" onClick={(e) => {
                                setDate();
                                handleNext(e);
                            }}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step">
                        {
                            published ?
                                <>
                                    {
                                        published === "SUCCESS" ?
                                            <>
                                                <img src="images/tick.gif" alt="done" />
                                                <h2 className="published">
                                                    Certificate Published Successfully!
                                                </h2>
                                                <div className="button-wrapper">
                                                    <button className="cta" onClick={() => window.location.href = '/generate'}>
                                                        Publish More
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <img src="images/verifying.webp" alt="done" />
                                                <h2 className="published">
                                                    Publishing...
                                                </h2>
                                            </>
                                    }
                                </>
                                :
                                <>
                                    <h3 className="preview-heading">Certificate Preview : </h3>
                                    <div className="preview">
                                        <Certificate
                                            orgLogo={certificateData.orgLogo}
                                            backgroundImage={formData.backgroundImage}
                                            receiverName={formData.receiverName}
                                            eventName={formData.eventName}
                                            organizationName={certificateData.organizationName}
                                            issuerName={certificateData.issuerName}
                                            issuerID={certificateData.issuerID}
                                            organizationID={certificateData.organizationID}
                                            recipientID={certificateData.recipientID}
                                            dateOfIssuance={formData.dateOfIssuance}
                                            template={formData.template}
                                        />
                                    </div>
                                    <div className="button-wrapper">
                                        <button className="cta" onClick={handleBack}>
                                            Back
                                        </button>
                                        <button className="cta" onClick={handleSubmit}>
                                            Publish
                                        </button>
                                    </div>
                                </>
                        }
                    </div>
                );
            default:
                return null;
        }
    };
    const renderStepBulk = () => {
        switch (step) {
            case 1:
                return (
                    <div className="step step-1">
                        <div className="togglecontainer">
                            <IsIndividualToggle
                                first={"Single"}
                                second={"Bulk"}
                                isIndividual={isIndividual}
                                setIsIndividual={setIsIndividual}
                            />
                        </div>
                        <button className="cta" onClick={handleNext}>
                            Next
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="step step-2">
                        <div className="togglecontainer">
                            <div className="tab-wrapper">
                                <span className="active">Participation</span>
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <h4>Upload background image (Optional)</h4>
                            {/* <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                            <div className="image-input">
                                <input
                                    type="file"
                                    name="backgroundImage"
                                    id="backgroundImage"
                                    accept="image/"
                                    onChange={handleImageChange}
                                />
                                {backgroundImage && (
                                    <div>
                                        <img
                                            src={backgroundImage}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className="cta" onClick={handleBack}>
                                Back
                            </button>
                            <button className="cta" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step step-3">
                        {/* <div className="togglecontainer">
                            <div className="tab-wrapper">
                                <span className= "active">Participation</span>
                            </div>
                        </div> */}
                        <div className="input-wrapper">
                            <h4>Upload CSV containing folowing data: <br /></h4>
                            <ul>
                                <li>receiverName</li>
                                <li>receiverEmail</li>
                                <li>eventName</li>
                            </ul>
                            {/* <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input style={{ '-moz-appearance': 'textfield', 'appearance': 'textField' }} type="number" placeholder='Phone number' value={formData.phone} name='phone' onChange={handleChange} /> */}
                            <div className="image-input">
                                <input
                                    type="file"
                                    name="csvFile"
                                    id="csvFile"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                {/* {backgroundImage && (
                                    <div>
                                        <img
                                            src={backgroundImage}
                                            alt="Uploaded"
                                            style={{ maxWidth: "100px" }}
                                        />
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button className="cta" onClick={handleBack}>
                                Back
                            </button>
                            <button className="cta" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="step">
                        {
                            published ?
                                <>
                                    {
                                        published === "SUCCESS" ?
                                            <>
                                                <img src="images/tick.gif" alt="done" />
                                                <h2 className="published">
                                                    Certificate Published Successfully!
                                                </h2>
                                                <div className="button-wrapper">
                                                    <button className="cta" onClick={() => window.location.href = '/generate'}>
                                                        Publish More
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <img src="images/verifying.webp" alt="done" />
                                                <h2 className="published">
                                                    Publishing...
                                                </h2>
                                            </>
                                    }
                                </>
                                :
                                <>
                                    <h3 className="preview-heading">Certificate Preview : </h3>
                                    <div className="preview">
                                        <Certificate
                                            orgLogo={certificateData.orgLogo}
                                            backgroundImage={formData.backgroundImage}
                                            receiverName={csvData[0].receiverName}
                                            eventName={csvData[0].eventName}
                                            organizationName={certificateData.organizationName}
                                            issuerName={certificateData.issuerName}
                                            issuerID={certificateData.issuerID}
                                            organizationID={certificateData.organizationID}
                                            recipientID={certificateData.recipientID}
                                            dateOfIssuance={formData.dateOfIssuance}
                                            template={formData.template}
                                        />
                                    </div>
                                    <div className="button-wrapper">
                                        <button className="cta" onClick={handleBack}>
                                            Back
                                        </button>
                                        <button className="cta" onClick={handleSubmit}>
                                            Publish
                                        </button>
                                    </div>
                                </>
                        }
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div className="generate page">
            <h1 className="heading">Generate Certificates.</h1>
            {/* <ProgressBar className='progress-bar' steps={steps} currentStep={step} stepWidth={'100px'} lineWidth={'138px'} /> */}
            <ProgressBar
                className="progress-bar"
                steps={steps}
                currentStep={step}
                stepWidth={"140px"}
                lineWidth={"200px"}
            />
            {isIndividual ? <>{renderStepIndividual()}</> : <>{renderStepBulk()}</>}
        </div>
    );
}
