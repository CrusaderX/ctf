package com.example.iot.controller;

import com.example.iot.model.ExecutionLog;
import com.example.iot.service.ExecutionLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ExecutionLogController {

    private final ExecutionLogService executionLogService;

    public ExecutionLogController(ExecutionLogService executionLogService) {
        this.executionLogService = executionLogService;
    }

    @PostMapping("/api/logs")
    public void createLog(@RequestBody String description) {
        executionLogService.log(description);
    }

    @GetMapping("/api/logs")
    public List<ExecutionLog> getLogs() {
        return executionLogService.getAllLogs();
    }
}
