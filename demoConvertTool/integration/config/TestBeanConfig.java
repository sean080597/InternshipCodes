package com.io.ktek.keno.integration.config;

import com.io.ktek.base.config.BeanConfig;
import com.io.ktek.integrationtest.cheat.ICheatScenario;
import com.io.ktek.integrationtest.comparer.IComparator;
import com.io.ktek.keno.config.GameConfig;
import com.io.ktek.keno.integration.cmatcher.*;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import({BeanConfig.class, GameConfig.class})
public class TestBeanConfig {

    @Bean
    public ICheatScenario cheatScenario() {
        return new CheatScenarioImpl();
    }

    @Bean(name = "ScoreMatcher")
    public IComparator scoreMatcher() {
        return new ScoreMatcher();
    }

    @Bean(name = "MultipleValidate")
    public IComparator multipleValidate() {
        return new MultipleValidate();
    }

    @Bean(name = "FixStartContains")
    public IComparator fixStartContains() {
        return new FixStartContains();
    }

    @Bean(name = "FixContains")
    public IComparator fixContains() {
        return new FixContains();
    }

    @Bean(name = "FixEqualContains")
    public IComparator fixEqualContains() {
        return new FixEqualContains();
    }
}
