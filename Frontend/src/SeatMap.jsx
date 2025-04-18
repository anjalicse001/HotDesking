import React, { useEffect, useState } from "react";
import "./SeatMap.css";
import GenerateReportButton from "./GenerateReportButton";
import { generateSeatReport } from "./generateReport";

const initialSeatMapLayout = `
c c c c c c c c c c c c c c c c c c c c c c
c c c c c c c c c c c c c c c c c c c c c c
s s 1 4 s 7 10 s 13 16 s s s c c c 19 22 s 25 s 28 
s s 2 5 s 8 11 s 14 17 s s s c c c 20 23 s 26 s 29 
s s 3 6 s 9 12 s 15 18 s s s c c c 21 24 s 27 s 30
w w w w w w w w w w w w w w w w w w w w w w
s c c c c s s s s s s s s s s s s s s s s s
s c c c c s c c c s 31 34 s s c c c s s c c c
s c c c c s c c c s 32 35 s s c c c s s c c c
s c c c c s c c c s 33 36 s s c c c s s c c c 
w w w w w w w w w w w w w w w w w w w w w w
s s s 37 39 s c c s 41 43 s s s 45 47 s s s 49 51 s
s s s 38 40 s c c s 42 44 s s s 46 48 s s s 50 52 s
c c c c c c c c c c c c c c c c c c c c c c
c c c c c c c c c c c c c c c c c c c c c c
`;

const SeatMap = () => {
  const [loaded, setLoaded] = useState(false);
  const [seatMapLayout, setSeatMapLayout] = useState(initialSeatMapLayout);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]);

  const fetchSeatData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/floor/floor_1/rows");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setSeatData(data);

      const seatMapWithStatus = initialSeatMapLayout.replace(/\b(\d{1,2})\b/g, (match) => {
        const seat = data.find(s => s.seatNumber === parseInt(match));
        return seat ? `${match}${seat.status}` : match;
      });

      setSeatMapLayout(seatMapWithStatus);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching seat map:", error);
    }
  };

  const handleSeatClick = (seatNum, status) => {
    if (status === 'r') return;
    setSelectedSeats(prev =>
      prev.includes(seatNum)
        ? prev.filter(num => num !== seatNum)
        : [...prev, seatNum]
    );
  };

  const bookSeats = async () => {
    const body = {
      floorTableName: "floor_1",
      rows: selectedSeats.map(seatNumber => ({
        seatNumber,
        status: "r",
        teamId: 101,
        userId: 202,
        date: "2025-04-13"
      }))
    };

    try {
      const response = await fetch("http://localhost:8080/api/floor/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert("Seats booked successfully.");
        setSelectedSeats([]);
        fetchSeatData();
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Error booking seats:", error);
    }
  };

  const rows = seatMapLayout.trim().split("\n");

  const renderSeat = (code, rowIdx, colIdx) => {
    if (code.toLowerCase() === "s") return <div key={`${rowIdx}-${colIdx}`} className="seat space" />;
    if (code.toLowerCase() === "w") return <div key={`${rowIdx}-${colIdx}`} className="seat walkway" />;
    if (code.toLowerCase() === "c") return <div key={`${rowIdx}-${colIdx}`} className="seat cabin" />;

    const match = code.match(/(\d+)([vrt])/i);
    if (!match) return <div key={`${rowIdx}-${colIdx}`} className="seat space" />;

    const [, seatNumStr, status] = match;
    const seatNum = parseInt(seatNumStr);
    let seatClass = "seat";

    switch (status.toLowerCase()) {
      case "v":
        seatClass += " vacant";
        break;
      case "t":
        seatClass += " team-vacant";
        break;
      case "r":
        seatClass += " reserved";
        break;
      default:
        seatClass += " space";
    }

    const isSelected = selectedSeats.includes(seatNum);
    if (isSelected) seatClass += " selected";

    return (
      <div
        key={`${rowIdx}-${colIdx}`}
        className={seatClass}
        onClick={() => handleSeatClick(seatNum, status.toLowerCase())}
      >
        {seatNum}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <button onClick={fetchSeatData} style={{ marginBottom: "10px" }}>Refresh</button>

      {loaded && (
        <div className="seat-map-container">
          <div className="legend">
            <div className="legend-item">
              <div className="seat vacant"></div>
              <span>Unassigned Vacant</span>
            </div>
            <div className="legend-item">
              <div className="seat team-vacant"></div>
              <span>Team Vacant</span>
            </div>
            <div className="legend-item">
              <div className="seat reserved"></div>
              <span>Reserved</span>
            </div>
            <div className="legend-item">
              <div className="seat cabin"></div>
              <span>Cabin Area</span>
            </div>
            <div className="legend-item">
              <div className="seat walkway"></div>
              <span>Walkway</span>
            </div>
          </div>

          <div className="seat-map">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="seat-row">
                {row.trim().split(/\s+/).map((code, colIdx) => renderSeat(code, rowIdx, colIdx))}
              </div>
            ))}
          </div>

          {selectedSeats.length > 0 && (
            <button className="book-button" onClick={bookSeats}>Book</button>
          )}
           <GenerateReportButton onClick={generateSeatReport} />
        </div>
      )}
    </div>
  );
};

export default SeatMap;
