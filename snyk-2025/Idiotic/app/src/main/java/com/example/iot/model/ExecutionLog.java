package com.example.iot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

@Entity
public class ExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private LocalDateTime timestamp;
    private String description;

    public ExecutionLog() {
    }

    public ExecutionLog(LocalDateTime timestamp, String description) {
        this.timestamp = timestamp;
        this.description = description;
    }

    public ExecutionLog(String id, LocalDateTime timestamp, String description) {
        this.id = id;
        this.timestamp = timestamp;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
