package com.programming.technie.dao;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.programming.technie.web.security.ReactiveContextHolderStrategy;
import io.smallrye.mutiny.Uni;
import org.hibernate.reactive.mutiny.Mutiny;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.xyz.modelsuite.util.NumberUtil;
import com.xyz.modelsuite.util.StringUtil;
import com.xyz.modelsuite.web.security.ThreadLocalXyzContextHolderStrategy;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@SuppressWarnings("unchecked")
@Repository
public abstract class ReactiveBaseDao<E, ID extends Serializable> {
    private static Logger log = LoggerFactory.getLogger(ReactiveBaseDao.class);

    protected Class<E> entityClass;

    public static String fieldCreatedBy = "setCreatedBy";
    public static String fieldCreatedDatetime = "setCreatedDatetime";
    public static String fieldUpdatedBy = "setUpdatedBy";
    public static String fieldUpdatedDatetime = "setUpdatedDatetime";
    public static String fieldDomainId = "setDomainId";
    public static String fieldCreatedDomain = "setCreatedDomain";
    public static String fieldUpdatedDomain = "setUpdatedDomain";
    public static String fieldCreatedByGetter = "getCreatedBy";
    public static String fieldCreatedDatetimeGetter = "getCreatedDatetime";
    public static String fieldDomainIdGetter = "getDomainId";
    public static String fieldCreatedDomainGetter = "getCreatedDomain";

    public ReactiveBaseDao() {
        try {
            ParameterizedType genericSuperclass = (ParameterizedType) getClass().getGenericSuperclass();
            this.entityClass = (Class<E>) genericSuperclass.getActualTypeArguments()[0];
        } catch (Exception e) {
            /**
             * Prevent 1st time AOP loading throw error
             */
            // log.debug("ignore java.lang.ClassCastException-->java.lang.Class cannot be cast to java.lang.reflect.ParameterizedType");
        }
    }

    @Autowired
    protected Mutiny.SessionFactory sessionFactory;

    /**
     * Manually Generate Unique Id before persist.
     */
    public abstract void generateIdAndPersist(E entity);

    public void generateIdAndPersist(List<E> entities) {
        for (E entity : entities) {
            generateIdAndPersist(entity);
        }
    }

    public abstract String generateId();

