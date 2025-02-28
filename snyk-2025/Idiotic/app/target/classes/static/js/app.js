document.addEventListener("DOMContentLoaded", () => {
    const deviceList = document.getElementById("device-list");
    const automationList = document.getElementById("automation-list");
    const logList = document.getElementById("log-list"); // Matches corrected HTML

    const getDevicesBtn = document.getElementById("get-devices-btn");

    const refreshLogsBtn = document.getElementById("refresh-logs-btn");
    const addAutomationBtn = document.getElementById("add-automation-btn"); // Ensure this matches the HTML
    const getAutomationsBtn = document.getElementById("get-automations-btn");

    const automationModal = document.getElementById("automation-modal");

    const automationForm = document.getElementById("add-automation-form");

    const deviceModal = document.getElementById("device-modal");
    const addDeviceBtn = document.getElementById("add-device-btn");
    const deviceForm = document.getElementById("add-device-form");

    // Open modal
    const openModal = modal => {
        modal.style.display = "flex";
    };

    // Close modal
    const closeModal = modal => {
        modal.style.display = "none";
    };

    document.querySelectorAll(".modal .close").forEach(btn =>
        btn.addEventListener("click", () => {
            closeModal(btn.closest(".modal"));
        })
    );

    // Fetch and display devices
    async function loadDevices() {
        const response = await fetch("/api/device");
        const devices = await response.json();
        deviceList.innerHTML = devices
            .map(device => `<div>${device.name} (${device.type}) - ${device.status ? "Online" : "Offline"}</div>`)
            .join("");
    }

    async function loadAutomations() {
        try {
            const response = await fetch("/api/automation");
            const automations = await response.json();
            automationList.innerHTML = automations
                .map(rule => `<div>${rule.name}: Trigger "${rule.trigger}" -> Action "${rule.action}"</div>`)
                .join("");
        } catch (error) {
            console.error("Failed to load automations:", error);
        }
    }

    // Attach event listener
    if (getAutomationsBtn) {
        getAutomationsBtn.addEventListener("click", loadAutomations);
    } else {
        console.error("Get Automation Rules button not found!");
    }

    // Fetch and display logs
    async function loadLogs() {
        const response = await fetch("/api/logs");
        const logs = await response.json();
        logList.innerHTML = logs
            .map(log => `<div>${log.timestamp} - ${log.description}</div>`)
            .join("");
    }

    // Handle file upload and submission
    deviceForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById("device-file");
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a .bin file to upload.");
            return;
        }

        const reader = new FileReader();

        reader.onload = async function (event) {
            try {
                // Convert ArrayBuffer to Base64
                const base64Data = btoa(
                    new Uint8Array(event.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), "")
                );

                const response = await fetch("/api/device/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ file: base64Data }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Device uploaded successfully: " + result.message);
                    deviceModal.style.display = "none";
                } else {
                    alert("Error uploading device: " + result.error);
                }
            } catch (error) {
                console.error("Failed to upload device:", error);
                alert("An error occurred while uploading the device.");
            }
        };

        reader.readAsArrayBuffer(file);
    });

    // Add automation
    automationForm.addEventListener("submit", async e => {
        e.preventDefault();
        const newRule = {
            id: Date.now().toString(),
            name: document.getElementById("automation-name").value,
            trigger: document.getElementById("automation-trigger").value,
            action: document.getElementById("automation-action").value,
        };
        await fetch("/api/automation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRule),
        });
        closeModal(automationModal);
        loadAutomations();
    });

    const generateBinForm = document.getElementById("generate-bin-form");

    generateBinForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("device-id").value;
        const name = document.getElementById("device-name").value;
        const type = document.getElementById("device-type").value;
        const status = document.getElementById("device-status").value;

        try {
            const response = await fetch(`/api/device/generate-bin?id=${id}&name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}&status=${status}`, {
                method: "GET",
            });

            if (!response.ok) {
                alert("Failed to generate .bin file");
                return;
            }

            // Create a blob from the response and trigger download
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "device.bin";
            a.click();
            URL.revokeObjectURL(url);

            alert("Device .bin file generated and downloaded successfully!");
        } catch (error) {
            console.error("Error generating .bin file:", error);
            alert("An error occurred while generating the .bin file.");
        }
    });

    // Attach button events
    getDevicesBtn.addEventListener("click", loadDevices);
    getAutomationsBtn.addEventListener("click", loadAutomations);
    refreshLogsBtn.addEventListener("click", loadLogs);

    addDeviceBtn.addEventListener("click", () => {
        deviceModal.style.display = "flex";
    });

    document.querySelector(".modal .close").addEventListener("click", () => {
        deviceModal.style.display = "none";
    });

    addAutomationBtn.addEventListener("click", () => openModal(automationModal));

    // Initial load
    loadDevices();
    loadAutomations();
    loadLogs();
});
