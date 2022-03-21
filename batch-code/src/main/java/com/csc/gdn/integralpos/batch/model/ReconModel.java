package com.csc.gdn.integralpos.batch.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
//@Setting(settingPath = "/settings/analyzer_keyword_lowercase.json")
@Document(indexName = "reconci", type = "reconciliation")
public class ReconModel {
		
	@JsonIgnore
	public String getDocNamePrefix() {
		return null;
	}
	
	@Id
	private String id;
	
	private String jobName;
	private String fileName;
	private Date startDate;
	private Date endDate;
	private String status;
	private List<ReconTransModel> content;
	
	
}
