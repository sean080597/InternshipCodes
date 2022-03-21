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
import com.csc.gdn.integralpos.batch.listener.QuotationUpdateJobListener;
import com.csc.gdn.integralpos.batch.processor.QuotationUpdateProcessor;
import com.csc.gdn.integralpos.batch.reader.QuotationUpdateReader;
import com.csc.gdn.integralpos.batch.tasklet.FileWritingTasklet;
import com.csc.gdn.integralpos.batch.writer.QuotationUpdateWriter;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Component
public class QuotationUpdateJob {
	
	private AtomicBoolean enabled = new AtomicBoolean(false);
	
	private Log logger = LogFactory.getLog(QuotationUpdateJob.class);
	
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
	public QuotationUpdateJob(@Value("${spring.batch.job.isSchedule}") boolean isSchedule) {
		super();
		this.enabled.set(isSchedule);
	}

	@Bean
	public QuotationUpdateReader quoteReader() {
		return new QuotationUpdateReader();
	};
	
	@Bean
	public QuotationUpdateProcessor quoteProcessor() {
		return new QuotationUpdateProcessor();
	};
	
	@Bean
	public QuotationUpdateWriter quoteWriter() {
		return new QuotationUpdateWriter();
	};
	
	@Bean
	public QuotationUpdateJobListener quoteListener() {
	  return new QuotationUpdateJobListener(QuotationUpdateJob.class);
	}
	
	@Bean
	public GenericItemListener<List<PNCQuotationModel>, List<PNCQuotationModel>> genericQuoListener() {
	  return new GenericItemListener(QuotationUpdateJob.class);
	}
	
	@Bean
	public FileWritingTasklet quoteTaskletWritingLog() {
		return new FileWritingTasklet(QuotationUpdateJob.class);
	};
	
	@Bean(name = "quoteJob")
	public Job quotationJob() {
		Step step1 = stepBuilderFactory.get("quotationUpdateStep")
				.<List<PNCQuotationModel>, List<PNCQuotationModel>> chunk(chunkSize)
				.reader(quoteReader())
				.listener((ItemReadListener<List<PNCQuotationModel>>)genericQuoListener())
				.processor(quoteProcessor())
				.listener((ItemProcessListener<List<PNCQuotationModel>, List<PNCQuotationModel>>)genericQuoListener())
				.writer(quoteWriter())
				.listener((ItemWriteListener<List<PNCQuotationModel>>)genericQuoListener())
				.build();
		Job job = jobBuilderFactory.get("quotationUpdateJob")
				.incrementer(new RunIdIncrementer())
				.listener(quoteListener())
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
						.addString("JobName", quotationJob().getName())
						.toJobParameters();
				jobLauncher.run(quotationJob(), params);
			}
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}
	
	public boolean toggle() {
        enabled.set(!enabled.get());
        logger.info("TOGGLED '" + enabled.get() + "' SCHEDULE ON QuotationUpdateJob");
        return enabled.get();
    }
}
