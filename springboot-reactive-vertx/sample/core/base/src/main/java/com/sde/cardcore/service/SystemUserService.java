package com.xyz.cardcore.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xyz.cardcore.proxy.MSServiceProxy;
import com.xyz.modelsuite.dto.OBSystemUserRequest;
import com.xyz.modelsuite.dto.OBSystemUserResponse;
import com.xyz.modelsuite.service.BaseService;
import com.xyz.modelsuite.util.SpringBeanUtil;

@Service
// @Transactional
public class SystemUserService extends BaseService
{
    public OBSystemUserResponse retreiveSystemUserInfoByUsername(OBSystemUserRequest request)
    {
    	OBSystemUserResponse response = new OBSystemUserResponse();

    	response = SpringBeanUtil.getBean(MSServiceProxy.class).sendAndReceive("SystemUserWS.retreiveSystemUserInfoByUsername", request, OBSystemUserResponse.class);

    	mapSuccessResponseValue(request, response);

        return response;
    }
}