package com.programming.technie.nats_sub.subscriber;

import com.programming.technie.nats_base.annotations.NatsHandler;
import com.programming.technie.nats_base.annotations.NatsListener;
import com.programming.technie.nats_sub.dto.UserInfo;
import io.nats.client.Message;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@NatsListener(
        subject = "#{queueNames.orderQueue.queues}",
        durableName = "#{queueNames.orderQueue.id}",
        consumerGroup = "#{queueNames.orderQueue.group}"
)
public class OrderConsumer extends BaseConsumer<UserInfo> {

    public void onMessage(UserInfo object) throws Exception {
        System.out.println("User infofofofof: {}" + object);
    }

    @NatsHandler
    public void onMessageHandler(Message msg) {
        System.out.println("Message handlerrrrrr: " + new String(msg.getData(), StandardCharsets.UTF_8));
    }
}
