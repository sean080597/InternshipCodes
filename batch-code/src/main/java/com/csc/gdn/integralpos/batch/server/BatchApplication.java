/**
 * 
 */
package com.csc.gdn.integralpos.batch.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchAutoConfiguration;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jms.annotation.EnableJms;

import com.csc.gdn.integralpos.batch.service.BatchQuoteService;

/**
 * @author CuongLuu(cluu2)
 *
 */
@EnableEurekaClient
@EnableDiscoveryClient
//@EnableResourceServer
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class, ElasticsearchAutoConfiguration.class,
		ElasticsearchDataAutoConfiguration.class, ElasticsearchRepositoriesAutoConfiguration.class })
@ComponentScan(basePackages = "com.csc.gdn.integralpos.batch")
@EnableCaching
@EnableJms
@ConfigurationPropertiesScan("com.csc.gdn.integralpos.batch.properties")
// implement CommandLineRunner to run deploy and run job in command line mode
public class BatchApplication implements CommandLineRunner {

	@Value("${spring.batch.cmdEnabled}")
	private boolean cmdEnabled;

	private Log logger = LogFactory.getLog(BatchApplication.class);
	
	@Autowired
	private BatchQuoteService batchQuoteService;

	public static void main(String[] args) {
		SpringApplication.run(BatchApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
//    	System.out.println("args1 = " + args[1] + " - compare = " + args[1].equals("true"));
		if (cmdEnabled) {
			if (args.length > 1) {
				// quote job
				if (args[0].equals("quoteJob")) {
					if (args[1].equals("true")) {
						batchQuoteService.toggleJob();
					} else {
						batchQuoteService.launchJob();
						System.exit(0);
					}
				}
			} else {
				logger.error("Missing some parameters");
				System.exit(0);
			}
		}
	}
}
