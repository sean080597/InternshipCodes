package com.csc.gdn.integralpos.batch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.csc.gdn.integralpos.domain.payment.PaymentModel;

public interface BatchPaymentRepository extends ElasticsearchRepository<PaymentModel, String>{

}
