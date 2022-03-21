package com.csc.gdn.integralpos.batch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

public interface BatchQuotationRepository extends ElasticsearchRepository<PNCQuotationModel, String>{

}
