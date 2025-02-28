package com.example.iot;

import com.example.iot.model.AutomationRule;
import com.example.iot.model.Device;
import com.example.iot.model.ExecutionLog;
import com.example.iot.repository.AutomationRuleRepository;
import com.example.iot.repository.DeviceRepository;
import com.example.iot.repository.ExecutionLogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final DeviceRepository deviceRepository;
    private final AutomationRuleRepository ruleRepository;
    private final ExecutionLogRepository logRepository;

    public DatabaseSeeder(DeviceRepository deviceRepository, AutomationRuleRepository ruleRepository,
            ExecutionLogRepository logRepository) {
        this.deviceRepository = deviceRepository;
        this.ruleRepository = ruleRepository;
        this.logRepository = logRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Devices
        deviceRepository.saveAll(List.of(
                new Device("1", "Living Room Thermostat", "Thermostat", true),
                new Device("2", "Front Door Camera", "Camera", true),
                new Device("3", "Bedroom Light", "Light", false)));

        // Seed Automation Rules
        ruleRepository.saveAll(List.of(
                new AutomationRule("1", "Turn on lights at sunset", "sunset", "Turn on Bedroom Light"),
                new AutomationRule("2", "Notify when door camera detects motion", "motion_detected",
                        "Send notification")));

        // Seed Execution Logs
        logRepository.saveAll(List.of(
                new ExecutionLog(LocalDateTime.now().minusHours(2), "IoT Controller Online!")));

        System.out.println("Database seeded successfully with devices, automation rules, and logs.");
    }
}
