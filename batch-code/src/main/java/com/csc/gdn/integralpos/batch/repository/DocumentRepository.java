/**
 * 
 */
package com.csc.gdn.integralpos.batch.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.csc.gdn.integralpos.domain.document.DocumentModel;

/**
 * @author dngo5
 *
 */

public interface DocumentRepository extends ElasticsearchRepository<DocumentModel, String>{

}
