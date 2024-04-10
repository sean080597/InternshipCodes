package com.programming.technie.controller;

import lombok.AllArgsConstructor;
import org.redisson.api.RBucket;
import org.redisson.api.RMap;
import org.redisson.api.RedissonClient;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/redis")
public class RedisController {

   private CacheManager cacheManager;
    private RedissonClient redisson;

    @GetMapping("test")
    public void test() {
        RBucket<String> bucket = redisson.getBucket("stringObj");
        bucket.set("Rommel is the object value");
        RMap<String, String> map = redisson.getMap("theMap");
        map.put("mapKey", "Risa is map value");

        String objValue = bucket.get();
        System.out.println("The object value is: " + objValue);
        String mapValue = map.get("mapKey");
        System.out.println("The map value is: " + mapValue);
    }

   @GetMapping("check")
   public boolean check() {
       return cacheManager instanceof RedissonSpringCacheManager;
   }
}
