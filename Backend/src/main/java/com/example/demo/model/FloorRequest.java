package com.example.demo.model;

public class FloorRequest {
    private String floorTableName;
    private int totalSeats;

    // Getters and setters

    public String getFloorTableName() {
        return floorTableName;
    }

    public void setFloorTableName(String floorTableName) {
        this.floorTableName = floorTableName;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }
}
