package com.programming.technie.nats_pub.controller;

import com.programming.technie.nats_pub.publisher.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private Publisher publisherService;

    @GetMapping("/publish")
    public String publishMessage(@RequestParam String message) {
        publisherService.sendMessage("order_updates", message);
        return "Message sent: " + message;
    }
}
