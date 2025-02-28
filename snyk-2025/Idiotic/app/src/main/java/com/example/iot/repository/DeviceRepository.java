package com.example.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.iot.model.Device;

public interface DeviceRepository extends JpaRepository<Device, String> {
}
