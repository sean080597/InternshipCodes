package com.programming.technie.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

import com.xyz.modelsuite.dto.OBBase;
import com.xyz.modelsuite.dto.OBErrorDetail;
import com.xyz.modelsuite.dto.OBHeader;
import com.xyz.modelsuite.dto.OBPaging;
import com.xyz.modelsuite.util.DateUtil;
import com.xyz.modelsuite.util.NumberUtil;
import com.xyz.modelsuite.util.StringUtil;

public abstract class BaseService
{
    @SuppressWarnings ("unused")
    private static Logger log = LoggerFactory.getLogger(BaseService.class);

    // special case to minimize latency
    public static String ignoreProperties[] = {"createdBy", "createdDateTime", "updatedBy", "updatedDateTime", "domainId"};

    protected static void mapSuccessResponseValue(OBBase request, OBBase response,String referenceNumber)
    {
        mapSuccessResponseValue(request, response);
        response.getObHeader().setReferenceNumber(referenceNumber);
    }

    protected static void mapSuccessResponseValue(OBBase request, OBBase response)
    {
        // copy all request header to response header
        response.setObHeader(new OBHeader());
        BeanUtils.copyProperties(request.getObHeader(), response.getObHeader());

        response.getObHeader().setSuccess(Boolean.TRUE);
        response.getObHeader().setStatusCode("AA");
        response.getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());
    }

    protected static void mapFailResponseValue(OBBase request, OBBase response, String errorCode, String errorMessage,String referenceNumber)
    {
        mapFailResponseValue(request, response, errorCode, errorMessage);
        response.getObHeader().setReferenceNumber(referenceNumber);
    }

    protected static void mapFailResponseValue(OBBase request, OBBase response, String errorCode, String errorMessage)
    {
        // copy all request header to response header
        response.setObHeader(new OBHeader());
        BeanUtils.copyProperties(request.getObHeader(), response.getObHeader());

        response.getObHeader().setSuccess(Boolean.FALSE);
        response.getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());

        // start overwrite
        if (StringUtil.hasValue(errorCode))
        {
            response.getObHeader().setStatusCode(errorCode);

            if(null == response.getObHeader().getErrorDetails()) {//if null only auto set error detail, provide option to let application set
                // start add to OBErrorDetail List
                OBErrorDetail d = new OBErrorDetail();
                d.setCode(errorCode);
                d.setMessage(errorMessage);

                List<OBErrorDetail> errorDetails = new ArrayList<OBErrorDetail>();
                errorDetails.add(d);

                response.getObHeader().setErrorDetails(errorDetails);
                // end add to OBErrorDetail List
            }

        }
        if (StringUtil.hasValue(errorMessage))
        {
            response.getObHeader().setStatusMessage(errorMessage);
        }
        // end overwrite
    }

    protected static void mapFailResponseValue(OBBase request, OBBase response, OBBase otherResponse)
    {
        // copy all request header to response header
        response.setObHeader(new OBHeader());
        BeanUtils.copyProperties(request.getObHeader(), response.getObHeader());

        // from other response
        response.getObHeader().setErrorDetails(otherResponse.getObHeader().getErrorDetails());
        response.getObHeader().setSuccessDetails(otherResponse.getObHeader().getSuccessDetails());
        response.getObHeader().setStatusCode(otherResponse.getObHeader().getStatusCode());
        response.getObHeader().setStatusMessage(otherResponse.getObHeader().getStatusMessage());

        response.getObHeader().setSuccess(Boolean.FALSE);
        response.getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());
    }

    protected static OBPaging retrievePagingDetails(OBBase request)
    {
        if (request.getObPaging() == null)
        {
            request.setObPaging(new OBPaging());
        }

        if (!NumberUtil.hasValue(request.getObPaging().getStartIndex()))
        {
            // default set to 0
            request.getObPaging().setStartIndex(0);
        }

        if (!NumberUtil.hasValue(request.getObPaging().getMaxPerPage()))
        {
            // default set to 10
            request.getObPaging().setMaxPerPage(10);
        }

        return request.getObPaging();
    }
}
