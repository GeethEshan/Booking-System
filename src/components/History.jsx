import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./History.css";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const location = useLocation();
  const navigate = useNavigate();
  const { username, role } = location.state || {};

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let url;
        if (role === "admin") {
          url = `https://booking-441416.de.r.appspot.com/api/bookings`;
        } else if (username) {
          url = `https://booking-441416.de.r.appspot.com/api/history/${username}`;
        } else {
          console.error("No username provided");
          return;
        }

        const response = await axios.get(url, {
          withCredentials: true,
        });
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [username, role]);

  const handleCancel = async (username, day) => {
    try {
      await axios.delete(`https://booking-441416.de.r.appspot.com/api/bookingpagedelete`, {
        data: { username, day },
        withCredentials: true,
      });

      setHistoryData((prevData) =>
        prevData.filter(
          (booking) => booking.username !== username || booking.day !== day
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const updateAttendance = async (username, day, attendance) => {
    try {
      const response = await axios.put(
        "https://booking-441416.de.r.appspot.com/api/updateAttendance",
        {
          username,
          day,
          attendance,
        }
      );

      setHistoryData((prevData) =>
        prevData.map((booking) =>
          booking.username === username && booking.day === day
            ? { ...booking, attendance: attendance }
            : booking
        )
      );

      console.log("Attendance updated:", response.data);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleReport = () => {
    navigate("/report", { state: { username, role } });
  };

 
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = historyData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history-page">
      <Navbar username={username} role={role} />
      <div className="history-container">
        <h2 className="title">Booking History</h2>

        <table className="history-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Contact Number</th>
              <th>Day</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.username}</td>
                  <td>{booking.contactNumber}</td>
                  <td>{booking.day}</td>
                  <td
                    className={
                      booking.attendance === "Present"
                        ? "attendance-present"
                        : booking.attendance === "Absent"
                        ? "attendance-absent"
                        : ""
                    }
                  >
                    {booking.attendance || "Pending"}
                  </td>
                  <td>Booked</td>
                  <td>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel(booking.username, booking.day)}
                    >
                      Cancel
                    </button>
                    {role === "admin" && (
                      <>
                        <button
                          className="present-button"
                          onClick={() =>
                            updateAttendance(booking.username, booking.day, "Present")
                          }
                        >
                          Present
                        </button>
                        <button
                          className="absent-button"
                          onClick={() =>
                            updateAttendance(booking.username, booking.day, "Absent")
                          }
                        >
                          Absent
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>

        
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {role === "admin" && (
          <div className="report-button-container">
            <button className="report-button" onClick={handleReport}>
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
