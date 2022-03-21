package com.csc.gdn.integralpos.batch.job;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.batch.operations.JobRestartException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

import com.csc.gdn.integralpos.batch.listener.EpayRecoveryJobListener;
import com.csc.gdn.integralpos.batch.listener.GenericItemListener;
import com.csc.gdn.integralpos.batch.processor.EpayRecoveryProcessor;
import com.csc.gdn.integralpos.batch.reader.EpayRecoveryReader;
import com.csc.gdn.integralpos.batch.writer.EpayRecoveryWriter;
import com.csc.gdn.integralpos.domain.payment.PaymentModel;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Component
public class EpayRecoveryJob {
	
	private AtomicBoolean enabled = new AtomicBoolean(false);
	private Log logger = LogFactory.getLog(EpayRecoveryJob.class);
	
	@Value("${spring.data.elasticsearch.chunkSize}")
	private int chunkSize;
	
	@Autowired
    private JobLauncher jobLauncher;
	
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	
	// constructor
	@Autowired
	public EpayRecoveryJob(@Value("${spring.batch.job.isSchedule}") boolean isSchedule) {
		super();
		this.enabled.set(isSchedule);
	}

	@Bean
	public EpayRecoveryReader epayReader() {
		return new EpayRecoveryReader();
	};
	
	@Bean
	public EpayRecoveryProcessor epayProcessor() {
		return new EpayRecoveryProcessor();
	};
	
	@Bean
	public EpayRecoveryWriter epayWriter() {
		return new EpayRecoveryWriter();
	};
	
	@Bean
	public EpayRecoveryJobListener epayListener() {
	  return new EpayRecoveryJobListener(EpayRecoveryJob.class);
	}
	
	@Bean
	public GenericItemListener<List<PaymentModel>, List<String>> genericEpayListener() {
	  return new GenericItemListener(EpayRecoveryJob.class);
	}
	
	@Bean(name = "epayJob")
	public Job epayJob() {
		Step step1 = stepBuilderFactory.get("epayRecoveryStep")
				.<List<PaymentModel>, List<String>> chunk(chunkSize)
				.reader(epayReader())
				.listener((ItemReadListener<List<PaymentModel>>)genericEpayListener())
				.processor(epayProcessor())
				.listener((ItemProcessListener<List<PaymentModel>, List<String>>)genericEpayListener())
				.writer(epayWriter())
				.listener((ItemWriteListener<List<String>>)genericEpayListener())
				.build();
		Job job = jobBuilderFactory.get("epayRecoveryJob")
				.incrementer(new RunIdIncrementer())
				.listener(epayListener())
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
						.addString("JobName", epayJob().getName())
						.toJobParameters();
				jobLauncher.run(epayJob(), params);
			}
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}
	
	public boolean toggle() {
        enabled.set(!enabled.get());
        logger.info("TOGGLED '" + enabled.get() + "' SCHEDULE ON EpayRecoveryJob");
        return enabled.get();
    }
}
