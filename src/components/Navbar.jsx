import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

const Navbar = ({ username , role }) => {
    const navigate = useNavigate();


    const handleLogout = async (e) => {
        e.preventDefault(); 
        try {
            
            await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });

            
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/images/sltlogo.png" alt="Logo" />
            </div>
            <div className="navbar-links">
                <Link 
                    to="/profile"
                    state={{ username , role}}  
                >
                    Profile
                </Link>
                <Link to="/home" state={{username , role}} >Home</Link>
                <Link 
                    to="/history"
                    state={{ username, role }} 
                >
                    History
                </Link>
                <Link to="/" onClick={handleLogout}>
                    Logout
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
