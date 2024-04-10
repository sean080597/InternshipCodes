package com.xyz.cardcore.service;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.xyz.cardcore.dao.SequenceIdGeneratorDao;
import com.xyz.ms.service.BaseService;
import com.xyz.ms.util.PadUtil;
import com.xyz.ms.util.SpringBeanUtil;

@Service
// @Transactional (propagation = Propagation.REQUIRES_NEW)
public class SequenceIdGeneratorService extends BaseService
{
    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(SequenceIdGeneratorService.class);

    public String generateUniqueId(String key, Integer length, String formatter)
    {
        String s = this.generateUniqueId(key, length);

        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        s = sdf.format(new Date()) + s;

        return s;
    }

    public String generateUniqueId(String key, Integer length)
    {
        String s = this.generateUniqueId(key);

        s = PadUtil.paddingInFront(s, "0", length);

//        log.debug("unique key = [" + key + "], seq = [" + s + "]");

        return s;
    }

    public String generateUniqueId(String key)
    {
    	String s = SpringBeanUtil.getBean(SequenceIdGeneratorDao.class).selectNextValue(key);

        return s;
    }
}
