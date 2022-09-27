package com.example.demoJunitMockito.business;

import com.example.demoJunitMockito.data.api.TodoService;
import com.example.demoJunitMockito.data.api.TodoServiceStub;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class TodoBusinessImplStubTest {
    @Test
    public void testRetrieveTodosRelatedToSpring(){
        TodoService todoServiceStub = new TodoServiceStub();
        TodoBusinessImpl todoBusinessImpl = new TodoBusinessImpl(todoServiceStub);
        List<String> filteredTodos = todoBusinessImpl.retrieveTodosRelatedToSpring("User1");
        assertEquals(2, filteredTodos.size());
    }
}