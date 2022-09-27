package com.example.demoJunitMockito.business;

import com.example.demoJunitMockito.data.api.TodoService;
import org.junit.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

public class TodoBusinessImplMockTest {
    @Test
    public void usingMockito(){
        TodoService todoServiceMock = mock(TodoService.class);
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        when(todoServiceMock.retrieveTodos("Dummy")).thenReturn(todoLs);
        TodoBusinessImpl todoBusinessImpl = new TodoBusinessImpl(todoServiceMock);
        List<String> filteredTodos = todoBusinessImpl.retrieveTodosRelatedToSpring("Dummy");
        assertNotNull(filteredTodos);
        assertEquals(2, filteredTodos.size());
    }

    @Test
    public void usingMockito_UsingBDD(){
        TodoService todoService = mock(TodoService.class);
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        TodoBusinessImpl todoBusinessImpl = new TodoBusinessImpl(todoService);

        // given
        given(todoService.retrieveTodos("Ranga")).willReturn(todoLs);

        // when
        List<String> filteredTodos = todoBusinessImpl.retrieveTodosRelatedToSpring("Ranga");

        // then
        assertThat(filteredTodos.size()).isEqualTo(2);
    }

    @Test
    public void letsTestDeleteNow(){
        TodoService todoService = mock(TodoService.class);
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        TodoBusinessImpl todoBusinessImpl = new TodoBusinessImpl(todoService);

        // given
        given(todoService.retrieveTodos("Ranga")).willReturn(todoLs);

        // when
        todoBusinessImpl.deleteTodosNotRelatedToSpring("Ranga");

        // then
        verify(todoService).deleteTodo("Learn to Dance");
        verify(todoService, never()).deleteTodo("Learn Spring");
        verify(todoService, never()).deleteTodo("Learn Spring MVC");
        verify(todoService, times(1)).deleteTodo("Learn to Dance");
    }
}