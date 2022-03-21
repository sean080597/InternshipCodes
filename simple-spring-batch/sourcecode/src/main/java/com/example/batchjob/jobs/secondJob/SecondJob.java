package com.example.batchjob.jobs.secondJob;

import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.batch.core.ItemProcessListener;
import org.springframework.batch.core.ItemReadListener;
import org.springframework.batch.core.ItemWriteListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import com.example.batchjob.listener.GenericItemListener;
import com.example.batchjob.listener.JobCompletionListener;

@Configuration
public class SecondJob {
	
	private AtomicBoolean enabled = new AtomicBoolean(false);

	@Value("${spring.batch.chunkSize}")
	private int chunkSize;
	
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	
	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	public SecondJob(@Value("${spring.batch.job.isSchedule}") boolean isSchedule) {
		this.enabled.set(isSchedule);
	}
	
	@Bean
	public JobReader secondReader() {
		return new JobReader();
	};
	
	@Bean
	public JobProcessor secondProcessor() {
		return new JobProcessor();
	};
	
	@Bean
	public JobWriter secondWriter() {
		return new JobWriter();
	};
	
	@Bean
	public GenericItemListener<String, String> genericListenerSecondJob() {
	  return new GenericItemListener<String, String>();
	}
	
	@Bean(name = "secondJobObj")
	public Job initJob() {
		Step step1 = stepBuilderFactory.get("secondJobStep").<String, String>chunk(chunkSize)
				.reader(secondReader())
				.listener((ItemReadListener<String>) genericListenerSecondJob())
				.processor(secondProcessor())
				.listener((ItemProcessListener<String, String>) genericListenerSecondJob())
				.writer(secondWriter())
				.listener((ItemWriteListener<String>) genericListenerSecondJob()).build();
		Job job = jobBuilderFactory.get("secondJob").listener(new JobCompletionListener()).flow(step1).end().build();
		return job;
	}
	
	public void launchJob() {
		try {
			JobParameters params = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis()))
					.addString("Wish", "Pray to run successfully")
					.addString("JobName", initJob().getName())
					.toJobParameters();
			jobLauncher.run(initJob(), params);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Scheduled(cron = "${spring.batch.cronSimpleJob}")
	public void scheduleJob() {
		if(enabled.get()) {
			this.launchJob();
		}
	}
}
