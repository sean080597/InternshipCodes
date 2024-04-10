package com.xyz.cardcore.dao;

import java.util.List;

import com.programming.technie.dao.ReactiveBaseDao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.xyz.modelsuite.util.SpringBeanUtil;

@Repository
public class SequenceIdGeneratorDao extends ReactiveBaseDao<Object, String>
{
    private static Logger log = LoggerFactory.getLogger(SequenceIdGeneratorDao.class);

    @Override
    public void generateIdAndPersist(Object entity)
    {
        // do nothing
    }

    @Override
    public String generateId()
    {
        log.error("Please do not use this SequenceIdGeneratorDao.generateId() to generate Id, use SequenceIdGeneratorService.generateUniqueId() instead");
        return null;
    }

    public String selectNextValue(String key)
    {
        String dbSequence = (String) SpringBeanUtil.lookup("dbSequence");

        // replace sequence key by ?
        dbSequence = dbSequence.replaceAll("\\?", key);

        @SuppressWarnings ("unchecked")
        List<Object> result = (List<Object>) findNative(dbSequence);

        if (result != null && result.size() > 0)
        {
            return result.get(0).toString();
        }
        else
        {
            return null;
        }
    }
}
