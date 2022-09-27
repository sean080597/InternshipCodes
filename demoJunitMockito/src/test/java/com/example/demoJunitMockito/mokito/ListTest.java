package com.example.demoJunitMockito.mokito;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ListTest {

    @Test
    public void letsMockListSize(){
        List list = mock(List.class);
        when(list.size()).thenReturn(10);
        assertEquals(10, list.size());
    }

    @Test
    public void letsMockListSizeWithMultipleReturnValues(){
        List list = mock(List.class);
        when(list.size()).thenReturn(10).thenReturn(20);
        assertEquals(10, list.size());
        assertEquals(20, list.size());
    }

    @Test
    public void letsMockListGet(){
        List<String> list = mock(List.class);
        when(list.get(0)).thenReturn("blahblah");
        assertEquals("blahblah", list.get(0));
        assertNull(list.get(1));
    }

    @Test
    public void letsMockListGetWithAny(){
        List<String> list = mock(List.class);
        when(list.get(anyInt())).thenReturn("blahblah");
        assertEquals("blahblah", list.get(0));
        assertEquals("blahblah", list.get(1));
    }
}
