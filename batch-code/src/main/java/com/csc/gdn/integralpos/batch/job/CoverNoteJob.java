package com.csc.gdn.integralpos.batch.job;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.batch.operations.JobRestartException;

import org.codehaus.jettison.json.JSONObject;
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

import com.csc.gdn.integralpos.batch.listener.CoverNoteJobListener;
import com.csc.gdn.integralpos.batch.listener.GenericItemListener;
import com.csc.gdn.integralpos.batch.processor.CoverNoteProcessor;
import com.csc.gdn.integralpos.batch.reader.CoverNoteReader;
import com.csc.gdn.integralpos.batch.writer.CoverNoteWriter;
import com.csc.gdn.integralpos.common.validation.ValidateContants;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Component
public class CoverNoteJob {
	private AtomicBoolean enabled = new AtomicBoolean(false);
	
	@Autowired
    private JobLauncher jobLauncher;
	
	@Value("${spring.data.elasticsearch.chunkSize}")
    private int chunkSize;
	
	@Value("${deploymentRegion}")
    private int deploymentRegion;
	
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	
	// constructor
	@Autowired
	public CoverNoteJob(@Value("${spring.batch.job.isSchedule}") boolean isSchedule) {
		super();
		this.enabled.set(isSchedule);
	}

	@Bean
	public CoverNoteReader coverReader() {
		return new CoverNoteReader();
	};
	
	@Bean
	public CoverNoteProcessor coverProcessor() {
		return new CoverNoteProcessor();
	};
	
	@Bean
	public CoverNoteWriter coverWriter() {
		return new CoverNoteWriter();
	};
	
	@Bean
	public CoverNoteJobListener coverListener() {
	  return new CoverNoteJobListener();
	}
	
	@Bean
	public GenericItemListener<List<PNCQuotationModel>, Map<String, List<?>>> genericCoverListener() {
	  return new GenericItemListener(CoverNoteJob.class);
	}
	
	@Bean(name = "coverJob")
	public Job coverJob() {
		Step step1 = stepBuilderFactory.get("CoverStep")
				.<List<PNCQuotationModel>, Map<String, List<?>>> chunk(chunkSize)
				.reader(coverReader())
				.listener((ItemReadListener<List<PNCQuotationModel>>)genericCoverListener())
				.processor(coverProcessor())
				.listener((ItemProcessListener<List<PNCQuotationModel>, Map<String, List<?>>>)genericCoverListener())
				.writer(coverWriter())
				.listener((ItemWriteListener<Map<String, List<?>>>)genericCoverListener())
				.build();
		Job job = jobBuilderFactory.get("CoverJob")
				.incrementer(new RunIdIncrementer())
				.listener(coverListener())
				.flow(step1)
				.end()
				.build();
		return job;
	}
	
	@Scheduled(cron = "${spring.batch.cronCoverNoteJob}")
	public void schedule() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException{
		try {
			if(enabled.get() && Integer.valueOf(deploymentRegion) == ValidateContants.MY_REGION) {
				JobParameters params = new JobParametersBuilder()
						.addString("JobID", String.valueOf(System.currentTimeMillis()))
						.addString("Wish", "Pray to run successfully")
						.addString("JobName", coverJob().getName())
						.toJobParameters();
				jobLauncher.run(coverJob(), params);
			}
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}
	
	public boolean toggle() {
        enabled.set(!enabled.get());
        SecurityUtil.logMessage("TOGGLED '" + enabled.get() + "' SCHEDULE ON CoverNoteJob");
        return enabled.get();
    }
}
