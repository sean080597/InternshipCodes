package com.csc.gdn.integralpos.batch.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Service("batchUtils")
public class BatchUtils {
    
	public String dateParserToString(String value, String inFormat, String outFormat) throws ParseException{
		String result = "";
    	if(StringUtils.isNotBlank(value)) {
    		SimpleDateFormat inpSdf = new SimpleDateFormat(inFormat);
    		SimpleDateFormat outSdf = new SimpleDateFormat(outFormat);
    		Date tmpDate = inpSdf.parse(value);
    		result = outSdf.format(tmpDate);
    	}
    	return result;
	}
	
	public Date dateParserToDate(String value, String inFormat) throws ParseException{
		if(StringUtils.isNotBlank(value)) {
			SimpleDateFormat inpSdf = new SimpleDateFormat(inFormat);
    		return inpSdf.parse(value);
		}
		return new Date();
	}
	
	public List<JSONObject> sortListJSONObjs(List<JSONObject> lsObjs, String sortField, String sortDirection){
		Collections.sort(lsObjs, new Comparator<JSONObject>() {
			@Override
			public int compare(JSONObject o1, JSONObject o2) {
				String v1 = "";
				String v2 = "";
				Date d1 = new Date();
				Date d2 = new Date();
				try {
					v1 = o1.getString(sortField);
					v2 = o2.getString(sortField);
					d1 = dateParserToDate(v1, BatchConstants.DATE_FORMAT_JPJ_RESPONSE);
					d2 = dateParserToDate(v2, BatchConstants.DATE_FORMAT_JPJ_RESPONSE);
				} catch (Exception e) {
					e.printStackTrace();
				}
				if(BatchConstants.SORT_DESCENDING.equals(sortDirection)) {
					return d2.compareTo(d1);
				}
				return d1.compareTo(d2);
			}
		});
		return lsObjs;
	}
	
	public List<PNCQuotationModel> sortListPNCQuoByCVNTNumber(List<PNCQuotationModel> lsObjs, String sortDirection){
		Collections.sort(lsObjs, new Comparator<PNCQuotationModel>() {
			@Override
			public int compare(PNCQuotationModel o1, PNCQuotationModel o2) {
//				String v1 = o1.getCoverNoteInformation().getCoverNoteNumber();
//				String v2 = o2.getCoverNoteInformation().getCoverNoteNumber();
				Date v1 = o1.getMetaData().getCreateDate();
				Date v2 = o2.getMetaData().getCreateDate();
				if(BatchConstants.SORT_DESCENDING.equals(sortDirection)) {
					return v2.compareTo(v1);
				}
				return v1.compareTo(v2);
			}
		});
		return lsObjs;
	}
	
	// log WebClient request
	public ExchangeFilterFunction logRequest() {
	    return (clientRequest, next) -> {
	        SecurityUtil.logMessage("Request: " + clientRequest.method() + " - " + clientRequest.url());
	        clientRequest.headers()
	                .forEach((name, values) -> values.forEach(value -> SecurityUtil.logMessage(name + "=" + value)));
	        return next.exchange(clientRequest);
	    };
	}
}


