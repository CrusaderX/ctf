package com.example.iot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.iot.model.Device;
import com.example.iot.repository.DeviceRepository;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ImportController {

    private final DeviceRepository deviceRepository;

    public ImportController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importConfig(@RequestParam("file") MultipartFile file) {
        try {
            byte[] data = file.getBytes();
            List<Device> devices = parseBinaryFile(data);

            devices.forEach(device -> {
                if (deviceRepository.existsById(device.getId())) {
                    Device existing = deviceRepository.findById(device.getId()).orElseThrow();
                    existing.setName(device.getName());
                    existing.setType(device.getType());
                    existing.setStatus(device.isStatus());
                    deviceRepository.save(existing);
                } else {
                    deviceRepository.save(device);
                }
            });

            return ResponseEntity.ok("Configuration file imported successfully.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to import configuration file.");
        }
    }

    private List<Device> parseBinaryFile(byte[] data) {
        List<Device> devices = new ArrayList<>();
        ByteBuffer buffer = ByteBuffer.wrap(data);

        while (buffer.remaining() >= 40) {
            int id = buffer.getInt();

            byte[] nameBytes = new byte[20];
            buffer.get(nameBytes);
            String name = new String(nameBytes).trim();

            byte[] typeBytes = new byte[15];
            buffer.get(typeBytes);
            String type = new String(typeBytes).trim();

            boolean status = buffer.get() == 1;

            devices.add(new Device(String.valueOf(id), name, type, status));
        }

        return devices;
    }
}
