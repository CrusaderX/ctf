We have to get all USB data from pcap file like

```console
$ tshark -r capture.pcapng -T fields -e usb.capdata > hex_output.txt
```

then we will create a decoder in python to translate what we got with removing colons (and spaces) and then processes each 8‑byte (16 hex character) chunk.

```console
$ cat hex_output.txt | python decoder.py
```


`flag{a3ce310e9a0dc53bc030847192e2f585}`
