package com.example.iot.service;

import com.example.iot.model.ExecutionLog;
import com.example.iot.repository.ExecutionLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExecutionLogService {

    private final ExecutionLogRepository executionLogRepository;

    public ExecutionLogService(ExecutionLogRepository executionLogRepository) {
        this.executionLogRepository = executionLogRepository;
    }

    public void log(String description) {
        ExecutionLog log = new ExecutionLog(LocalDateTime.now(), description);
        executionLogRepository.save(log);
    }

    public List<ExecutionLog> getAllLogs() {
        return executionLogRepository.findAll();
    }
}
