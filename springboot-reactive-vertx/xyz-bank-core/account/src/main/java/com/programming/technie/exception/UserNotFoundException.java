package com.programming.technie.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User id: " + id + " was not found. ");
    }
}
