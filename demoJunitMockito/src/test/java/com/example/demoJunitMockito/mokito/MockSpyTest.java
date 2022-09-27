package com.example.demoJunitMockito.mokito;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class MockSpyTest {

    @Mock
    private List<String> mockList;

    @Spy
    private List<String> spyList = new ArrayList<>();

    @Test
    public void testMockList(){
        // calling the methods of Mock object will do nothing
        mockList.add("test");
        assertNull(spyList.get(0));
    }

    @Test
    public void testSPyList(){
        // spy object will call the real method when not stub
        spyList.add("test");
        assertEquals("test", spyList.get(0));
    }

    @Test
    public void testMockListWithStub(){
        // normal stubbing
        String expected = "Mock 100";
        when(mockList.get(100)).thenReturn(expected);
        assertEquals(expected, mockList.get(100));
    }

    @Test
    public void testSPyListWithStub(){
        // the same stubbing as the mock object
        String expected = "Mock 100";
//        when(spyList.get(100)).thenReturn(expected);
        doReturn(expected).when(spyList).get(100);
        assertEquals(expected, spyList.get(100));
    }
}
