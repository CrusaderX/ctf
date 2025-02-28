package com.example.iot.model;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Device implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    private String name;
    private String type;
    private boolean status;

    public Device() {
    }

    public Device(String id, String name, String type, boolean status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
