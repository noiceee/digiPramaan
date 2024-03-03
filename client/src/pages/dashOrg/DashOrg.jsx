import { Link } from "react-router-dom";
import "./dashOrg.scss";

export default function DashOrg({ user }) {
    return (
        <div className="dash-org page">
            <div className="left">
                <h1 className="heading">
                    Welcome,<br></br> {user.orgName}!
                </h1>
                <div className="button-wrapper">
                    <Link to={"/verify"}>
                        <button className="cta">Verify Certificates</button>
                    </Link>
                    {/* <Link to={"/manage"}>
                        <button className="cta">Manage Certificates</button>
                    </Link> */}
                    <Link to={"/generate"}>
                        <button className="continue cta">Issue Certificates</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
