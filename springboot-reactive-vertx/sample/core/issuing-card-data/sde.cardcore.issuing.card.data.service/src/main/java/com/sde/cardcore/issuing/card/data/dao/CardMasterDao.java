package com.xyz.cardcore.issuing.card.data.dao;

import com.programming.technie.dao.ReactiveBaseDao;
import com.xyz.cardcore.helper.ReactiveHelper;
import com.xyz.cardcore.issuing.card.data.entity.CardMasterEntity;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterDetail;
import com.xyz.cardcore.service.SequenceIdGeneratorService;
import com.xyz.ms.util.SpringBeanUtil;
import io.smallrye.mutiny.Uni;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Repository
public class CardMasterDao extends ReactiveBaseDao<CardMasterEntity, String> {
    private static String SEQ_NAME = "SEQ_CARDMASTER";
    private static Integer SEQ_LENGTH = 9;
    private static String SEQ_FORMATTER = "yyyyMMdd";

    @Override
    public void generateIdAndPersist(CardMasterEntity entity) {
        entity.setId(this.generateId());
        super.persist(entity);
    }

    @Override
    public String generateId() {
        return SpringBeanUtil.getBean(SequenceIdGeneratorService.class).generateUniqueId(SEQ_NAME, SEQ_LENGTH, SEQ_FORMATTER);
    }

    public Mono<CardMasterEntity> findByCardNumber(String cardNumber) {
        Uni<CardMasterEntity> rs = find("SELECT a FROM CardMasterEntity a where a.cardNumber = ?1 ", cardNumber)
            .flatMap(entities -> entities != null && !entities.isEmpty() ? Uni.createFrom().item(entities.get(0)) : Uni.createFrom().nullItem());
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Mono<Integer> findByAccountNumberCount(String accountNumber) {
        Uni<Integer> uni = findCount("SELECT count(a) FROM CardMasterEntity a where a.accountNumber = ?1  ORDER BY a.id DESC", accountNumber);
        return ReactiveHelper.convertUniToMono(uni);
    }


    public Mono<List<CardMasterEntity>> findByAccountNumber(OBCardMasterDetail detail, String accountNumber, Integer start, Integer max) {
        StringBuilder query = new StringBuilder();

        query.append("SELECT a FROM CardMasterEntity a where a.accountNumber = ?1");

        if (null != detail.getOrderByList() && !detail.getOrderByList().isEmpty()) {
            query.append(" order by ");
            int i = 0;
            Map<String, String> orderByList = detail.getOrderByList();
            for (String key : detail.getOrderByList().keySet()) {
                query.append("a." + key);
                query.append(" " + orderByList.get(key) + " ");

                if (i != (detail.getOrderByList().size() - 1)) {
                    query.append(", ");
                }
                i++;
            }
        } else {
            query.append(" ORDER BY a.id DESC");
        }

        Uni<List<CardMasterEntity>> uni = find(query.toString(), start, max, accountNumber);
        return ReactiveHelper.convertUniToMono(uni);
    }

    public List<String> test(){
        return sessionFactory.getMetamodel()
            .getEntities()
            .stream()
            .map(EntityType::getName)
//            .map(entityType -> entityType.getJavaType().getPackage().getName())
            .distinct()
            .toList();
    }

    public Mono<List<CardMasterEntity>> testQuery() {
        Uni<List<CardMasterEntity>> uni = sessionFactory.withSession(
            ss -> ss.createQuery("from CardMasterEntity", CardMasterEntity.class)
                .setMaxResults(5)
                .getResultList()
        );
        return ReactiveHelper.convertUniToMono(uni);
    }
}