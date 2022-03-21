package com.csc.gdn.integralpos.batch.model;

import javax.persistence.Id;

import org.springframework.data.elasticsearch.annotations.Document;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;

import lombok.Data;

@Data
@Document(indexName = BatchConstants.POST_CODE_INDEX, type = BatchConstants.POST_CODE_TYPE)
public class PostalCodeModel {
	@Id
	private String id;
	
	private String postal_code;
	
	private String building_no;
	
	private String street_name;
	
	private String building_name;
	
	private String address;
	
	private String sub_district;
	
	private String type;
	
	private String district;
	
	private String province;
	
}
