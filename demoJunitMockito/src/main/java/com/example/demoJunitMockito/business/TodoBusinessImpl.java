package com.example.demoJunitMockito.business;

import com.example.demoJunitMockito.data.api.TodoService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TodoBusinessImpl {

    private TodoService todoService;

    public TodoBusinessImpl(TodoService todoService) {
        this.todoService = todoService;
    }

    public List<String> retrieveTodosRelatedToSpring(String user) {
        List<String> allTodos = todoService.retrieveTodos(user);
        return allTodos.stream().filter(t -> t.contains("Spring")).collect(Collectors.toList());
    }

    public void deleteTodosNotRelatedToSpring(String user){
        List<String> allTodos = todoService.retrieveTodos(user);
        allTodos.forEach(t -> {
            if(!t.contains("Spring")){
                todoService.deleteTodo(t);
            }
        });
    }
}
