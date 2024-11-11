import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import './Day.css';
import 'react-calendar/dist/Calendar.css'; 

const Day = ({ username, role }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const navigate = useNavigate();

    const handleReserveNow = () => {
        setShowPopup(true); 
    };

    const handleDateChange = (date) => {
        setSelectedDate(date); 
    };

    const handleConfirm = () => {
        navigate("/bookingpage", { state: { username, role, selectedDate } });
        setShowPopup(false); 
    };

    const handleClosePopup = () => {
        setShowPopup(false); 
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape" && showPopup) {
            handleClosePopup();
        }
    };

    // Attach the keydown listener to the window
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showPopup]);

    return (
        <div className="day-buttons">
            <button 
                onClick={handleReserveNow} 
                aria-label="Reserve now button"
            >
                Reserve Now
            </button>

            {/* Popup Modal */}
            {showPopup && (
                <dialog
                    open
                    className="popup-overlay"
                    onClick={(e) => e.target === e.currentTarget && handleClosePopup()} 
                >
                    <div 
                        className="popup-content" 
                        role="dialog"
                        aria-labelledby="dialog-title"
                        aria-modal="true"
                        tabIndex={0} 
                        onKeyDown={(e) => {
                            
                            if (e.key === "Enter" || e.key === " ") {
                                handleConfirm();
                            }
                        }}
                    >
                        <h2 id="dialog-title">Select the date</h2>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                        />
                        <button
                            className="confirm-button"
                            onClick={handleConfirm}
                            aria-label="Confirm date selection"
                        >
                            Confirm
                        </button>
                        <button 
                            onClick={handleClosePopup} 
                            aria-label="Close dialog"
                        >
                            Close
                        </button>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default Day;
