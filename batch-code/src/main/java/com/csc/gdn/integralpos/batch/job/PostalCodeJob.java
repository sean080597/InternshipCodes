package com.csc.gdn.integralpos.batch.job;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.batch.operations.JobRestartException;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.ItemProcessListener;
import org.springframework.batch.core.ItemReadListener;
import org.springframework.batch.core.ItemWriteListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.listener.GenericItemListener;
import com.csc.gdn.integralpos.batch.listener.PostalCodeJobListener;
import com.csc.gdn.integralpos.batch.model.PostalCodeModel;
import com.csc.gdn.integralpos.batch.processor.PostalCodeProcessor;
import com.csc.gdn.integralpos.batch.reader.PostalCodeReader;
import com.csc.gdn.integralpos.batch.writer.PostalCodeWriter;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Component
public class PostalCodeJob {
	private AtomicBoolean enabled = new AtomicBoolean(false);
		
	@Value("${spring.data.elasticsearch.chunkSize}")
    private int chunkSize;
	
	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;

	@Bean
	public PostalCodeReader postReader() {
		return new PostalCodeReader();
	};
	
	@Bean
	public PostalCodeProcessor postProcessor() {
		return new PostalCodeProcessor();
	};
	
	@Bean
	public PostalCodeWriter postWriter() {
		return new PostalCodeWriter();
	};
	
	@Bean
	public PostalCodeJobListener postListener() {
	  return new PostalCodeJobListener();
	}
	
	@Bean
	public GenericItemListener<List<PostalCodeModel>, List<PostalCodeModel>> genericPostListener() {
	  return new GenericItemListener(PostalCodeJob.class);
	}
	
	@Bean(name = "postJob")
	public Job postJob() {
		Step step1 = stepBuilderFactory.get("PostalCodeStep")
				.<List<PostalCodeModel>, List<PostalCodeModel>> chunk(chunkSize)
				.reader(postReader())
				.listener((ItemReadListener<List<PostalCodeModel>>)genericPostListener())
				.processor(postProcessor())
				.listener((ItemProcessListener<List<PostalCodeModel>, List<PostalCodeModel>>)genericPostListener())
				.writer(postWriter())
				.listener((ItemWriteListener<List<PostalCodeModel>>)genericPostListener())
				.build();
		Job job = jobBuilderFactory.get("PostalCodeJob")
				.incrementer(new RunIdIncrementer())
				.listener(postListener())
				.flow(step1)
				.end()
				.build();
		return job;
	}
	
	@Scheduled(cron = "${spring.batch.cronEpayJob}")
	public void schedule() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException{
		try {
			if(enabled.get()) {
				JobParameters params = new JobParametersBuilder()
						.addString("JobID", String.valueOf(System.currentTimeMillis()))
						.addString("Wish", "Pray to run successfully")
						.addString("JobName", postJob().getName())
						.toJobParameters();
				jobLauncher.run(postJob(), params);
			}
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}
	
	public boolean toggle() {
        enabled.set(!enabled.get());
        SecurityUtil.logMessage("TOGGLED '" + enabled.get() + "' SCHEDULE ON PostalCodeJob");
        return enabled.get();
    }
}
