package com.io.ktek.keno.integration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.io.ktek.integrationtest.IntegrationTestWorker;
import com.io.ktek.integrationtest.model.ScenarioConfig;
import com.io.ktek.keno.grpc.endpoint.KenoServiceGrpc;
import com.io.ktek.keno.integration.config.TestBeanConfig;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.json.JSONException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

@SpringBootTest
@ActiveProfiles(profiles = {"test", "integration-test"})
@Import(TestBeanConfig.class)
public class KenoApplicationTest {

    @Value("${grpc.port}")
    private int grpcPort;

    @Autowired
    private IntegrationTestWorker integrationTestWorker;

    public static List<ScenarioConfig> generateInputs() throws IOException {
        TypeReference<List<ScenarioConfig>> typeReference = new TypeReference<>() {
        };
        List<ScenarioConfig> scenarios = new ArrayList<>();
        List<String> scenarioFiles = Arrays.asList(
                "src/test/resources/happy-case.json");
        for (String file : scenarioFiles) {
            scenarios.addAll(objectMapper().readValue(new File(file), typeReference));
        }
        return scenarios;
    }

    @ParameterizedTest
    @MethodSource("generateInputs")
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    public void contextLoads(ScenarioConfig scenarioConfig) throws InterruptedException, JSONException, ExecutionException, IOException {
        ManagedChannel managedChannel = ManagedChannelBuilder
                .forAddress("localhost", grpcPort)
                .usePlaintext().build();
        KenoServiceGrpc.KenoServiceBlockingStub blockingStub = KenoServiceGrpc.newBlockingStub(managedChannel);
        integrationTestWorker.startTest(scenarioConfig, blockingStub);
    }

    static ObjectMapper objectMapper() {
        ObjectMapper om = new ObjectMapper();
        om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        om.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        om.setVisibility(PropertyAccessor.SETTER, JsonAutoDetect.Visibility.NONE);
        om.setVisibility(PropertyAccessor.GETTER, JsonAutoDetect.Visibility.NONE);
        om.setVisibility(PropertyAccessor.IS_GETTER, JsonAutoDetect.Visibility.NONE);
        om.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        return om;
    }

}
