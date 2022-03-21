package com.csc.gdn.integralpos.batch.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import javax.batch.operations.JobRestartException;

import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.job.PostalCodeJob;
import com.csc.gdn.integralpos.batch.model.PostalCodeModel;
import com.csc.gdn.integralpos.batch.repository.PostalCodeRepository;
import com.csc.gdn.integralpos.common.validation.ValidateContants;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

@Service("postalCodeService")
public class PostalCodeServiceImpl implements PostalCodeService{
	
	private AtomicInteger countSuccess = new AtomicInteger(0);
	private AtomicBoolean batchJobState = new AtomicBoolean(false);
	private MultipartFile files[];
	
	@Value("${deploymentRegion}")
    private int deploymentRegion;

	@Autowired
	private RestHighLevelClient client;

	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	@Qualifier("postJob")
	private Job postJob;

	@Autowired
	private PostalCodeJob postalCodeJob;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private PostalCodeRepository postRepository;
	
	@Autowired
	public void setBatchPaymentRepository(PostalCodeRepository postRepository) {
		this.postRepository = postRepository;
	}
	
	@Override
	public PostalCodeModel save(PostalCodeModel postObj) {
		return postRepository.save(postObj);
	}

	@Override
	public int getNextCountRecordsSuccessfully() {
		return countSuccess.getAndIncrement();
	}

	@Override
	public int getCountRecordsSuccessfully() {
		return countSuccess.get();
	}

	@Override
	public void launchJob(MultipartFile files[]) throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
			JobRestartException, JobInstanceAlreadyCompleteException {
		countSuccess.set(0);
		this.files = files;
		try {
			JobParameters params = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis()))
					.addString("Wish", "Pray to run successfully").addString("JobName", postJob.getName())
					.toJobParameters();
			jobLauncher.run(postJob, params);
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean toggleJob() {
		return postalCodeJob.toggle();
	}

	@Override
	public boolean toggleBatchJobState() {
		batchJobState.set(!batchJobState.get());
		SecurityUtil.logMessage("TOGGLED '" + batchJobState.get() + "' ON BatchJobState");
		return batchJobState.get();
	}

	@Override
	public boolean getBatchJobState() {
		return batchJobState.get();
	}
	
	// log percent
	@Override
	public void logPercent(List<PostalCodeModel> lsPostCode) {
		countSuccess.getAndIncrement();
		if(countSuccess.get() == 1 || countSuccess.get() % 1000 == 0 || countSuccess.get() == lsPostCode.size()) {
			SecurityUtil.logMessage("Progress: " + countSuccess.get()*100/lsPostCode.size() + "%");					
		}
	}

	// handle reader CSV file
	@Override
	public List<PostalCodeModel> readCSVFile() throws Exception {
		postRepository.deleteAll();
		List<PostalCodeModel> result = new ArrayList<PostalCodeModel>();
		if(Integer.valueOf(deploymentRegion) == ValidateContants.SG_REGION) {
			result = readPostCodeSG(this.files[0]);
		}else if(Integer.valueOf(deploymentRegion) == ValidateContants.MY_REGION) {
			result = readPostCodeMy(this.files[0]);
		}else if(Integer.valueOf(deploymentRegion) == ValidateContants.IN_REGION) {
			result = readPostCodeIn(this.files[0]);
		}
		return result;
	}
	
	private List<PostalCodeModel> readPostCodeSG(MultipartFile file) throws Exception {
		List<PostalCodeModel> lsPostalCode = new ArrayList<PostalCodeModel>();
		Reader reader = new InputStreamReader(file.getInputStream());
    	CSVReader csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build();
    	SecurityUtil.logMessage("Start generating list post code");
    	// read CSV data & add to list postCode
    	String[] nextLine;
    	while ((nextLine = csvReader.readNext()) != null) {
    		PostalCodeModel postObj = new PostalCodeModel();
    		postObj.setId(nextLine[0] + "_" + nextLine[1]);
            postObj.setPostal_code(nextLine[0]);
            postObj.setBuilding_no(nextLine[1]);
            postObj.setStreet_name(nextLine[2]);
            postObj.setBuilding_name(nextLine[3]);
            // add to list postCode
            lsPostalCode.add(postObj);
        }
    	SecurityUtil.logMessage("Done generating list post code");
    	return lsPostalCode;
	}
	
	private List<PostalCodeModel> readPostCodeMy(MultipartFile file) {
		List<PostalCodeModel> lsPostalCode = new ArrayList<PostalCodeModel>();
		return lsPostalCode;
	}

	private List<PostalCodeModel> readPostCodeIn(MultipartFile file) throws Exception {
		List<PostalCodeModel> lsPostalCode = new ArrayList<PostalCodeModel>();
		Reader reader = new InputStreamReader(file.getInputStream());
    	CSVReader csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build();
    	SecurityUtil.logMessage("Start generating list post code");
    	// read CSV data & add to list postCode
    	String[] nextLine;
    	int i = 0;
    	while ((nextLine = csvReader.readNext()) != null) {
    		PostalCodeModel postObj = new PostalCodeModel();
    		postObj.setId(nextLine[0] + "_" + nextLine[1] + "_" + i);
            postObj.setPostal_code(nextLine[0]);
            postObj.setAddress(nextLine[1]);
            postObj.setSub_district(nextLine[2]);
            postObj.setType(nextLine[3]);
            postObj.setDistrict(nextLine[4]);
            postObj.setProvince(nextLine[5]);
            // add to list postCode
            lsPostalCode.add(postObj);
            i++;
        }
    	SecurityUtil.logMessage("Done generating list post code");
    	return lsPostalCode;
	}
	
	// handle processor CSV file
	@Override
	public List<PostalCodeModel> processCSVFile() {
		// TODO Auto-generated method stub
		return null;
	}

	// handle writer CSV file
	@Override
	public void writeCSVFile(List<PostalCodeModel> lsPostCode) {
		if(Integer.valueOf(deploymentRegion) == ValidateContants.SG_REGION) {
			updatePostCodeSG(lsPostCode);
		}else if(Integer.valueOf(deploymentRegion) == ValidateContants.MY_REGION) {
			updatePostCodeMY();
		}else if(Integer.valueOf(deploymentRegion) == ValidateContants.IN_REGION) {
			updatePostCodeSG(lsPostCode);
		}
	}
	
	private void updatePostCodeSG(List<PostalCodeModel> lsPostCode) {
		BulkRequest bulkRequest = new BulkRequest();
		lsPostCode.forEach(item -> {
			IndexRequest indexRequest = new IndexRequest(BatchConstants.POST_CODE_INDEX, BatchConstants.POST_CODE_TYPE, item.getId())
					.source(objectMapper.convertValue(item, Map.class));
			bulkRequest.add(indexRequest);
			logPercent(lsPostCode);
		});
		try {
			BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
			for (BulkItemResponse bulkItemResponse : bulkResponse) {
			    if (bulkItemResponse.isFailed()) { 
			        SecurityUtil.logMessage(bulkItemResponse.getFailureMessage());
			    }
			}
		}catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void updatePostCodeMY() {
		
	}

}
