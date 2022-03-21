package com.csc.gdn.integralpos.batch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.csc.gdn.integralpos.batch.model.PostalCodeModel;

public interface PostalCodeRepository extends ElasticsearchRepository<PostalCodeModel, String>{

}
