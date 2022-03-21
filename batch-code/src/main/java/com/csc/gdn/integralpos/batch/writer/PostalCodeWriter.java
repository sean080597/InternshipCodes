package com.csc.gdn.integralpos.batch.writer;

import java.util.List;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.model.PostalCodeModel;
import com.csc.gdn.integralpos.batch.service.PostalCodeService;

@Component
public class PostalCodeWriter implements ItemWriter<List<PostalCodeModel>> {
	@Autowired
	private PostalCodeService postalCodeService;
	
	@Override
	public void write(List<? extends List<PostalCodeModel>> data) throws Exception {
		if(data.size() > 0) {
			List<PostalCodeModel> resData = data.get(0);
			SecurityUtil.logMessage("Start updating list post code - Count => " + resData.size());
			postalCodeService.writeCSVFile(resData);
			SecurityUtil.logMessage("End updating list post code - Count => " + resData.size());
		}
	}
}
