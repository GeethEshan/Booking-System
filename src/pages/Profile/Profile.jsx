import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import pic1 from './pic1.jpg';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; 
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, role } = location.state || {};
  console.log("Username:", username);

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
  });


  const baseUrl = role === 'admin' ? 'https://booking-441416.de.r.appspot.com/auth/admin' : 'https://booking-441416.de.r.appspot.com/auth/users';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/${username}`);
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          contactNumber: response.data.contactNumber,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username, baseUrl]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const { username: newUsername, email, contactNumber } = formData;
      const response = await axios.put(`${baseUrl}/${username}`, {
        newUsername,
        email,
        contactNumber
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`${baseUrl}/${username}`);

      
      localStorage.removeItem('authToken');

      
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <div className='profile-page'>
      <div className='section1'>
        <Navbar username={username} role={role}/>
      </div>
      <div className='section2'>
        <div className="profile-container">
          <div className="profile-header">
            <img src={pic1} className="pro-pic" alt="profile pic" />
          </div>

          <div className="profile-details">
            <div className='name-btn-box'>
              <h1>{user.username}</h1>
              {isEditing ? (
                <div>
                  <button className="action-button-save-button" onClick={handleSaveChanges}>
                    <FaSave /> Save
                  </button>
                  <button className="action-button-cancel-button" onClick={handleEditClick}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              ) : (
                <button className="edit-button-1" onClick={handleEditClick}>
                  <FaEdit /> Edit
                </button>
              )}
            </div>
            <div className="profile-section">
              <ul>
                <li>
                  Username:
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.username}</span>
                  )}
                </li>
                <li>
                  Email Address:
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </li>
                <li>
                  Contact Number:
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{user.contactNumber}</span>
                  )}
                </li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="action-button-delete-button" onClick={handleDeleteProfile}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
