package com.xyz.cardcore.issuing.card.data.ws;
 
import java.util.ArrayList;
import java.util.List;

import com.programming.technie.util.LogUtil;
import com.xyz.cardcore.aop.WebService;
import com.xyz.cardcore.issuing.card.data.entity.CardMasterEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.xyz.cardcore.issuing.card.data.service.CardMasterService;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterDetail;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterRequest;
import com.xyz.cardcore.issuing.common.data.dto.OBCardMasterResponse;
import com.xyz.cardcore.issuing.common.data.helper.StatementProcessingGenerator;
import com.xyz.cardcore.issuing.common.param.helper.IssuingParamHelper;
import com.xyz.modelsuite.util.SpringBeanUtil;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/cardMaster")
public class CardMasterWS
{
	@RequestMapping(value = "/retrieveCardMasterListByAccountNumber", method = { RequestMethod.POST })
	public Mono<OBCardMasterResponse> retrieveCardMasterListByAccountNumber(@RequestBody OBCardMasterRequest request) throws Exception
	{
		CardMasterService ws = SpringBeanUtil.getBean(CardMasterService.class);
		return ws.retrieveCardMasterListByAccountNumber(request);
//		return ws.test();
	}

	@RequestMapping(value = "/retrieveCardMasterDetailByCardNumber", method = { RequestMethod.POST })
	public Mono<OBCardMasterResponse> retrieveCardMasterDetailByCardNumber(@RequestBody OBCardMasterRequest request) throws Exception
	{
		return SpringBeanUtil.getBean(CardMasterService.class).retrieveCardMasterDetailByCardNumber(request);
	}

	@RequestMapping(value = "/test", method = { RequestMethod.POST })
	public Mono<List<CardMasterEntity>> test(@RequestBody OBCardMasterRequest request) throws Exception
	{
		CardMasterService ws = SpringBeanUtil.getBean(CardMasterService.class);
		return ws.testQuery(request);
	}
}