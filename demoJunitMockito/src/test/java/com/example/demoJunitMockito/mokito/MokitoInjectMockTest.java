package com.example.demoJunitMockito.mokito;

import com.example.demoJunitMockito.business.TodoBusinessImpl;
import com.example.demoJunitMockito.data.api.TodoService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class MokitoInjectMockTest {

    @Mock
    TodoService todoServiceMock;

    @InjectMocks
    TodoBusinessImpl todoBusinessImpl;

    @Test
    public void usingMockito(){
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        when(todoServiceMock.retrieveTodos("Dummy")).thenReturn(todoLs);
        List<String> filteredTodos = todoBusinessImpl.retrieveTodosRelatedToSpring("Dummy");
        assertNotNull(filteredTodos);
        assertEquals(2, filteredTodos.size());
    }

    @Test
    public void usingMockito_UsingBDD(){
        // given
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        given(todoServiceMock.retrieveTodos("Ranga")).willReturn(todoLs);

        // when
        List<String> filteredTodos = todoBusinessImpl.retrieveTodosRelatedToSpring("Ranga");

        // then
        assertThat(filteredTodos.size()).isEqualTo(2);
    }

    @Test
    public void letsTestDeleteNow(){
        // given
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        given(todoServiceMock.retrieveTodos("Ranga")).willReturn(todoLs);

        // when
        todoBusinessImpl.deleteTodosNotRelatedToSpring("Ranga");

        // then
        verify(todoServiceMock).deleteTodo("Learn to Dance");
        verify(todoServiceMock, never()).deleteTodo("Learn Spring");
        verify(todoServiceMock, never()).deleteTodo("Learn Spring MVC");
        verify(todoServiceMock, times(1)).deleteTodo("Learn to Dance");
    }

    @Test
    public void testArgCaptorDelete(){
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        // given
        List<String> todoLs = List.of("Learn Spring MVC", "Learn Spring", "Learn to Dance");
        given(todoServiceMock.retrieveTodos("Ranga")).willReturn(todoLs);

        // when
        todoBusinessImpl.deleteTodosNotRelatedToSpring("Ranga");

        // then
        verify(todoServiceMock).deleteTodo(captor.capture());
        verify(todoServiceMock, never()).deleteTodo("Learn Spring");
        verify(todoServiceMock, never()).deleteTodo("Learn Spring MVC");
        verify(todoServiceMock, times(1)).deleteTodo("Learn to Dance");
        assertEquals("Learn to Dance", captor.getValue());
    }
}
