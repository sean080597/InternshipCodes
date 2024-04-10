package com.xyz.cardcore.setup.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import com.xyz.cardcore.service.SystemUserDetailsService;
import com.xyz.cardcore.service.SystemUserService;
import com.xyz.ms.util.SpringBeanUtil;

@Configuration
@EnableWebFluxSecurity
public class WebSecurityConfig {
    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

    /**
     * Remove the ROLE_ prefix
     */
    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults(){
        return new GrantedAuthorityDefaults("");
    }

    private SystemUserDetailsService systemUserDetailsService() {
        SystemUserDetailsService systemUserDetailsService = new SystemUserDetailsService();
        systemUserDetailsService.setSystemUserService(SpringBeanUtil.getBean(SystemUserService.class));
        return systemUserDetailsService;
    }

    @Bean
    public AuthManager authenticationManager() {
        return new AuthManager(systemUserDetailsService());
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) throws Exception {
        http
            .authorizeExchange(ex -> ex
                .pathMatchers("/monitoring/**").hasAnyAuthority("ROLE_MONITOR")
                .pathMatchers("/exceptionhandler/**").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                // .requestMatchers(new AntPathRequestMatcher("/**")).hasAnyAuthority("ROLE_REMOTE")
                .pathMatchers("/**").permitAll()
                .anyExchange().denyAll())
            .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // use stateless sessions
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .cors(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults())
            .authenticationManager(authenticationManager());
        return http.build();
    }

    @Bean
    public NoPasswordEncoder passwordEncoder() {
        return new NoPasswordEncoder();
    }
}
