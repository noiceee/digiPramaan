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
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 2,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 3,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 4,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 5,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 6,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 7,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
        },
        {
            certificate_id: 8,
            title: "Huehue",
            issuedOn: "11-02-2004",
            issuerImg:
                "https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg",
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
