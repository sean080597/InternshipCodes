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

import com.csc.gdn.integralpos.batch.listener.GenericItemListener;
import com.csc.gdn.integralpos.batch.listener.ReconciliationJobListener;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.model.ReconModel;
import com.csc.gdn.integralpos.batch.processor.ReconciliationProcessor;
import com.csc.gdn.integralpos.batch.reader.ReconciliationReader;
import com.csc.gdn.integralpos.batch.writer.ReconciliationWriter;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Component
public class ReconciliationJob {
	
	private AtomicBoolean enabled = new AtomicBoolean(false);
	
	private Log logger = LogFactory.getLog(ReconciliationJob.class);
	
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
	public ReconciliationJob(@Value("${spring.batch.job.isSchedule}") boolean isSchedule) {
		super();
		this.enabled.set(isSchedule);
	}

	@Bean
	public ReconciliationReader reconciReader() {
		return new ReconciliationReader();
	};
	
	@Bean
	public ReconciliationProcessor reconciProcessor() {
		return new ReconciliationProcessor();
	};
	
	@Bean
	public ReconciliationWriter reconciWriter() {
		return new ReconciliationWriter();
	};
	
	@Bean
	public ReconciliationJobListener reconciListener() {
	  return new ReconciliationJobListener(ReconciliationJob.class);
	}
	
	@Bean
	public GenericItemListener<List<ReconModel>, PaymentReportModel> genericReconciListener() {
	  return new GenericItemListener(ReconciliationJob.class);
	}
	
	
	@Bean(name = "reconciJob")
	public Job reconciJob() {
		Step step1 = stepBuilderFactory.get("reconciliationUpdateStep")
				.<List<ReconModel>, PaymentReportModel> chunk(chunkSize)
				.reader(reconciReader())
				.listener((ItemReadListener<List<ReconModel>>)genericReconciListener())
				.processor(reconciProcessor())
				.listener((ItemProcessListener<List<ReconModel>, PaymentReportModel>)genericReconciListener())
				.writer(reconciWriter())
				.listener((ItemWriteListener<PaymentReportModel>)genericReconciListener())
				.build();
		Job job = jobBuilderFactory.get("reconciliationUpdateJob")
				.incrementer(new RunIdIncrementer())
				.listener(reconciListener())
				.flow(step1)
				.end()
				.build();
		return job;
	}
	
	@Scheduled(cron = "${spring.batch.cronQuoteJob}")
	public void schedule() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException{
		try {
			if(enabled.get()) {
				JobParameters params = new JobParametersBuilder()
						.addString("JobID", String.valueOf(System.currentTimeMillis()))
						.addString("Wish", "Pray to run successfully")
						.addString("JobName", reconciJob().getName())
						.toJobParameters();
				jobLauncher.run(reconciJob(), params);
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
