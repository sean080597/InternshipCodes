package com.example.demoJunitMockito.data.api;

import java.util.List;

public interface TodoService {

    List<String> retrieveTodos(String user);

    void deleteTodo(String todo);
}
