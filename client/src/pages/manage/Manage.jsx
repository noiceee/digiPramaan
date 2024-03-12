import { Link } from "react-router-dom";
import "./manage.scss";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Manage({ user }) {
    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState(null);
    console.log(user);
    useEffect(() => {
        async function fetchCertificates() {
            try {
                const token = user.token; // Assuming you store the token in localStorage
                const response = await axios.get(`http://localhost:8080/getCertificates/${user.email}`, {
                    headers: {
                        "authorization": token
                    }
                });
                console.log(response.data);
                setCertificates(response.data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchCertificates();
    }, []);

    // const certificates = [
    //     {
    //         certificate_id: 1,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 2,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 3,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 4,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 5,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 6,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 7,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    //     {
    //         certificate_id: 8,
    //         title: "Certificate Name",
    //         issuedOn: "11-02-2004",
    //         issuerImg:
    //             "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
    //     },
    // ];

    return (
        <div className="manage page">
            <div className="back-button">
                <Link to={'/'}>
                    <span>{"<"}</span> Dashboard
                </Link>
            </div>

            <div className="card-container">
                {
                certificates.length ?
                certificates.map((certificate) => (
                    <div className="card">
                        <img className="thumbnail" src={certificate.orgLogo} alt="" />
                        <div className="caption">
                            <h4 className="title">{certificate.eventName}</h4>
                            <p className="date">{certificate.dateOfIssuance}</p>
                            <div className="row">
                                <a href={certificate.certLink}>
                                    <div className="share action">
                                        <img src="/images/share.png" alt="share" />
                                        <p>
                                            Share
                                        </p>
                                    </div>
                                </a>
                                <a href={certificate.certLink}>
                                    <div className="download action">
                                        <img src="/images/download.png" alt="download" />
                                        <p>
                                            Download
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            
            :

            <div className="card">
                {
                    error ? 
                    <>
                    {error}
                    </>
                    :
                    <>
                    No Certificates Found
                    </>
                }
            </div>
            }
            </div>
        </div>
    );
}
