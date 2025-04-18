package com.example.demo.model;

import java.util.List;

public class FloorUpdateRequest {
    private String floorTableName;  // Table name (e.g., floor_1)
    private List<FloorUpdateRow> rows;  // List of rows to update

    // Getters and Setters
    public String getFloorTableName() {
        return floorTableName;
    }

    public void setFloorTableName(String floorTableName) {
        this.floorTableName = floorTableName;
    }

    public List<FloorUpdateRow> getRows() {
        return rows;
    }

    public void setRows(List<FloorUpdateRow> rows) {
        this.rows = rows;
    }

    public static class FloorUpdateRow {
        private int seatNumber;
        private String status;
        private Long teamId;
        private Long userId;
        private String date;

        // Getters and Setters
        public int getSeatNumber() {
            return seatNumber;
        }

        public void setSeatNumber(int seatNumber) {
            this.seatNumber = seatNumber;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Long getTeamId() {
            return teamId;
        }

        public void setTeamId(Long teamId) {
            this.teamId = teamId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }
}
