#!/usr/bin/env python3
import sys

# USB HID mappings (basic version)
hid_map = {
    0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e',
    0x09: 'f', 0x0A: 'g', 0x0B: 'h', 0x0C: 'i', 0x0D: 'j',
    0x0E: 'k', 0x0F: 'l', 0x10: 'm', 0x11: 'n', 0x12: 'o',
    0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't',
    0x18: 'u', 0x19: 'v', 0x1A: 'w', 0x1B: 'x', 0x1C: 'y',
    0x1D: 'z', 0x1E: '1', 0x1F: '2', 0x20: '3', 0x21: '4',
    0x22: '5', 0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9',
    0x27: '0', 0x2C: ' '
}
hid_map_shift = {
    0x04: 'A', 0x05: 'B', 0x06: 'C', 0x07: 'D', 0x08: 'E',
    0x09: 'F', 0x0A: 'G', 0x0B: 'H', 0x0C: 'I', 0x0D: 'J',
    0x0E: 'K', 0x0F: 'L', 0x10: 'M', 0x11: 'N', 0x12: 'O',
    0x13: 'P', 0x14: 'Q', 0x15: 'R', 0x16: 'S', 0x17: 'T',
    0x18: 'U', 0x19: 'V', 0x1A: 'W', 0x1B: 'X', 0x1C: 'Y',
    0x1D: 'Z', 0x1E: '!', 0x1F: '@', 0x20: '#', 0x21: '$',
    0x22: '%', 0x23: '^', 0x24: '&', 0x25: '*', 0x26: '(',
    0x27: ')', 0x2C: ' '
}

def decode_report(report_bytes):
    # Expect report_bytes to be a list of 8 numbers.
    if len(report_bytes) < 8:
        return ""
    modifiers = report_bytes[0]
    result = ""
    # Bytes 2 to 7 are key codes
    for keycode in report_bytes[2:8]:
        if keycode == 0:
            continue  # no key pressed
        if modifiers & (0x02 | 0x20):  # if shift is active
            result += hid_map_shift.get(keycode, '')
        else:
            result += hid_map.get(keycode, '')
    return result

# Process each line from standard input
for line in sys.stdin:
    # Remove spaces and colons from the line.
    hex_string = line.strip().replace(" ", "").replace(":", "")
    if not hex_string:
        continue
    # Process the hex string in chunks of 16 characters (8 bytes)
    for i in range(0, len(hex_string), 16):
        chunk = hex_string[i:i+16]
        if len(chunk) < 16:
            continue  # incomplete report
        try:
            report = [int(chunk[j:j+2], 16) for j in range(0, 16, 2)]
            decoded = decode_report(report)
            sys.stdout.write(decoded)
        except Exception as e:
            # Optionally print an error or simply skip this chunk.
            continue
sys.stdout.flush()

