package com.programming.technie.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisConfig {

    @Bean(destroyMethod = "shutdown")
    @ConditionalOnMissingBean({RedissonClient.class})
    public RedissonClient redisson() {
        String ip = System.getProperty("redis.ip");
        String port = System.getProperty("redis.port");
        String password = System.getProperty("redis.password");

        Config config = new Config();
        String redisUrl = "redis://" + ip + ":" + port;
        config.useSingleServer().setAddress(redisUrl);

        // Set Redis server password if provided
        if (password != null && !password.isEmpty()) {
            config.useSingleServer().setPassword(password);
        }

        return Redisson.create(config);
    }

    @Bean
    public CacheManager cacheManager(RedissonClient redissonClient) {
        return new RedissonSpringCacheManager(redissonClient);
    }
}
