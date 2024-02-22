package com.programming.technie.models;

public interface IReqResModel<T> {
    T getData(); // return the data of the response
    String getMessage(); // Return a message if there has been any error, eg: on 404 error this needs to return "not found".
}
