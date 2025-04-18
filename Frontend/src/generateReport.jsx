// generateReport.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateSeatReport = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/floor/floor_1/rows");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const transformed = data.map((seat) => ({
      SeatNumber: seat.seatNumber,
      Status:
        seat.status === "r"
          ? "Reserved"
          : seat.status === "t"
          ? "Vacant (Team Assigned)"
          : "Vacant",
      TeamID: seat.teamId === 0 ? "N/A" : seat.teamId,
      UserID: seat.userId === 0 ? "N/A" : seat.userId,
      Date: seat.date || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformed);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Seats");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Seat_Report.xlsx");

    alert("Seat report generated!");
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Failed to generate report.");
  }
};
