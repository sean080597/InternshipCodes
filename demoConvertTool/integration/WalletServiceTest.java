package com.io.ktek.keno.integration;

import com.google.common.util.concurrent.ListenableFuture;
import com.io.ktek.base.endpoint.WalletService;
import com.io.ktek.base.grpc.wallet.ResponseStatusMultiple;
import com.io.ktek.base.grpc.wallet.WalletMoney;
import com.io.ktek.base.grpc.wallet.WalletMoneyMultiple;
import com.io.ktek.base.grpc.wallet.WalletMultipleAction;
import com.io.ktek.integrationtest.annotation.ITWallet;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
@ITWallet
public class WalletServiceTest implements WalletService {
    @Override
    public double getWalletAmount(String userId) {
        return 0;
    }

    @Override
    public boolean betAction(WalletMoney walletMoney) {
        return false;
    }

    @Override
    public ResponseStatusMultiple betActionMultiple(WalletMoneyMultiple walletMoneyMultiple, String playSessionId) {
        return null;
    }

    @Override
    public boolean betActionMultipleWithoutResponse(WalletMoneyMultiple walletMoneyMultiple, String playSessionId) {
        return false;
    }

    @Override
    public ListenableFuture<ResponseStatusMultiple> betActionMultipleFuture(WalletMoneyMultiple multiBet) {
        return null;
    }

    @Override
    public boolean winAction(WalletMoney walletMoney) {
        return false;
    }

    @Override
    public void winActionMultiple(WalletMoneyMultiple walletMoneyMultiple, String playSessionId) {

    }

    @Override
    public boolean reserveAction(WalletMoney walletMoney) {
        return false;
    }

    @Override
    public boolean releaseAction(WalletMoney walletMoney) {
        return false;
    }

    @Override
    public boolean commitAndWinActionMultiple(WalletMultipleAction walletMultipleAction, String playSessionId) {
        return false;
    }

    @Override
    public ResponseStatusMultiple reserveActionMultiple(WalletMoneyMultiple walletMoneyMultiple, String playSessionId) {
        return null;
    }
}
