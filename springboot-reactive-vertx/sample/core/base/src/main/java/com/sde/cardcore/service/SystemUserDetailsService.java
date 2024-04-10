package com.xyz.cardcore.service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;

import com.xyz.modelsuite.dto.OBGrantedAuthorityDetail;
import com.xyz.modelsuite.dto.OBSystemUserRequest;
import com.xyz.modelsuite.dto.OBUserDetail;
import reactor.core.publisher.Mono;

public class SystemUserDetailsService implements ReactiveUserDetailsService
{
    private static Logger log = LoggerFactory.getLogger(SystemUserDetailsService.class);

    public static Map<String, OBUserDetail> userDetaiCache = new ConcurrentHashMap<String, OBUserDetail>();

    @Autowired
    private SystemUserService systemUserService;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        OBUserDetail detail = userDetaiCache.get(username);

        if (detail == null) {
            OBSystemUserRequest request = new OBSystemUserRequest();
            OBUserDetail obUserDetail = new OBUserDetail();
            obUserDetail.setUsername(username);
            request.setObUserDetail(obUserDetail);

            // OBSystemUserResponse response = systemUserService.retreiveSystemUserInfoByUsername(request);
            // detail = response.getObUserDetail();

            // special for no password
            detail = new OBUserDetail();
            Set<OBGrantedAuthorityDetail> s = new HashSet<OBGrantedAuthorityDetail>();
            OBGrantedAuthorityDetail o;

            o = new OBGrantedAuthorityDetail();
            o.setAuthority("ROLE_REMOTE");
            s.add(o);

            o = new OBGrantedAuthorityDetail();
            o.setAuthority("ROLE_MONITOR");
            s.add(o);

            detail.setAuthorities(s);
            // end special for no password

            userDetaiCache.put(username, detail);
        }

        return Mono.just(detail);
    }

	public SystemUserService getSystemUserService() {
		return systemUserService;
	}

	public void setSystemUserService(SystemUserService systemUserService) {
		this.systemUserService = systemUserService;
	}
}
