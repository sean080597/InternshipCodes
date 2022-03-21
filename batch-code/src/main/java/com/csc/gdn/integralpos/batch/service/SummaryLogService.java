package com.csc.gdn.integralpos.batch.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;

@Service("summaryLogService")
public class SummaryLogService {
	
	private SimpleDateFormat sdfFileName = new SimpleDateFormat(BatchConstants.DATE_FORMAT2);
	private SimpleDateFormat sdfContent = new SimpleDateFormat(BatchConstants.DATE_FORMAT3);
	private FileWriter fw = null;
	
	public void initWriterLog(String jobName, String fileFolder) {
		try {
			Date currentDate = new Date();
			String fileName = jobName + "_" + sdfFileName.format(currentDate);
			String filePath = fileFolder + "/" + fileName + ".txt";
			File directory = new File(fileFolder);
			if(!directory.exists()) {
				directory.mkdir();
			}
			File file = new File(filePath);
			fw = new FileWriter(file.getAbsolutePath(), true);
			doWriteLog("\n|\t\t\t\tSUMMARY JOB");
			doWriteLog("--------------------------------------------------------");
			doWriteLog("Job name:\t\t\t" + jobName);
			doWriteLog("Job start:\t\t\t" + sdfContent.format(currentDate));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public <T> void doWriteLog(T c1) {
		try {
			String writeContent = String.valueOf(c1);
			if(StringUtils.isNotEmpty(writeContent)) {
				fw.write("|\t" + c1 + "\n");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void finishWriteLog() {
		try {
			doWriteLog("Job end:\t\t\t" + sdfContent.format(new Date()));
			fw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
