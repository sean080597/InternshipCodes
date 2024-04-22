package com.programming.technie.springkafkademo.controller;

import com.programming.technie.springkafkademo.producer.MessageProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {

    @Autowired
    private MessageProducer messageProducer;

    @PostMapping("/send")
    public String sendMessage(@RequestParam("message") String message) {
        messageProducer.sendMessage("topic-demo", message);
        return "Message sent: " + message;
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publishMessage(@RequestParam("message") String message) {
        for (int i = 0; i < 10000; i++) {
            messageProducer.sendMessage("topic-demo", message + ": " + i);
        }
        return ResponseEntity.ok("Messages published successfully");
    }
}
