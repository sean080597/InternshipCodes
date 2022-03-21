package com.csc.gdn.integralpos.batch.reader;

import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.model.PostalCodeModel;
import com.csc.gdn.integralpos.batch.service.PostalCodeService;

@Component
public class PostalCodeReader implements ItemReader<List<PostalCodeModel>>{
	
	@Autowired
	private PostalCodeService postalCodeService;

	@Override
	public List<PostalCodeModel> read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		if(!postalCodeService.getBatchJobState()){
			postalCodeService.toggleBatchJobState();
			return postalCodeService.readCSVFile();
		}
		return null;
	}
}
