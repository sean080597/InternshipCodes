package com.csc.gdn.integralpos.batch.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.model.PaymentReportData;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.repository.DocumentRepository;
import com.csc.gdn.integralpos.batch.service.CommonBatchService;
import com.csc.gdn.integralpos.domain.document.DocumentModel;
import com.csc.gdn.integralpos.domain.document.elements.SystemInformation;

@Component
public class CSVUtils {
	private static final char DEFAULT_SEPARATOR = ',';

	@Value("${reporting.archivefolder}")
	private String archivefolder;
	
	@Autowired
	private DocumentRepository documentRepository;
	
	@Autowired
	private static CommonBatchService commonBatchService;
	
    private void writeLine(Writer w, List<String> values) throws IOException {
        writeLine(w, values, DEFAULT_SEPARATOR, ' ');
    }

    private void writeLine(Writer w, List<String> values, char separators) throws IOException {
        writeLine(w, values, separators, ' ');
    }

    //https://tools.ietf.org/html/rfc4180
    private static String followCVSformat(String value) {

        String result = getValue(value);
        if (result.contains("\"")) {
            result = result.replace("\"", "\"\"");
        }
        return result;

    }
    
    private static String getValue(String value){
		if(value == null){
			return "";
		}
		return value;
	}

    private void writeLine(Writer w, List<String> values, char separators, char customQuote) throws IOException {

        boolean first = true;

        //default customQuote is empty

        if (separators == ' ') {
            separators = DEFAULT_SEPARATOR;
        }

        StringBuilder sb = new StringBuilder();
        for (String value : values) {
            if (!first) {
                sb.append(separators);
            }
            if (customQuote == ' ') {
                sb.append(followCVSformat(value));
            } else {
                sb.append(customQuote).append(followCVSformat(value)).append(customQuote);
            }

            first = false;
        }
        sb.append("\n");
        w.append(sb.toString());

    }
    
    public void extractPaymentReport(PaymentReportModel reports,  List<String> title) throws IOException {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -1);
		
        SimpleDateFormat f = new SimpleDateFormat(BatchConstants.PAYMENT_REPORT_FILE_NAME_DATE_FORMAT);
        System.out.println(f.format(calendar.getTime()));
        
        String cscName = BatchConstants.PAYMENT_REPORT_FILE_NAME.concat(f.format(calendar.getTime())).concat(".csv");
        String filepath = archivefolder + "/" + cscName;
        SecurityUtil.logMessage("Before exporting CSV file at path: " + filepath);
        
        File file = new File(filepath);
        FileWriter writer = new FileWriter(file);        
        
        //for header
        writeLine(writer, title);

        int i = 1;
        for (PaymentReportData d : reports.getContent()) {
            List<String> list = new ArrayList<>();
            list.add(String.valueOf(i));
            list.add(d.getProduct_code());
            list.add(d.getProposer_name());
            list.add(d.getNric());
            list.add(d.getBusinessRegNum());
            list.add(d.getQuote_no());
            list.add(d.getPol_no());
            list.add(d.getPol_issue_date());
            list.add(d.getPrem_amt());
            list.add(d.getEpay_pay_ref());
            list.add(d.getEpay_pay_status());
            list.add(d.getEpay_pay_date());
            list.add(d.getQuote_create_date());
            list.add(d.getIfe_pay_status());

            writeLine(writer, list);
            i++;

        }

        writer.flush();
        writer.close();
        SecurityUtil.logMessage("End exporting CSV file at path: " + filepath);
        
        reports.setFilename(cscName);
        reports.setUuid(UUID.randomUUID().toString());
        
        //Save csv file to DMS
        DocumentModel  att = new DocumentModel();
        SystemInformation systemInformation = new SystemInformation();
        systemInformation.setFileName(cscName);
        
        att.setSystemInformation(systemInformation);
        att.setContent(readBytesFromFile(filepath));
        att.setId(reports.getUuid());
        
        documentRepository.save(att);
        SecurityUtil.logMessage("Saved ES attachment csv with id = " + reports.getUuid());
	}
    
    private byte[] readBytesFromFile(String filePath) {

        FileInputStream fileInputStream = null;
        byte[] bytesArray = null;

        try {

            File file = new File(filePath);
            bytesArray = new byte[(int) file.length()];

            //read file into bytes[]
            fileInputStream = new FileInputStream(file);
            fileInputStream.read(bytesArray);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileInputStream != null) {
                try {
                    fileInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }

        return bytesArray;

    }
}
