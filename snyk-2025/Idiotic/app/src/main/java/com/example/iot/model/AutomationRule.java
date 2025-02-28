package com.example.iot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AutomationRule {

    @Id
    private String id;
    private String name;
    private String trigger;
    private String action;

    public AutomationRule() {
    }

    public AutomationRule(String id, String name, String trigger, String action) {
        this.id = id;
        this.name = name;
        this.trigger = trigger;
        this.action = action;
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

    public String getTrigger() {
        return trigger;
    }

    public void setTrigger(String trigger) {
        this.trigger = trigger;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
