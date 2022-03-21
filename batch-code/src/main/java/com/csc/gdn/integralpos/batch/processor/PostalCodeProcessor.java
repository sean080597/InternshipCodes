package com.csc.gdn.integralpos.batch.processor;

import java.util.ArrayList;
import java.util.List;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.model.PostalCodeModel;
import com.csc.gdn.integralpos.batch.service.PostalCodeService;

@Component
public class PostalCodeProcessor implements ItemProcessor<List<PostalCodeModel>, List<PostalCodeModel>>{
	
	@Autowired
	private PostalCodeService postalCodeService;
	
	@Override
	public List<PostalCodeModel> process(List<PostalCodeModel> data) throws Exception {
		return data;
	}
}
