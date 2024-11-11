import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import './Report.css';
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Report = () => {
    const location = useLocation();
    const { username, role } = location.state || {};
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const downloadButtonRef = useRef(null); 
    const attendanceContainerRef = useRef(null); 

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/bookings");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                const filteredRecords = data.filter(record =>
                    record.attendance === "Present" || record.attendance === "Absent"
                );

                setAttendanceRecords(filteredRecords);
            } catch (error) {
                console.error("Failed to fetch attendance data:", error);
            }
        };

        fetchAttendanceData();
    }, []);

    const downloadPDF = () => {
        
        if (downloadButtonRef.current) {
            downloadButtonRef.current.style.display = "none";
        }

        html2canvas(attendanceContainerRef.current, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgWidth = 190; 
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

           
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("attendance_report.pdf");

           
            if (downloadButtonRef.current) {
                downloadButtonRef.current.style.display = "block";
            }
        });
    };

    return (
        <div className="report-page"> 
            <Navbar username={username} role={role} />
            <div className="attendance-container" ref={attendanceContainerRef}>
                <h2 className="attendance-title">Attendance Report</h2>
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Day</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.username}</td>
                                <td>{record.day}</td>
                                <td>{record.attendance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="download-button" onClick={downloadPDF} ref={downloadButtonRef}>
                    Download
                </button>
            </div>
        </div>
    );
};

export default Report;
