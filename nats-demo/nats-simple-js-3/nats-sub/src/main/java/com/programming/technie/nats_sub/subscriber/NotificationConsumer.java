package com.programming.technie.nats_sub.subscriber;

import com.programming.technie.nats_base.annotations.NatsListener;
import com.programming.technie.nats_sub.dto.NotificationInfo;
import io.nats.client.Message;
import io.nats.client.MessageHandler;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class NotificationConsumer extends BaseConsumer<NotificationInfo> implements MessageHandler {

    public void onMessage(NotificationInfo object) throws Exception {
        System.out.println("Notification infofofofof: {}" + object);
    }

    @NatsListener(
            subject = "#{queueNames.notificationQueue.queues}",
            durableName = "#{queueNames.notificationQueue.id}",
            consumerGroup = "#{queueNames.notificationQueue.group}"
    )
    public void notifyMessage(Message msg){
        System.out.println("xyz xyzxyzxyz: " + new String(msg.getData(), StandardCharsets.UTF_8));
    }

    @Override
    public void onMessage(Message message) throws InterruptedException {
        System.out.println("Notification infofofofof: {}" + message);

    }
}
