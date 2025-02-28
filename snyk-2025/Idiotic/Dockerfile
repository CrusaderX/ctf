FROM maven:3.8.8-eclipse-temurin-17 AS build

WORKDIR /app

COPY ./app/pom.xml ./
RUN mvn dependency:go-offline

COPY ./app/src ./src
RUN mvn clean package -DskipTests
#ENTRYPOINT [ "/bin/sh" ]

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/iot-0.0.1-SNAPSHOT.jar ./iot.jar
COPY flag.txt ./flag.txt

EXPOSE 8080

ENTRYPOINT ["java", "-Dorg.apache.commons.collections.enableUnsafeSerialization=true", "-jar", "iot.jar"]
