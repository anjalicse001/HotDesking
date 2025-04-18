package com.example.demo.controller;

import com.example.demo.model.FloorRequest;
import com.example.demo.model.FloorRow;
import com.example.demo.model.FloorUpdateRequest;
import com.example.demo.service.FloorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/floor")
public class FloorController {

    @Autowired
    private FloorService floorService;

    @PostMapping("/create")
    public String createFloor(@RequestBody FloorRequest floorRequest) {
        return floorService.createFloorTable(floorRequest);
    }
    // New endpoint to update rows in a floor table
    @PutMapping("/update")
    public String updateFloorRows(@RequestBody FloorUpdateRequest updateRequest) {
        return floorService.updateFloorRows(updateRequest);
    }
    // Endpoint to fetch all rows from a dynamic floor table
    @GetMapping("/{tableName}/rows")
    public List<FloorRow> getAllRows(@PathVariable String tableName) {
        return floorService.getAllRows(tableName);
    }
}
