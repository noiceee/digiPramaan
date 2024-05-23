import { Link } from 'react-router-dom';
import './dashInd.scss';

export default function DashInd({ user }) {
    return (
        <div className="dash-ind page">
            <div className="left">

                <h1 className='heading'>Welcome,<br></br> {user.name.split(" ")[0]}!</h1>
                <div className="button-wrapper">
                    <Link to={'/verify'}>
                        <button className="cta">Verify Certificates</button>
                    </Link>
                    <Link to={'/manage'}>
                        <button className="continue cta">
                            Manage Certificates
                        </button>
                    </Link>
                </div>
            </div>
            <img className="background-stripe" src="images/backdrop.png" alt="backrop" />
        </div>
    )
}