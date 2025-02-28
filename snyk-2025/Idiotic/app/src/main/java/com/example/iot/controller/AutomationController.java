package com.example.iot.controller;

import com.example.iot.model.AutomationRule;
import com.example.iot.repository.AutomationRuleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automation")
public class AutomationController {

    private final AutomationRuleRepository automationRuleRepository;

    public AutomationController(AutomationRuleRepository automationRuleRepository) {
        this.automationRuleRepository = automationRuleRepository;
    }

    @GetMapping
    public List<AutomationRule> getAllRules() {
        return automationRuleRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<AutomationRule> addRule(@RequestBody AutomationRule rule) {
        AutomationRule savedRule = automationRuleRepository.save(rule);
        return ResponseEntity.ok(savedRule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeRule(@PathVariable String id) {
        automationRuleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
