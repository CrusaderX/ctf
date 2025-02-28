package com.example.iot.repository;

import com.example.iot.model.ExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExecutionLogRepository extends JpaRepository<ExecutionLog, String> {
}
