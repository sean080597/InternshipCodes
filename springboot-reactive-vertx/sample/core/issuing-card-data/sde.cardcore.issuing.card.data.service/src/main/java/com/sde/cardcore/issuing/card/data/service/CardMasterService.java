package com.xyz.cardcore.issuing.card.data.service;

import com.programming.technie.service.BaseService;
import com.programming.technie.util.LogUtil;
import com.xyz.cardcore.helper.ReactiveHelper;
import com.xyz.cardcore.issuing.card.data.entity.CardMasterEntity;
import com.xyz.cardcore.issuing.card.data.entity.CardMasterEntityTest;
import com.xyz.modelsuite.dto.OBPaging;
import io.smallrye.mutiny.Uni;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xyz.cardcore.constant.CardErrorCode;
import com.xyz.cardcore.issuing.card.data.dao.CardMasterDao;
import com.xyz.cardcore.issuing.card.data.dto.OBCardMasterFinancialRequest;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterDetail;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterFinancialDetail;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterRequest;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterResponse;
import com.xyz.cardcore.issuing.common.param.helper.IssuingParamHelper;
import com.xyz.modelsuite.util.MappingUtil;
import com.xyz.modelsuite.util.SpringBeanUtil;
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Mono;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
// @Transactional
public class CardMasterService extends BaseService {
    private static Logger log = LoggerFactory.getLogger(CardMasterService.class);

    // @Transactional(readOnly = true)
    public Mono<OBCardMasterResponse> retrieveCardMasterDetailByCardNumber(OBCardMasterRequest request) {
        return SpringBeanUtil.getBean(CardMasterDao.class).findByCardNumber(request.getObCardMasterDetail().getCardNumber())
            .flatMap(item -> {
                OBCardMasterResponse response = new OBCardMasterResponse();
                if (item != null) {
                    OBCardMasterDetail detail = new OBCardMasterDetail();
                    MappingUtil.copyProperties(item, detail);
                    detail.setCreatedBy(item.getCreatedBy());
                    detail.setCreatedDomain(item.getCreatedDomain());
                    detail.setCreatedDatetime(Date.from(item.getCreatedDatetime().atZone(ZoneId.systemDefault()).toInstant()));

                    response.setObCardMasterDetail(detail);

                    retrieveObCardMasterFinancialDetail(detail).subscribe(response::setObCardMasterFinancialDetail);
                } else {
                    mapFailResponseValue(request, response, CardErrorCode.CARD_NOT_FOUND.getCode(), CardErrorCode.CARD_NOT_FOUND.getDesc());
                    return Mono.justOrEmpty(response);
                }

                mapSuccessResponseValue(request, response);
                return Mono.justOrEmpty(response);
            });
    }

    public Mono<OBCardMasterFinancialDetail> retrieveObCardMasterFinancialDetail(OBCardMasterDetail obCardMasterDetail) {
        String currencyCode = IssuingParamHelper.retrieveIssuingUniqueParameter("CARD_ADMIN", "ADMN", null, null, null, null, null).get("CURRENCY_CODE");

        AtomicReference<OBCardMasterFinancialDetail> detail = new AtomicReference<>(new OBCardMasterFinancialDetail());
        OBCardMasterFinancialRequest request = new OBCardMasterFinancialRequest();
        detail.get().setCardLink(obCardMasterDetail.getCardLink());
        detail.get().setCurrency(currencyCode);
        request.setObCardMasterFinancialDetail(detail.get());

        return SpringBeanUtil.getBean(CardMasterFinancialService.class).retrieveCardMasterFinancialDetailByCardLinkAndCurrency(request)
            .flatMap(response -> {
                if (response.getObHeader().getSuccess() && null != response.getObCardMasterFinancialDetail()) {
                    detail.set(response.getObCardMasterFinancialDetail());
                }
                return Mono.justOrEmpty(detail.get());
            });
    }

    // @Transactional(readOnly = true)
    public Mono<OBCardMasterResponse> retrieveCardMasterListByAccountNumber(OBCardMasterRequest request) {
        OBCardMasterResponse response = new OBCardMasterResponse();

        // select total count
        Mono<Integer> totalRecordsMono = SpringBeanUtil.getBean(CardMasterDao.class).findByAccountNumberCount(request.getObCardMasterDetail().getAccountNumber());
        return totalRecordsMono.flatMap(totalRecords -> {
            // for paging purpose
            OBPaging obPaging = retrievePagingDetails(request);
            obPaging.setTotalRecords(totalRecords);
            response.setObPaging(obPaging);

            // if no records, then no need 2nd query
            if (totalRecords > 0) {
                Mono<List<CardMasterEntity>> resultListMono = SpringBeanUtil.getBean(CardMasterDao.class)
                    .findByAccountNumber(request.getObCardMasterDetail(), request.getObCardMasterDetail().getAccountNumber(), request.getObPaging().getStartIndex(), request.getObPaging().getMaxPerPage());
                return resultListMono.flatMap(resultList -> {
                    if (resultList != null && !resultList.isEmpty()) {
                        List<OBCardMasterDetail> obCardMasterDetailList = MappingUtil.copyProperties(resultList, OBCardMasterDetail.class);

                        response.setObCardMasterDetailList(obCardMasterDetailList);
                    }
                    return Mono.fromRunnable(() -> mapSuccessResponseValue(request, response)).thenReturn(response);
                });
            }

            mapSuccessResponseValue(request, response);
            return Mono.just(response);
        });
    }

    public Mono<OBCardMasterResponse> test(){
        List<String> rs = SpringBeanUtil.getBean(CardMasterDao.class).test();
        OBCardMasterResponse response = new OBCardMasterResponse();
        response.setCardNumbers(rs);
        return Mono.just(response);
    }

    public Mono<List<CardMasterEntity>> testQuery(OBCardMasterRequest request) {
        return SpringBeanUtil.getBean(CardMasterDao.class).testQuery();
    }
}