import React, { useState } from "react";
import PropTypes from "prop-types"; 

function ChangeSeatsPopup({ onClose, onSubmit }) {
  const [newSeatCount, setNewSeatCount] = useState("");

  const handleSubmit = () => {
    if (newSeatCount) {
      onSubmit(Number(newSeatCount));
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Change Seat Count</h2>
        <input 
          type="number"
          value={newSeatCount}
          onChange={(e) => setNewSeatCount(e.target.value)}
          placeholder="Enter new seat count"
        />
        <div className="popups-button-container">
          <button className="button-one" onClick={handleSubmit}>Confirm</button>
          <button className="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


ChangeSeatsPopup.propTypes = {
  onClose: PropTypes.func.isRequired, 
  onSubmit: PropTypes.func.isRequired, 
};

export default ChangeSeatsPopup;
