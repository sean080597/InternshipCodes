package com.programming.technie.nats_pub.controller;

import com.programming.technie.nats_base.enums.NatsEnum;
import io.nats.client.*;
import io.nats.client.api.*;
import io.nats.client.impl.NatsMessage;
import io.nats.client.support.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
public class MessageController {

    private final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private Connection natsConnection;

    @Autowired
    private Map<String, Map<String, String>> queueNames;

    private static final String STREAM_NAME = NatsEnum.STREAM_NAME.label;
    private static final String CONSUMER_1 = "orderNew";
    private static final String CONSUMER_SUBJECT_1 = STREAM_NAME + "." + CONSUMER_1;

    private static final int CONSUMER_1_DEFAULT_MESSAGE_FETCH_COUNT = 1;
    private static final int CONSUMER_2_DEFAULT_MESSAGE_FETCH_COUNT = 1;
    private static final int CONSUMER_2_DEFAULT_SEQUENCE_ID = 0;
    private static final int SUBSCRIBER_FETCH_TIMEOUT_IN_SECONDS = 3;

    private static final String CONSUME_BY_SEQUENCE = "ConsumeBySequence";

    private static final String DEFAULT_MESSAGE = "default message";

    private final DateTimeFormatter zdtFormatter = DateTimeFormatter.ISO_INSTANT;

    /**
     * Get the stream information
     */
    @GetMapping(value = "/stream-info")
    public Map<String, Object> getStreamInfo() throws IOException, JetStreamApiException {
        Map<String, Object> mapped = new HashMap<>();
        mapped.put("streams", natsConnection.jetStreamManagement().getStreamNames());
        mapped.put("consumers of 1st stream", natsConnection.jetStreamManagement().getConsumerNames(STREAM_NAME));
        return mapped;
    }

    /**
     * Publishes a message to the stream
     *
     * @param message
     * @return
     * @throws IOException
     */
    @GetMapping("/pub/{message}")
    public Map<String, Object> publishMessage(@PathVariable String message) throws IOException {
        if (message == null) {
            message = DEFAULT_MESSAGE;
        }

        JetStream js = natsConnection.jetStream();

        try {
            /* publish the message to the stream */
//            PublishAck pubAck = js.publish(CONSUMER_SUBJECT_1, message.getBytes(StandardCharsets.UTF_8));
            Map<String, String> queueInfos = queueNames.get("eodCardActivationReminderQueue");
//            PublishAck pubAck = js.publish(queueInfos.get("queues"), message.getBytes(StandardCharsets.UTF_8));
//            JsonUtils.printFormatted(pubAck);

            Message msg = NatsMessage.builder().subject(queueInfos.get("queues")).data(message, StandardCharsets.UTF_8).build();
            CompletableFuture<PublishAck> future = js.publishAsync(msg);
            future.whenComplete((ack, ex) -> {
                if (ex != null || (ack != null && ack.getStream() != null)) {
                    System.out.println("ack => " + ack);
                }
            });

            return getStreamInfo();

        } catch (JetStreamApiException ex) {
            logger.error(ex.getMessage(), ex);
        }
        return null;
    }

    /**
     * Request <i>count</i> messages from the subscription/.
     *
     * @param count
     * @return
     */
    @GetMapping(value = {"/consumer"})
    public List<String> consumer1(@RequestParam("count") Integer count) {

        if (count == null) {
            count = CONSUMER_1_DEFAULT_MESSAGE_FETCH_COUNT;
        }

        try {
            /* get a JetStream instance */
            JetStream js = natsConnection.jetStream();

            /* configure a Consumer */
            ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder()
                    .durable(CONSUMER_1)
                    .deliverSubject(CONSUMER_SUBJECT_1)
                    .build();

            /* create the pull options */
            PullSubscribeOptions pullOptions = PullSubscribeOptions.builder().configuration(consumerConfig).build();

            /* create the subscription */
            JetStreamSubscription subscription = js.subscribe(CONSUMER_SUBJECT_1, pullOptions);

            /* fetch n messages from the subscription. Timeout after some period if no messages become available */
            List<Message> messages = subscription.fetch(count, Duration.ofSeconds(SUBSCRIBER_FETCH_TIMEOUT_IN_SECONDS));

            /* ACK all received messages */
            for (Message m : messages) {
                m.ack();
            }
            /* before returning the list of message, format them into
             simple strings rather than the full (large) Message. Note
            that if you decide to return the actual Message payload you
            will need to set <i>spring.jackson.serialization.FAIL_ON_EMPTY_BEANS=false</i>
            in the <i>application.properties</i> file.
             */
            return formatMessages(messages);
        } catch (IOException | JetStreamApiException ex) {
            logger.error(ex.getMessage(), ex);
        }
        return null;
    }

    /**
     * create a consumer with the starting message aligned with the
     * <i>startSequenceId</i>. The consumer is configured to use
     * <i>DeliverPolicy.ByStartSequence</i>.
     *
     * @param startSequenceId
     * @param count
     * @return
     */
    @GetMapping(value = {"/consumeBySequence"})
    public List<String> consumer2BySequenceId(@RequestParam("startSequenceId") Integer startSequenceId, @RequestParam("count") Integer count) {

        if (count == null) {
            count = CONSUMER_2_DEFAULT_MESSAGE_FETCH_COUNT;
        }

        if (startSequenceId == null) {
            /* get the current time and subtract some the default hour value */
            startSequenceId = CONSUMER_2_DEFAULT_SEQUENCE_ID;
        }

        try {

            /* create a JetStream instance */
            JetStream js = natsConnection.jetStream();

            /* configure the consumer to use the <i>DeliverPolicy.ByStartSequence</i>. */
            ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder()
                    .durable(CONSUME_BY_SEQUENCE)
                    .deliverPolicy(DeliverPolicy.ByStartSequence)
                    .startSequence(startSequenceId)
                    .replayPolicy(ReplayPolicy.Instant)
                    .build();

            /* configure the pull options */
            PullSubscribeOptions pullOptions = PullSubscribeOptions.builder().configuration(consumerConfig).build();

            /* create the subscription */
            JetStreamSubscription subscription = js.subscribe(CONSUMER_SUBJECT_1, pullOptions);

            /* retrieve <i>count</i> messages from the subscription. Timeout if sufficient messages aren't available */
            List<Message> messages = subscription.fetch(count, Duration.ofSeconds(SUBSCRIBER_FETCH_TIMEOUT_IN_SECONDS));

            /* return format the messages*/
            return formatMessages(messages);

        } catch (IOException | JetStreamApiException ex) {
            logger.error(ex.getMessage(), ex);
        }
        return null;
    }

    /**
     * This method reduces the comprehensive NATS message into a simple string
     * containing the timestamp, and message.
     *
     * @param messages
     * @return
     */
    private List<String> formatMessages(List<Message> messages) {
        messages.forEach(m -> System.out.println(m.metaData() + "/" + (new String(m.getData(), StandardCharsets.UTF_8))));
        return messages.stream()
                .map(m -> String.format("%s : <%s>", m.metaData().timestamp().format(zdtFormatter), new String(m.getData(), StandardCharsets.UTF_8)))
                .collect(Collectors.toList());

    }
}
