package com.io.ktek.keno.integration;

import com.io.ktek.base.config.ExternalServiceConfig;
import com.io.ktek.base.config.model.GameConfigInfo;
import com.io.ktek.base.endpoint.WalletService;
import com.io.ktek.base.endpoint.impl.WalletFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Primary
@Profile("test")
public class WalletFactoryTest extends WalletFactory {
    @Autowired
    private WalletService walletService;

    public WalletFactoryTest(ExternalServiceConfig serviceConfig, GameConfigInfo configInfo) {
        super(serviceConfig, configInfo);
    }

    @Override
    public WalletService findWalletAgent(String userAgent) {
        return walletService;
    }

    @Override
    public boolean isValidAgent(String userAgent) {
        return true;
    }
}
