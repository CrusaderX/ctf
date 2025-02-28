package com.example.iot.controller;

import com.example.iot.model.Device;
import com.example.iot.repository.DeviceRepository;
import com.example.iot.service.ExecutionLogService;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/device")
public class DeviceController {

    private final DeviceRepository deviceRepository;
    private final ExecutionLogService executionLogService;

    public DeviceController(DeviceRepository deviceRepository, ExecutionLogService executionLogService) {
        this.deviceRepository = deviceRepository;
        this.executionLogService = executionLogService;
    }

    @GetMapping("/generate-bin")
    public ResponseEntity<InputStreamResource> generateDeviceBin(@RequestParam String id,
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam boolean status) {
        try {
            Device device = new Device(id, name, type, status);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(device);
            oos.flush();
            byte[] binaryData = bos.toByteArray();

            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(binaryData));
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=device.bin");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String id) {
        deviceRepository.deleteById(id);
        executionLogService.log("Device deleted: ID " + id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable String id, @RequestBody Device updatedDevice) {
        return deviceRepository.findById(id)
                .map(device -> {
                    device.setName(updatedDevice.getName());
                    device.setType(updatedDevice.getType());
                    device.setStatus(updatedDevice.isStatus());
                    executionLogService.log("Device updated: " + device.getName());
                    return ResponseEntity.ok(deviceRepository.save(device));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDevice(@RequestBody Map<String, String> payload) {
        try {
            String base64Data = payload.get("file");
            if (base64Data == null || base64Data.isEmpty()) {
                System.out.println("ERROR: Upload request missing 'file' field.");
                throw new IllegalArgumentException("Missing 'file' in request payload");
            }

            System.out.println("INFO: Starting deserialization process.");

            byte[] binaryData = Base64.getDecoder().decode(base64Data);
            System.out.println("DEBUG: Base64 decoded data length: " + binaryData.length);

            Device device = deserializeDevice(binaryData);

            System.out.println("DEBUG: Deserialized device object - " + device);

            deviceRepository.save(device);

            System.out.println(
                    "INFO: Device '" + device.getName() + "' with ID '" + device.getId() + "' successfully added.");
            return ResponseEntity.ok(Map.of("message", "Device added successfully"));
        } catch (Exception e) {
            System.out.println("ERROR: Failed to deserialize device - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to deserialize device: " + e.getMessage()));
        }
    }

    public static class UploadRequest {
        private String file;

        public String getFile() {
            return file;
        }

        public void setFile(String file) {
            this.file = file;
        }
    }

    public static class UploadResponse {
        private String message;

        public UploadResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    private Device deserializeDevice(byte[] data) throws Exception {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(data);
                ObjectInputStream ois = new ObjectInputStream(bis)) {

            System.out.println("INFO: Starting vulnerable deserialization process.");
            Object deserializedObject = ois.readObject();

            if (deserializedObject instanceof Device) {
                Device device = (Device) deserializedObject;
                System.out.println("DEBUG: Successfully deserialized Device object.");
                System.out.println("DEBUG: Device details - ID: " + device.getId() +
                        ", Name: " + device.getName() +
                        ", Type: " + device.getType() +
                        ", Status: " + device.isStatus());
                return device;
            } else {
                System.out.println("ERROR: Deserialized object is not a Device.");
                throw new IllegalArgumentException("Invalid object type: " + deserializedObject.getClass().getName());
            }
        } catch (Exception e) {
            System.out.println("ERROR: Deserialization failed - " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
