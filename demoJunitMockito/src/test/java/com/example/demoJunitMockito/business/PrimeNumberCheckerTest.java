package com.example.demoJunitMockito.business;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Collection;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(Parameterized.class)
public class PrimeNumberCheckerTest {

    private final Integer inputNumber;
    private final Boolean expectedResult;
    private PrimeNumberChecker primeNumberChecker;

    @Before
    public void setUp(){
        primeNumberChecker = new PrimeNumberChecker();
    }

    public PrimeNumberCheckerTest(Integer inputNumber, Boolean expectedResult) {
        this.inputNumber = inputNumber;
        this.expectedResult = expectedResult;
    }

    @Parameterized.Parameters
    public static Collection primeNumber(){
        return List.of(new Object[][]{{2, true}, {6, false}, {19, true}, {22, false}});
    }

    @Test
    public void validate() {
        System.out.println("Parameterized Number is: " + inputNumber);
        assertEquals(expectedResult, primeNumberChecker.validate(inputNumber));
    }
}