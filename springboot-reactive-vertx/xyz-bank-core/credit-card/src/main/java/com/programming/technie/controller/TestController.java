package com.programming.technie.controller;

import com.programming.technie.model.CommonCard;
import com.programming.technie.util.FishTagUtil;
import com.programming.technie.util.LogUtil;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

@RestController
@AllArgsConstructor
@RequestMapping("api/cc")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("{name}")
    public Mono<String> getName(@PathVariable String name) {
        return Mono.just(String.format("finding restaurants for %s", name));
    }

    @PostMapping
    public Mono<CommonCard> createItem(@RequestBody CommonCard user) {
        return Mono.just(user);
    }
}
