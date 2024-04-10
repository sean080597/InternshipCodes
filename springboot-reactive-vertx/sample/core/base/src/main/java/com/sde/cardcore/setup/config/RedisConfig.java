package com.xyz.cardcore.setup.config;

import java.io.IOException;
import java.io.InputStream;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.codec.FstCodec;
import org.redisson.config.ClusterServersConfig;
import org.redisson.config.Config;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.xyz.modelsuite.util.SpringBeanUtil;
import com.xyz.modelsuite.util.StringUtil;

@Configuration
public class RedisConfig
{
    private static Logger log = LoggerFactory.getLogger(RedisConfig.class);

    @Autowired
    Environment env;
    
    @Bean(destroyMethod = "shutdown")
    @ConditionalOnProperty(prefix="redis", name="cluster.enabled", havingValue="true")
    public RedissonClient redissonClientCluster()
    {
        Config config;

        try
        {
            InputStream is = AppConfig.class.getClassLoader().getResourceAsStream("redisson.json");

            if (is != null)
            {
                config = Config.fromYAML(is);
            }
            else
            {
                config = new Config();
            }

            String ip = System.getProperty("redis.ip");
            String port = System.getProperty("redis.port");
            String password = env.getProperty("redis.password");
            String redis = "redis";
            String protocol = System.getProperty("redis.security.protocol");
            Integer nettyThread = Integer.getInteger("redis.netty.thread");
            Integer masterConnectionMax = Integer.getInteger("redis.cluster.master.connection.max");
            Integer masterConnectionMin = Integer.getInteger("redis.cluster.master.connection.min");
            Integer slaveConnectionMax = Integer.getInteger("redis.cluster.slave.connection.max");
            Integer slaveConnectionMin = Integer.getInteger("redis.cluster.slave.connection.min");
            
            if(StringUtil.hasValue(protocol) && "true".equals(protocol)) {
            	redis = "rediss";
    		}
            
            ClusterServersConfig clusterConfig = config.useClusterServers();
            
            if (ip != null && port != null)
            {
            	clusterConfig.addNodeAddress(redis + "://" + ip + ":" + port);
            	clusterConfig.setMasterConnectionMinimumIdleSize(1);
            }
            else
            {

            	clusterConfig.addNodeAddress("redis://redis.dev.cardx.aliyun.xyzcloud.tech:14101");
            	clusterConfig.setMasterConnectionMinimumIdleSize(1);
            }

            if (password != null)
            {
                // this is special handle for SIT, define the key, but no value
                if (StringUtil.hasValue(password))
                {
                	clusterConfig.setPassword(password);
                }
            }
            else
            {
            	clusterConfig.setPassword("Pikachu@9394");
            }

            // default is 3s, set to 30s
            clusterConfig.setTimeout(30000);

            // set ping interval to 5s
            clusterConfig.setPingConnectionInterval(5000);
            
            //Remove monitoring for dns as cluster topology will actually check for DNS again, making this pointless to have under cluster environment
            config.useClusterServers().setDnsMonitoringInterval(-1);
            //Don't scan too frequent, setting to 1min to test out and see the frequency is good or not. This is in order to reduce bombarding the external DNS with queries also.
            config.useClusterServers().setScanInterval(60000);


			// set connect timeout, default 10s
            config.useClusterServers().setConnectTimeout(60000);
            
            // set retry attempts, default 3 times
            // retry for 5minutes (default retry interval is 1.5s x 200times = 300s == 5min)
            config.useClusterServers().setRetryAttempts(200); 
            if(nettyThread != null)
            {
            	config.setNettyThreads(nettyThread);
            }
            
            if(masterConnectionMax != null)
            {
            	clusterConfig.setMasterConnectionPoolSize(masterConnectionMax);
            }
            
            if(masterConnectionMin != null)
            {
            	clusterConfig.setMasterConnectionMinimumIdleSize(masterConnectionMin);
            }
            
            if(slaveConnectionMax != null)
            {
            	clusterConfig.setSlaveConnectionPoolSize(slaveConnectionMax);
            }
            
            if(slaveConnectionMin != null)
            {
            	clusterConfig.setSlaveConnectionMinimumIdleSize(slaveConnectionMin);
            }
            
            config.setCodec(new FstCodec());
            
            log.info("Redis URL = '" + config.useClusterServers().toString() + "'");

            return Redisson.create(config);
        }
        catch (IOException e)
        {
            log.error(e.getMessage(), e);
        }
        return null;
    }
    
    @Bean(destroyMethod = "shutdown")
    @ConditionalOnMissingBean(RedissonClient.class)
    public RedissonClient redisson()
    {
        Config config;

        try
        {
            InputStream is = RedisConfig.class.getClassLoader().getResourceAsStream("redisson.yml");

            if (is != null)
            {
                config = Config.fromYAML(is);
            }
            else
            {
                config = new Config();
            }

            String ip = System.getProperty("redis.ip");
            String port = System.getProperty("redis.port");
            String password = System.getProperty("redis.password");
            Integer nettyThread = Integer.getInteger("redis.netty.thread");

            if (ip != null && port != null)
            {
                config.useSingleServer().setAddress("redis://" + ip + ":" + port);
                config.useSingleServer().setConnectionMinimumIdleSize(1);
            }
            else
            {
                if (config.useSingleServer().getAddress() == null || !StringUtil.hasValue(config.useSingleServer().getAddress().toString()))
                {
                    config.useSingleServer().setAddress("redis://redis.dev.cardx.aliyun.xyzcloud.tech:14101");
                    config.useSingleServer().setConnectionMinimumIdleSize(1);
                }
            }

            if (password != null)
            {
                // this is special handle for SIT, define the key, but no value
                if (StringUtil.hasValue(password))
                {
                    config.useSingleServer().setPassword(password);
                }
            }
            else
            {
                config.useSingleServer().setPassword("Pikachu@9394");
            }

            if(nettyThread != null)
            {
                config.setNettyThreads(nettyThread);
            }

            
            // default is 3s, set to 30s
            config.useSingleServer().setTimeout(30000);

            // set connect timeout, default 10s
            config.useSingleServer().setConnectTimeout(60000);

            // set retry attempts, default 3 times
            // retry for 5minutes (default retry interval is 1.5s x 200times = 300s == 5min)
            config.useSingleServer().setRetryAttempts(200); 
            
            // force to this FstCodec, newer version of redisson will default to MarshallingCodec
            config.setCodec(new FstCodec());

            // default is 0, set ping interval to 5s
//            config.useSingleServer().setPingConnectionInterval(5000);

            log.info("Redis URL = '" + config.useSingleServer().getAddress().toString() + "'");

            return Redisson.create(config);
        }
        catch (IOException e)
        {
            log.error(e.getMessage(), e);
        }
        return null;
    }
    
    

    @Bean
    public CacheManager cacheManager()
    {
        return new RedissonSpringCacheManager(SpringBeanUtil.getBean(RedissonClient.class));
    }

}