    /**
     * Persist data into Database
     *
     * @param E entity
     */
    public void persist(E entity, Date dateTime) {
        try {
            Method fieldCreatedBy = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedBy, String.class);
            Method fieldCreatedDatetime = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedDatetime, Date.class);
            Method fieldCreatedByGetter = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedByGetter);
            Method fieldCreatedDatetimeGetter = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedDatetimeGetter);

            // during insert, sometime already have value, so don't override
            if (fieldCreatedByGetter.invoke(entity) == null) {
                fieldCreatedBy.invoke(entity, ReactiveContextHolderStrategy.getXyzContext().block().getUserId());
            }

            if (fieldCreatedDatetimeGetter.invoke(entity) == null) {
                fieldCreatedDatetime.invoke(entity, dateTime);
            }
        } catch (NoSuchMethodException e) {
            //log.debug("No audit field found. Will not update audit info. [" + entity.getClass().getSimpleName() + "]");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        //domain id
        try {
            Method fieldDomainId = entity.getClass().getMethod(ReactiveBaseDao.fieldDomainId, String.class);
            Method fieldDomainIdGetter = entity.getClass().getMethod(ReactiveBaseDao.fieldDomainIdGetter);

            // during insert, sometime already have value, so don't override
            if (fieldDomainIdGetter.invoke(entity) == null) {
                fieldDomainId.invoke(entity, ReactiveContextHolderStrategy.getXyzContext().block().getDomainId());
            }
        } catch (NoSuchMethodException e) {
            //log.debug("No audit field found. Will not update audit info. [" + entity.getClass().getSimpleName() + "]");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        // created domain
        try {
            Method fieldCreatedDomain = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedDomain, String.class);
            Method fieldCreatedDomainGetter = entity.getClass().getMethod(ReactiveBaseDao.fieldCreatedDomainGetter);

            // during insert, sometime already have value, so don't override
            if (fieldCreatedDomainGetter.invoke(entity) == null) {
                fieldCreatedDomain.invoke(entity, ReactiveContextHolderStrategy.getXyzContext().block().getDomainId());
            }
        } catch (NoSuchMethodException e) {
            //log.debug("No audit field found. Will not update audit info. [" + entity.getClass().getSimpleName() + "]");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        sessionFactory.withTransaction((ss, tx) -> ss.persist(entity).call(ss::flush).replaceWith(entity));
    }

    public void persist(E entity) {
        persist(entity, new Date());
    }

    public void persist(List<E> entities) {
        for (E entity : entities) {
            persist(entity, new Date());
        }
    }

    public void remove(E entity) {
        sessionFactory.withTransaction((ss, tx) -> ss.remove(ss.contains(entity) ? entity : ss.merge(entity).onItem().call(ss::flush)));
    }

    public void remove(List<E> entities) {
        for (E entity : entities) {
            sessionFactory.withTransaction((ss, tx) -> ss.remove(ss.contains(entity) ? entity : ss.merge(entity).onItem().call(ss::flush)));
        }
    }

    public Uni<E> merge(E entity, Date dateTime) {
        try {
            Method fieldUpdatedBy = entity.getClass().getMethod(ReactiveBaseDao.fieldUpdatedBy, String.class);
            Method fieldUpdatedDatetime = entity.getClass().getMethod(ReactiveBaseDao.fieldUpdatedDatetime, Date.class);

            fieldUpdatedBy.invoke(entity, ReactiveContextHolderStrategy.getXyzContext().block().getUserId());
            fieldUpdatedDatetime.invoke(entity, dateTime);

        } catch (NoSuchMethodException e) {
            //log.warn("No audit field found. Will not update audit info. [" + entity.getClass().getSimpleName() + "]");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        try {
            Method fieldUpdatedDomain = entity.getClass().getMethod(ReactiveBaseDao.fieldUpdatedDomain, String.class);
            fieldUpdatedDomain.invoke(entity, ReactiveContextHolderStrategy.getXyzContext().block().getDomainId());
        } catch (NoSuchMethodException e) {
            //log.debug("No audit field found. Will not update audit info. [" + entity.getClass().getSimpleName() + "]");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return sessionFactory.withTransaction((ss, tx) -> ss.merge(entity).onItem().call(ss::flush));
    }

    public Uni<E> merge(E entity) {
        return merge(entity, new Date());
    }

    public List<Uni<E>> merge(List<E> entities) {
        List<Uni<E>> l = new ArrayList<>();
        for (E e : entities) {
            l.add(merge(e, new Date()));
        }
        return l;
    }

    public Uni<Void> refresh(E entity) {
        return sessionFactory.withTransaction((ss, tx) -> ss.refresh(entity));
    }

    public Uni<E> findById(ID id) {
        return sessionFactory.withSession(ss -> ss.find(entityClass, id));
    }

    public Uni<E> findById(ID id, LockModeType lockModeType) {
        return sessionFactory.withSession(ss -> ss.find(entityClass, id, lockModeType));
    }

    public Uni<E> flush(E entity) {
        return sessionFactory.withSession(ss -> ss.flush().replaceWith(entity));
    }

    public Uni<Integer> removeAll() {
        return sessionFactory.withTransaction((ss, tx) -> ss.createNativeQuery("DELETE FROM " + entityClass.getSimpleName() + " a ").executeUpdate());
    }

    public Uni<List<E>> findAll() {
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a ");
    }

    public Uni<List<E>> findAll(Integer firstResult, Integer maxResults) {
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a ", firstResult, maxResults, (Object[]) null);
    }

    public Uni<List<E>> find(E entity) {
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a ");
    }

    public Uni<List<E>> find(E entity, String orderBy) {
        orderBy = StringUtil.hasValue(orderBy) ? "order by " + orderBy : "";
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a " + orderBy);
    }

    public Uni<List<E>> find(E entity, Integer firstResult, Integer maxResults) {
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a ", firstResult, maxResults);
    }

    public Uni<List<E>> find(E entity, String orderBy, Integer firstResult, Integer maxResults) {
        orderBy = StringUtil.hasValue(orderBy) ? "order by " + orderBy : "";
        return find("SELECT a FROM " + entityClass.getSimpleName() + " a " + orderBy, firstResult, maxResults);
    }

    public Uni<List<E>> find(String queryString) {
        return find(queryString, null, null, (Object[]) null);
    }

    public Uni<List<E>> find(String queryString, Object... values) {
        return find(queryString, null, null, values);
    }

    public Uni<List<E>> find(String queryString, LockModeType lockMode, Object... values) {
        return find(queryString, null, null, lockMode, values);
    }

    public Uni<List<E>> find(String queryString, List<?> params) {
        return find(queryString, null, null, params.toArray());
    }

    public Uni<List<E>> find(String queryString, List<?> params, LockModeType lockMode) {
        return find(queryString, null, null, lockMode, params.toArray());
    }

    public Uni<List<E>> find(String queryString, Integer firstResult, Integer maxResults, Object... values) {
        return sessionFactory.withSession(ss -> {
            Mutiny.SelectionQuery<E> query = createQuery(ss, queryString, firstResult, maxResults, null, values);
            return query.getResultList();
        });
    }

    public Uni<List<E>> find(String queryString, Integer firstResult, Integer maxResults, LockModeType lockMode, Object... values) {
        return sessionFactory.withSession(ss -> {
            Mutiny.SelectionQuery<E> query = createQuery(ss, queryString, firstResult, maxResults, lockMode, values);
            return query.getResultList();
        });
    }

    private Mutiny.SelectionQuery<E> createQuery(Mutiny.Session ss, String queryString, Integer firstResult, Integer maxResults, LockModeType lockMode, Object... values) {
        Mutiny.SelectionQuery<E> query = ss.createQuery(queryString, entityClass);
        StringBuilder sb = new StringBuilder();

        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                //sb.append("index = [" + (i + 1) + "] values = [" + values[i] + "] ");
                sb.append("[" + (i + 1) + "]~[" + values[i] + "] ");
                query.setParameter(i + 1, values[i]);
            }
        }

        if (firstResult != null && maxResults != null) {
            sb.append("First Index = [" + firstResult + "], Max Results = [" + maxResults + "] ");
            query.setFirstResult(firstResult);
            query.setMaxResults(maxResults);
        }

        if (lockMode != null) {
            sb.append("LockMode = [" + lockMode + "] ");
            query.setLockMode(lockMode);
        }

        if (!sb.isEmpty()) {
            log.debug(sb.toString());
        }
        return query;
    }

    /**
     * Select Count custom SQL, which return Integer
     */
    public Uni<Integer> findCount() {
        return findCount("SELECT count(a) FROM " + entityClass.getSimpleName() + " a ");
    }

    public Uni<Integer> findCount(E entity) {
        return findCount("SELECT count(a) FROM " + entityClass.getSimpleName() + " a ");
    }

    public Uni<Integer> findCount(String queryString) {
        return findCount(queryString, (Object[]) null);
    }

    public Uni<Integer> findCount(String queryString, Object... values) {
        // auto remove "FETCH" keyword when hql select count (ignore upper case or lower case)
        queryString = queryString.replaceAll("(?i)fetch", "");

        String finalQueryString = queryString;
        return sessionFactory.withSession(ss -> {
            Mutiny.SelectionQuery<E> query = createQuery(ss, finalQueryString, null, null, null, values);
            return query.getSingleResult().flatMap(rs -> Uni.createFrom().item(((Long) rs).intValue()));
        });
    }

    public Uni<Number> findANumber(String queryString, Object... values) {
        return sessionFactory.withSession(ss -> {
            Mutiny.SelectionQuery<E> query = createQuery(ss, queryString, null, null, null, values);
            return query.getSingleResult().flatMap(rs -> Uni.createFrom().item((Number) rs));
        });
    }

    /**
     * Native is for custom SQL, which return custom result set
     */
    public Uni<? extends List<?>> findNative(String queryString) {
        return findNative(queryString, null, null, null, (Object[]) null);
    }

    public Uni<? extends List<?>> findNative(String queryString, Object... values) {
        return findNative(queryString, null, null, null, values);
    }

    public Uni<? extends List<?>> findNative(String queryString, Class<?> c) {
        return findNative(queryString, null, null, c, (Object[]) null);
    }

    public Uni<? extends List<?>> findNative(String queryString, Class<?> c, Object... values) {
        return findNative(queryString, null, null, c, values);
    }

    public Uni<? extends List<?>> findNative(String queryString, Integer firstResult, Integer maxResults, Class<?> c, Object... values) {
        return sessionFactory.withSession(ss -> {
            Mutiny.SelectionQuery<?> query = createNativeQuery(ss, queryString, firstResult, maxResults, c, values);
            return query.getResultList();
        });
    }


    private Mutiny.SelectionQuery<?> createNativeQuery(Mutiny.Session ss, String queryString, Integer firstResult, Integer maxResults, Class<?> c, Object... values) {
        Mutiny.SelectionQuery<?> query;
        StringBuilder sb = new StringBuilder();

        if (c == null) {
            query = ss.createNativeQuery(queryString);
        } else {
            query = ss.createNativeQuery(queryString, c);
        }

        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                //sb.append("index = [" + (i + 1) + "] values = [" + values[i] + "] ");
                sb.append("[" + (i + 1) + "]~[" + values[i] + "] ");
                query.setParameter(i + 1, values[i]);
            }
        }

        if (firstResult != null && maxResults != null) {
            sb.append("First Index = [" + firstResult + "], Max Results = [" + maxResults + "]");
            query.setFirstResult(firstResult);
            query.setMaxResults(maxResults);
        }

        if (sb.length() > 0) {
            log.debug(sb.toString());
        }

        return query;
    }

    public Uni<Integer> executeUpdate(String queryString) {
        return executeUpdate(queryString, (Object[]) null);
    }

    public Uni<Integer> executeUpdate(String queryString, List<?> params) {
        return executeUpdate(queryString, params.toArray());
    }

    public Uni<Integer> executeUpdate(String queryString, Object... values) {
        return sessionFactory.withSession(ss -> {
            Mutiny.MutationQuery query = ss.createMutationQuery(queryString);
            StringBuilder sb = new StringBuilder();

            if (values != null) {
                for (int i = 0; i < values.length; i++) {
                    //sb.append("index = [" + (i + 1) + "] values = [" + values[i] + "] ");
                    sb.append("[" + (i + 1) + "]~[" + values[i] + "] ");
                    query.setParameter(i + 1, values[i]);
                }
            }

            if (!sb.isEmpty()) {
                log.debug(sb.toString());
            }

            return query.executeUpdate();
        });
    }
}
