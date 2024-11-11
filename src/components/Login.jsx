import React, { useState } from 'react';
import './Login.css';
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const role = location.state?.role || 'student';

    Axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginUrl = role === 'admin'
            ? "http://localhost:3001/auth/admin/login"
            : "http://localhost:3001/auth/login";

        Axios.post(loginUrl, {
            username: username,
            password: password,
        }).then(response => {
            if (response.data.status) {
                navigate('/home', { state: { username: username, role: role } });
            }
        }).catch(error => {
            console.log(error);
        });
    };

    const handleSignupClick = () => {
        navigate('/signup', { state: { role: role } });
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-logo">
                    <div className="logo">
                        <img src="/images/sltlogo.png" alt="Logo" />
                    </div>
                </div>
                <div className="form-container">
                    <h2 className="center-text"><b>Login</b></h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div>
                            <p>
                                <b>
                                    Don't have an account?    
                                    <button 
                                        type="button" 
                                        onClick={handleSignupClick} 
                                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                                    >
                                          Signup
                                    </button>
                                </b>
                            </p>
                        </div>
                        <button type="submit" className="create-account-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
