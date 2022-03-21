package com.csc.gdn.integralpos.batch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.csc.gdn.integralpos.batch.model.ReconModel;

public interface ReconRepository extends ElasticsearchRepository<ReconModel, String>{

}
