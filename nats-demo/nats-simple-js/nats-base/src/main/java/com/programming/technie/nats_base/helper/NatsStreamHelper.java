package com.programming.technie.nats_base.helper;

import io.nats.client.JetStreamManagement;
import io.nats.client.api.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;

public class NatsStreamHelper {

    @Autowired
    private JetStreamManagement jetStreamManagement;

    /**
     * Stream configuration for persistent storage with default settings for unlimited message retention.
     * <p>
     * - retentionPolicy: RetentionPolicy.Limits - messages are retained based on the specific limits <br>
     * - storageType: StorageType.File - Persistent storage on disk <br>
     * - discardPolicy: DiscardPolicy.Old - Discard the oldest messages when storage limit is hit <br>
     * - maxBytes: -1L - No limit on storage size <br>
     * - maxConsumers: -1L - Allow unlimited consumers <br>
     * - maxMsgs: -1L - No limit on the number of messages <br>
     * - maxMsgsPerSubject: -1L - No limit on the number of messages per subject
     * - noAck: false - Require acknowledgments by default (true - messages will be removed from the stream after delivery)
     * </p>
     */
    public void createStream() throws Exception {
        StreamConfiguration streamConfig = StreamConfiguration.builder()
                .name("NatsPersistentStream")
                .subjects("orders.*")
                .maxAge(Duration.ofDays(365)) // Retain messages up to 1 year (adjust as needed)
                .build();

        jetStreamManagement.addStream(streamConfig);  // Create stream if it doesn’t exist
    }

}
