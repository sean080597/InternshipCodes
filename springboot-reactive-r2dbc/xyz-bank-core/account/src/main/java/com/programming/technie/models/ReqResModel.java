package com.programming.technie.models;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ReqResModel<T> implements IReqResModel<T> {
    private T data;
    private String message;

    @Override
    public T getData() {
        return data;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
