package com.csc.gdn.integralpos.batch.writer;

import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONObject;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.CoverNoteService;

@Component
public class CoverNoteWriter implements ItemWriter<Map<String, List<?>>> {
	
	@Autowired
	private CoverNoteService coverNoteService;
	
	@Override
	public void write(List<? extends Map<String, List<?>>> data) throws Exception {
		if(data.size() > 0) {
			Map<String, List<?>> resData = data.get(0);
			SecurityUtil.logMessage("Start handling Response Cases List");
			coverNoteService.handleResponseCasesList(resData);
			SecurityUtil.logMessage("End handling Response Cases List");
		}
	}
}
