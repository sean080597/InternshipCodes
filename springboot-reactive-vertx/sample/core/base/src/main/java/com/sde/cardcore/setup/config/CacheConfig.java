package com.xyz.cardcore.setup.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.cache.interceptor.SimpleCacheErrorHandler;
import org.springframework.cache.interceptor.SimpleCacheResolver;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.xyz.ms.cache.BusinessParamCache;
import com.xyz.ms.cache.CacheReloadingStatusCache;
import com.xyz.ms.cache.CardCache;
import com.xyz.ms.cache.CardEncryptedCache;
import com.xyz.ms.cache.CardNumberCache;
import com.xyz.ms.cache.ComplianceParamCache;
import com.xyz.ms.cache.IssuingParamCache;
import com.xyz.ms.cache.IssuingParamObjectCache;
import com.xyz.ms.cache.ParamMappingCache;
import com.xyz.ms.cache.ParamMappingKeyCache;
import com.xyz.ms.cache.ParamMappingMessageCache;
import com.xyz.ms.cache.ResourceBundleMessageSourceCache;
import com.xyz.ms.cache.SystemParameterCache;
import com.xyz.ms.web.locale.DatabaseResourceBundleMessageSource;
import com.xyz.productfactory.cache.ProductCatalogueCache;

@Configuration
public class CacheConfig
{
    @Autowired
    Environment env;
    
    private long localCacheTime = 30L;
    private TimeUnit localCacheTimeUnit = TimeUnit.MINUTES;

    //ParamMappingHelper
    @Bean
    public ParamMappingCache paramMappingCache()
    {
        String cacheName = "PARAM_MAPPING";

        return new ParamMappingCache(cacheName);
    }

    @Bean
    public ParamMappingKeyCache paramMappingKeyCache()
    {
        String cacheName = "PARAM_MAPPING_KEY";

        return new ParamMappingKeyCache(cacheName);
    }

    @Bean
    public ParamMappingMessageCache paramMappingMessageCache()
    {
        String cacheName = "PARAM_MAPPING_MESSAGE";

        return new ParamMappingMessageCache(cacheName);
    }

    //use by PropertyUtil
    //tbl_xyz_system_parameter
    @Bean
    public SystemParameterCache systemParameterCache()
    {
        String cacheName = "SYSTEM_PARAMETER_" + getActiveProfie();
        
        SystemParameterCache cache = new SystemParameterCache(cacheName);
        cache.setSupportLocalCache(localCacheTime, localCacheTimeUnit);

        return cache;
    }

    //syspar.sspfxrp
    @Bean
    public BusinessParamCache businessParamCache()
    {
        String cacheName = "BUSINESS_PARAMETER";

        return new BusinessParamCache(cacheName);
    }

    //internal reload cache control flag
    @Bean
    public CacheReloadingStatusCache cacheReloadingStatusCache()
    {
        String cacheName = "CACHE_RELOADING_STATUS";

        return new CacheReloadingStatusCache(cacheName);
    }

    //CardCacheHelper
    //tbl_cardcore_card_master
    @Bean
    public CardCache cardCache()
    {
        String cacheName = "CARD_ACCOUNT_DETAIL";

        return new CardCache(cacheName);
    }

    //CardCacheHelper
    //tbl_cardcore_card_master
    @Bean
    public CardNumberCache cardNumberCache()
    {
        String cacheName = "CARD_NUMBER_DETAIL";

        return new CardNumberCache(cacheName);
    }

    //CardCacheHelper
    //tbl_cardcore_card_master
    @Bean
    public CardEncryptedCache cardEncryptedCache()
    {
        String cacheName = CardEncryptedCache.CARD_ENCRYPTED_CACHE;

        return new CardEncryptedCache(cacheName);
    }

    //IssuingParamHelper
    //cardcore_issuing_param
    @Bean
    public IssuingParamCache issuingParamCache()
    {
        String cacheName = IssuingParamCache.BUSINESS_PARAMETER_PREFIX;

        return new IssuingParamCache(cacheName);
    }

    //IssuingParamHelper
    @Bean
    public IssuingParamObjectCache issuingParamObjectCache()
    {
        String cacheName = IssuingParamObjectCache.BUSINESS_PARAMETER_PREFIX;

        return new IssuingParamObjectCache(cacheName);
    }

    //ComplianceParamHelper
    //cardcore_compliance_param
    @Bean
    public ComplianceParamCache complianceParamCache()
    {
        String cacheName = ComplianceParamCache.BUSINESS_PARAMETER_PREFIX;

        return new ComplianceParamCache(cacheName);
    }
    
    //ProductCatalogueHelper
    @Bean
    public ProductCatalogueCache productCatalogueCache()
    {
        String cacheName = "PRODUCT_CATALOGUE";
        
        ProductCatalogueCache cache = new ProductCatalogueCache(cacheName);

        return cache;
    }

    private String getActiveProfie()
    {
        String[] activeProfiles = env.getActiveProfiles();

        for (String profile : activeProfiles)
        {
            if ("DEV".equals(profile)
                    || "SIT".equals(profile)
                    || "UAT".equals(profile)
                    || "DR".equals(profile)
                    || "PROD".equals(profile)
                    )
            {
                return profile;
            }
        }

        return "DEV";
    }

    public CacheResolver cacheResolver()
    {
        return new SimpleCacheResolver();
    }

    public CacheErrorHandler errorHandler()
    {
        return new SimpleCacheErrorHandler();
    }
    
    @Bean
    public MessageSource messageSource() {
        DatabaseResourceBundleMessageSource messageSource = new DatabaseResourceBundleMessageSource();
          
        return messageSource;
    }

    @Bean
    public ResourceBundleMessageSourceCache resourceBundleMessageSourceCache()
    {
        String cacheName = "MESSAGE_RESOURCE";

        ResourceBundleMessageSourceCache cache = new ResourceBundleMessageSourceCache(cacheName);

        // for DEV testing
        cache.setSupportLocalCache(localCacheTime, localCacheTimeUnit);

        // for PROD, use default
        //cache.setSupportLocalCache();
        return cache;
    }

}
