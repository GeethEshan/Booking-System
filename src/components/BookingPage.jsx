import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";
import Navbar from "./Navbar";
import ChangeSeatsPopup from "./ChangeSeatsPopup";
import QRCodePopup from "./QRCodePopup";

function BookingPage() {
  const location = useLocation();
  const { username, role } = location.state || {};

  const [sheets, setSheets] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const fetchTotalSeats = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/seatCount");
      return response.data.TotalSeats;
    } catch (error) {
      console.error("Error fetching total seats:", error);
      return 50;
    }
  };

  const fetchBookings = async (seatCount) => {
    if (!username) {
      console.error("Username is not available.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/api/bookingdata",
        {
          params: { username },
        }
      );
      const bookingData = response.data;
      const updatedSheets = Object.keys(bookingData).reduce((acc, day) => {
        acc[day] = {
          ...bookingData[day],
          available: seatCount,
        };
        return acc;
      }, {});
      setSheets(updatedSheets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const seatCount = await fetchTotalSeats();
      await fetchBookings(seatCount);
    };
    initializeData();
  }, [username]);

  const handleReserve = async (day) => {
    if (!username) {
      console.error("Username is not available.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/auth/users/${username}`
      );
      const { email, contactNumber } = response.data;

      if (sheets[day]?.reserved) {
        await axios.delete("http://localhost:3001/api/bookingpagedelete", {
          data: { username, day },
        });

        setSheets((prevSheets) => ({
          ...prevSheets,
          [day]: {
            ...prevSheets[day],
            reserved: false,
            booked: prevSheets[day].booked - 1,
            available: prevSheets[day].available + 1,
          },
        }));
      } else {
        await axios.post("http://localhost:3001/api/bookingpage", {
          username,
          email,
          contactNumber,
          day,
        });

        setSheets((prevSheets) => ({
          ...prevSheets,
          [day]: {
            ...prevSheets[day],
            reserved: true,
            booked: prevSheets[day].booked + 1,
            available: prevSheets[day].available - 1,
          },
        }));

        setReservationData({ username, day });
        setShowQRPopup(true);

        await axios.post("http://localhost:3001/auth/sendBookingConfirmation", {
          email,
          username,
          day,
        });
      }
    } catch (error) {
      console.error("Error reserving seat:", error);
    }
  };

  const handleSeatChange = async (newSeatCount) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/updateSeats",
        {
          newSeatCount,
        }
      );
      if (response.status === 200) {
        const updatedSheets = Object.keys(sheets).reduce((acc, day) => {
          acc[day] = {
            ...sheets[day],
            available: newSeatCount,
          };
          return acc;
        }, {});
        setSheets(updatedSheets);
      }
    } catch (error) {
      console.error("Error updating seat count:", error);
    }
  };

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);
  const closeQRPopup = () => setShowQRPopup(false);

  return (
    <div className="booking-page">
      <Navbar username={username} role={role} />

      <div className="center-container">
        {loading ? (
          <p>Loading booking data...</p>
        ) : (
          <div className="reservation-container">
            {Object.keys(sheets).map((day) => (
              <div key={day} className="day-container">
                <h3>{day}</h3>
                <div className="input-box">
                  <label htmlFor={`${day}-available`}>Available Seats:</label>
                  <input
                    id={`${day}-available`}
                    type="text"
                    value={sheets[day]?.available || "Loading..."}
                    readOnly
                  />
                </div>
                <div className="input-box">
                  <label htmlFor={`${day}-booked`}>Booked Seats:</label>
                  <input
                    id={`${day}-booked`}
                    type="text"
                    value={
                      sheets[day]?.booked !== undefined
                        ? sheets[day].booked
                        : "0"
                    }
                    readOnly
                  />
                </div>
                <button
                  className={
                    sheets[day]?.reserved ? "cancel-button" : "reserve-button"
                  }
                  onClick={() => handleReserve(day)}
                >
                  {sheets[day]?.reserved ? "Cancel" : "Reserve"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {role === "admin" && (
        <div className="change-button-container">
          <button className="change-button" onClick={openPopup}>
            Change Seats
          </button>
        </div>
      )}
      {showPopup && (
        <ChangeSeatsPopup onClose={closePopup} onSubmit={handleSeatChange} />
      )}
      {showQRPopup && reservationData && (
        <QRCodePopup onClose={closeQRPopup} reservationData={reservationData} />
      )}
    </div>
  );
}

export default BookingPage;
