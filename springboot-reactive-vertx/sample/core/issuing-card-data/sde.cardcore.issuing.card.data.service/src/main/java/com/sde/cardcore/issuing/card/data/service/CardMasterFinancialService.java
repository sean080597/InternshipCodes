package com.xyz.cardcore.issuing.card.data.service;

import java.util.ArrayList;
import java.util.List;

import com.xyz.cardcore.helper.ReactiveHelper;
import io.smallrye.mutiny.Uni;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xyz.cardcore.issuing.card.data.dao.CardMasterFinancialDao;
import com.xyz.cardcore.issuing.card.data.dto.OBCardMasterFinancialRequest;
import com.xyz.cardcore.issuing.card.data.dto.OBCardMasterFinancialResponse;
import com.xyz.cardcore.issuing.card.data.entity.CardMasterFinancialEntity;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterFinancialDetail;
import com.xyz.modelsuite.dto.OBPaging;
import com.xyz.modelsuite.service.BaseService;
import com.xyz.modelsuite.util.MappingUtil;
import com.xyz.modelsuite.util.SpringBeanUtil;
import reactor.core.publisher.Mono;

@Service
// @Transactional
public class CardMasterFinancialService extends BaseService {

    // @Transactional(readOnly = true)
    public Mono<OBCardMasterFinancialResponse> retrieveCardMasterFinancialDetailByCardLinkAndCurrency(OBCardMasterFinancialRequest request) {
        return SpringBeanUtil.getBean(CardMasterFinancialDao.class).findByCardLinkAndCurrency(request.getObCardMasterFinancialDetail().getCardLink(), request.getObCardMasterFinancialDetail().getCurrency())
                .flatMap(entity -> {
                    OBCardMasterFinancialResponse response = new OBCardMasterFinancialResponse();
                    if (entity != null) {
                        OBCardMasterFinancialDetail detail = new OBCardMasterFinancialDetail();
                        MappingUtil.copyProperties(entity, detail);
                        response.setObCardMasterFinancialDetail(detail);
                    }
                    mapSuccessResponseValue(request, response);

                    return Mono.justOrEmpty(response);
                });
    }
}
