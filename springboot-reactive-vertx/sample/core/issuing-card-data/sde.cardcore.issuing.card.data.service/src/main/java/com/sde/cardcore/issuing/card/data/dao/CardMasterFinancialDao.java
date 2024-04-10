package com.xyz.cardcore.issuing.card.data.dao;

import java.util.ArrayList;
import java.util.List;

import com.xyz.cardcore.helper.ReactiveHelper;
import com.programming.technie.dao.ReactiveBaseDao;
import io.smallrye.mutiny.Uni;
import jakarta.persistence.LockModeType;

import org.springframework.stereotype.Repository;

import com.xyz.cardcore.issuing.card.data.entity.CardMasterFinancialEntity;
import com.xyz.cardcore.service.SequenceIdGeneratorService;
import com.xyz.modelsuite.util.SpringBeanUtil;
import reactor.core.publisher.Mono;


@Repository
public class CardMasterFinancialDao extends ReactiveBaseDao<CardMasterFinancialEntity, String> {
    private static String SEQ_NAME = "SEQ_CARDMASTERFINANCIAL";
    private static Integer SEQ_LENGTH = 9;
    private static String SEQ_FORMATTER = "yyyyMMdd";

    @Override
    public void generateIdAndPersist(CardMasterFinancialEntity entity) {
        entity.setId(this.generateId());
        super.persist(entity);
    }

    @Override
    public String generateId() {
        return SpringBeanUtil.getBean(SequenceIdGeneratorService.class).generateUniqueId(SEQ_NAME, SEQ_LENGTH, SEQ_FORMATTER);
    }

    public Mono<Integer> findCountByStatus(CardMasterFinancialEntity entity) {
        StringBuilder query = new StringBuilder();
        List<Object> params = new ArrayList<Object>();
        int index = 1;
        query.append("SELECT count(c) FROM CardMasterFinancialEntity c");

        if (params.isEmpty()) {
            query.append(" WHERE c.statusCode = 'ACTIVE' ");
        } else {
            query.append(" AND c.statusCode = 'ACTIVE' ");
        }

        Uni<Integer> uni = findCount(query.toString(), params.toArray());
        return ReactiveHelper.convertUniToMono(uni);
    }

    public Mono<List<CardMasterFinancialEntity>> findByStatus(CardMasterFinancialEntity entity, Integer start, Integer max) {
        StringBuilder query = new StringBuilder();
        List<Object> params = new ArrayList<Object>();
        int index = 1;

        query.append("SELECT c FROM CardMasterFinancialEntity c");

        if (params.isEmpty()) {
            query.append(" WHERE c.statusCode = 'ACTIVE' ");
        } else {
            query.append(" AND c.statusCode = 'ACTIVE' ");
        }

        Uni<List<CardMasterFinancialEntity>> uni = find(query.toString(), start, max, params.toArray());
        return ReactiveHelper.convertUniToMono(uni);
    }

    public Mono<CardMasterFinancialEntity> findByCardLink(String cardLink) {
        Uni<CardMasterFinancialEntity> uni = find("SELECT a FROM CardMasterFinancialEntity a where a.cardLink = ?1", cardLink)
                .map(entities -> entities != null && !entities.isEmpty() ? entities.get(0) : null);
        return ReactiveHelper.convertUniToMono(uni);
    }

    public Mono<CardMasterFinancialEntity> findByCardLinkAndCurrency(String cardLink, String currency) {
        Uni<CardMasterFinancialEntity> uni = find("SELECT a FROM CardMasterFinancialEntity a where a.cardLink = ?1 and a.currency = ?2", cardLink, currency)
                .map(entities -> entities != null && !entities.isEmpty() ? entities.get(0) : null);
        return ReactiveHelper.convertUniToMono(uni);
    }

    public Mono<CardMasterFinancialEntity> findByCardLinkAndCurrencyAndApplyLock(String cardLink, String currency) {
        Uni<CardMasterFinancialEntity> uni = find("SELECT a FROM CardMasterFinancialEntity a where a.cardLink = ?1 and a.currency = ?2", LockModeType.PESSIMISTIC_WRITE, cardLink, currency)
                .map(entities -> entities != null && !entities.isEmpty() ? entities.get(0) : null);
        return ReactiveHelper.convertUniToMono(uni);
    }
}