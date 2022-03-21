package com.csc.gdn.integralpos.batch.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Scanner;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.model.ReconModel;
import com.csc.gdn.integralpos.batch.model.ReconTransModel;

@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class ReadFileUtils {

//	@Value("${reporting.input}")
//	private static String inputfolder;
	
	
	public static final Logger LOGGER = LoggerFactory.getLogger(ReadFileUtils.class);
	
	private static String DELIMITER = "[|]";

	public static void moveFile(File oldFile, String archivefolder) {
		try {

			// File oldFile = new
			// File("C:\\Users\\nikos7\\Desktop\\oldFile.txt");

			if (oldFile.renameTo(new File(archivefolder +"/"+ oldFile.getName()))) {
				System.out.println("The file was moved successfully to the new folder");
			} else {
				System.out.println("The File was not moved.");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static ReconModel readPaymentFile(File myObj) {
		ReconModel reconData = new ReconModel();
		reconData.setStartDate(Calendar.getInstance().getTime());
		reconData.setFileName(myObj.getName());
		List<ReconTransModel> lstContent = new ArrayList<ReconTransModel>();
		
		try {
			Scanner read = new Scanner(myObj);
			while (read.hasNextLine()) {
				ReconTransModel reconTransModel = new ReconTransModel();
				String data = read.nextLine();
				System.out.println(data);
				LOGGER.info("Original Data: " + data);

				String[] arr = data.split(DELIMITER);

				if(StringUtils.equals(arr[0], "BOF") || StringUtils.equals(arr[0], "EOF")){
					continue;
				}
				System.out.println("Payment Status = " + arr[9]);
				System.out.println("Payment Method = " + arr[7]);
				
				reconTransModel.setOriginalData(data);
				
				reconTransModel.setRecordIndicator(arr[0]);
				reconTransModel.setPaymentReference(arr[1]);
				reconTransModel.setOrderReference(arr[2]);
				reconTransModel.setPolicyNumber(arr[3]);
				reconTransModel.setProposalNumber(arr[4]);
				reconTransModel.setPaymentDate(arr[5]);
				reconTransModel.setPaymentItemNumber(arr[6]);
				reconTransModel.setPaymentMethod(arr[7]);
				reconTransModel.setPaymentAmount(arr[8]);
				reconTransModel.setPaymentStatus(arr[9]);
//				reconTransModel.setTokenValue(arr[11]);
				
//				if(reconTransModel.getPaymentStatus().equals("16")){
//					reconTransModel.setPaymentDesc(BatchConstants.PAYMENT_REPORT_STATUS_SUCC);
//				} else {
//					reconTransModel.setPaymentDesc(BatchConstants.PAYMENT_REPORT_STATUS_FAIL);
//				}
				
				lstContent.add(reconTransModel);
			}
			read.close();
		} catch (FileNotFoundException e) {
			System.out.println("An error occurred.");
			e.printStackTrace();
		}

//		moveFile(myObj);
		
		reconData.setContent(lstContent);
		return reconData;
	}

	public static List<File> readFolder(String pathFolder) {
		List<File> contentLst  = new ArrayList<File>();
		
		File[] files = new File(pathFolder).listFiles();
		// If this pathname does not denote a directory, then listFiles()
		// returns null.

		for (File file : files) {
			if (file.isFile()) {
				contentLst.add(file);
			}
		}
		
		return contentLst;

	}

//	public static void main(String[] args) {
//
//		List<String> results = new ArrayList<String>();
//
//		File[] files = new File(inputfolder).listFiles();
//		// If this pathname does not denote a directory, then listFiles()
//		// returns null.
//
//		for (File file : files) {
//			if (file.isFile()) {
//				results.add(file.getName());
//				System.out.println(file.getName());
//				System.out.println(file.getPath());
//
//				readPaymentFile(file);
//			}
//		}
//
//	}

}
