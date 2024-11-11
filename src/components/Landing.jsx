import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/login", { state: { role: "admin" } });
  };

  const handleStudentClick = () => {
    navigate("/login", { state: { role: "student" } });
  };

  return (
    <div className="Landing">
      <div>
        <div className="container">
          <div className="text">
            <p>WELCOME!</p>
          </div>
          <div className="button-container">
            <button className="btn" onClick={handleAdminClick}>
              Admin
            </button>
            <button className="btn" onClick={handleStudentClick}>
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
