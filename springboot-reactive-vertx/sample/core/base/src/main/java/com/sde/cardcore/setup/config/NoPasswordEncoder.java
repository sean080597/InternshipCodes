package com.xyz.cardcore.setup.config;

import org.springframework.security.crypto.password.PasswordEncoder;

public class NoPasswordEncoder implements PasswordEncoder
{
    @Override
    public String encode(CharSequence rawPassword)
    {
        return "123";
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword)
    {
        return true;
    }

}
