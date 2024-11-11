import React from "react";
import './Home.css';
import Navbar from "./Navbar";
import DayButtons from "./Day";
import { useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const { username , role } = location.state || {};
    return (
        <div className="home-page">
            <Navbar username={username} role={role}/>
            <div className="content">
                <div className="left-content">
                    
                   <div className="text"> <p> WELCOME TO THE SEAT BOOKING SYSTEM!</p> </div>
                    <DayButtons username={username} role={role}/>
                    
                    
                </div> 
            </div>
        </div>
    );
    }
export default Home;
