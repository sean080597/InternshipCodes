package com.programming.technie.nats_sub.subscriber;

import com.programming.technie.nats_base.annotations.NatsListener;
import com.programming.technie.nats_sub.dto.UserInfo;
import io.nats.client.*;
import io.nats.client.support.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@NatsListener(
        subject = "#{queueNames.retrieveItemAndPushToQueueServiceQueue.queues}",
        durableName = "#{queueNames.retrieveItemAndPushToQueueServiceQueue.id}",
        consumerGroup = "#{queueNames.retrieveItemAndPushToQueueServiceQueue.group}"
)
public class Subscriber extends BaseConsumer<UserInfo> {

    //    @Override
    public void onMessage(Message msg) throws InterruptedException {
        if (msg.isJetStream()) {
            msg.ack();
            System.out.print(" " + new String(msg.getData(), StandardCharsets.UTF_8) + "\n");
        } else if (msg.isStatusMessage()) {
            System.out.print(" !" + msg.getStatus().getCode() + "!");
        }
        JsonUtils.printFormatted(msg.metaData());
    }

    @Override
    public void onMessage(UserInfo object) throws Exception {
        System.out.println("User infofofofof: {}" + object);
    }
}
