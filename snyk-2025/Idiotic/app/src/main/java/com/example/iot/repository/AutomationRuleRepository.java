package com.example.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.iot.model.AutomationRule;

public interface AutomationRuleRepository extends JpaRepository<AutomationRule, String> {
}
