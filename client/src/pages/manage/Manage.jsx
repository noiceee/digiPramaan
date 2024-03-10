import { Link } from "react-router-dom";
import "./manage.scss";
import { useState } from "react";

export default function Manage({ user }) {
    const [isList, setIsList] = useState(true);

    const handleListClick = () => {
        setIsList(true);
    };

    const handleGridClick = () => {
        setIsList(false);
    };

    const certificates = [
        {
            certificate_id: 1,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 2,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 3,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 4,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 5,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 6,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 7,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
        {
            certificate_id: 8,
            title: "Certificate Name",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://th.bing.com/th/id/OIG1.d1cqjtk0eLaYnG5xM30r?w=1024&h=1024&rs=1&pid=ImgDetMain",
        },
    ];
    return (
        <div className="manage page">
                <div className="back-button">
            <Link to={'/'}>
                    <span>{"<"}</span> Dashboard
            </Link>
                </div>

            <div className="card-container">
                {certificates.map((certificate) => (
                    <div className="card">
                        <img className="thumbnail" src={certificate.issuerImg} alt="" />
                        <div className="caption">
                            <h4 className="title">{certificate.title}</h4>
                            <p className="date">{certificate.issuedOn}</p>
                            <div className="row">
                                <div className="share action">
                                    <img src="/images/share.png" alt="share" />
                                    <p>
                                        Share
                                    </p>
                                </div>
                                <div className="download action">
                                    <img src="/images/download.png" alt="download" />
                                    <p>
                                        Download
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
