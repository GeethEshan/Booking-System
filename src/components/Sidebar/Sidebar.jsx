import React from 'react';
import { Link } from 'react-router-dom'; 
import './Sidebar.css';
import logo from '../../assets/logo.png';

const Sidebar = ({ username }) => {
  return (
    <div className="sidebar">
      <div className="logo1">
        <img src={logo} alt="Booking App Logo" />
      </div>
      <div className="button-container2">
        <ul>
          <li><Link to="/profile" className="nav-button">Profile</Link></li>
          <li><Link to="/home" className="nav-button">Home</Link></li>
          <li>
            <Link 
              to="/bookingpage" 
              className="nav-button"
              state={{ username }}  
            >
              Bookings
            </Link>
          </li>
          <li><Link to="/history" className="nav-button">History</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
