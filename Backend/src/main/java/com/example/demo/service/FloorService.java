package com.example.demo.service;

import com.example.demo.model.FloorRequest;
import com.example.demo.model.FloorRow;
import com.example.demo.model.FloorUpdateRequest;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FloorService {

    private final JdbcTemplate jdbcTemplate;

    public FloorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String createFloorTable(FloorRequest floorRequest) {
        String tableName = floorRequest.getFloorTableName();
        int totalSeats = floorRequest.getTotalSeats();

        String createTableSql = "CREATE TABLE IF NOT EXISTS " + tableName + " (" +
                "seat_number INT PRIMARY KEY, " +
                "status VARCHAR(10) NOT NULL DEFAULT 'v', " +
                "team_id INT DEFAULT NULL, " +
                "user_id INT DEFAULT NULL, " +
                "date DATE DEFAULT NULL" +
                ")";
        jdbcTemplate.execute(createTableSql);

        for (int i = 1; i <= totalSeats; i++) {
            String insertSql = "INSERT INTO " + tableName + " (seat_number) VALUES (" + i + ")";
            jdbcTemplate.execute(insertSql);
        }

        return "Floor table '" + tableName + "' created with " + totalSeats + " seats.";
    }

        // New method to update rows in the floor table
    public String updateFloorRows(FloorUpdateRequest updateRequest) {
        String tableName = updateRequest.getFloorTableName();
        for (FloorUpdateRequest.FloorUpdateRow row : updateRequest.getRows()) {
            String updateSql = "UPDATE " + tableName + " SET " +
                    "status = ?, " +
                    "team_id = ?, " +
                    "user_id = ?, " +
                    "date = CAST(? AS DATE) " +
                    "WHERE seat_number = ?";
            jdbcTemplate.update(updateSql, row.getStatus(), row.getTeamId(), row.getUserId(), row.getDate(), row.getSeatNumber());
        }

        return "Rows updated successfully in table '" + tableName + "'.";
    }

    // Fetch all rows from the floor table
    public List<FloorRow> getAllRows(String tableName) {
        String query = "SELECT seat_number, status, team_id, user_id, date FROM " + tableName;
        
        return jdbcTemplate.query(query, new RowMapper<FloorRow>() {
            @Override
            public FloorRow mapRow(ResultSet rs, int rowNum) throws SQLException {
                FloorRow floorRow = new FloorRow();
                floorRow.setSeatNumber(rs.getInt("seat_number"));
                floorRow.setStatus(rs.getString("status"));
                floorRow.setTeamId(rs.getLong("team_id"));
                floorRow.setUserId(rs.getLong("user_id"));
                floorRow.setDate(rs.getString("date"));
                return floorRow;
            }
        });
    }
}
