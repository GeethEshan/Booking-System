import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QRCodePopup.css";

function QRCodePopup({ onClose, reservationData }) {
  const { username, day } = reservationData;
  const qrValue = `Reserved by: ${username}, Date: ${day}`;

  return (
    <div className="qr-popup">
      <div className="qr-popup-content">
        <h2>Reservation QR Code</h2>
        <QRCodeCanvas value={qrValue} size={200} /> <p>{qrValue}</p>
        <button className="cancel-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default QRCodePopup;
