package com.csc.gdn.integralpos.batch.processor;

import java.util.List;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.ReconService;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.model.ReconModel;

@Component
public class ReconciliationProcessor implements ItemProcessor<List<ReconModel>, PaymentReportModel> {
	
	@Autowired
	private ReconService reconService;

	@Override
	public PaymentReportModel process(List<ReconModel> data) throws Exception {
		return reconService.validatePaymentStatus(data);
	}

}
