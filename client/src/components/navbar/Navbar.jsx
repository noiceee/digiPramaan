import { Link, Route, Routes } from "react-router-dom";
import './navbar.scss';
export default function Navbar({ user, setUser }) {
    const handleLogout = () => {
        setUser(false);
        localStorage.removeItem('user');
        window.location.href = "/";
    }
    return (
        <div className="navbar">
            <div className="logo">
                <Link to={'/'}>
                    <img src="/images/logo.png" alt="digiPramman" />
                </Link>
            </div>
            {user && <div className="links" onClick={handleLogout}>
                <span>Logout</span>
            </div>}
        </div>
    )
}