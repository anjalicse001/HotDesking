// GenerateReportButton.js
import React from "react";

const GenerateReportButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Generate Seat Report
    </button>
  );
};

export default GenerateReportButton;
