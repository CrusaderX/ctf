```console
$  tshark -r freeRangePackets.pcapng -T fields -e btl2cap.payload |  xxd -r -p
```

```
  console
$ tshark -r ./freeRangePackets.pcapng -x > dump && node index.js
```