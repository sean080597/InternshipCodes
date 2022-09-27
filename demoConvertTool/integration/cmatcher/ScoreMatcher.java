package com.io.ktek.keno.integration.cmatcher;

import com.io.ktek.integrationtest.comparer.IComparator;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ScoreMatcher implements IComparator {

    @Override
    public boolean match(JSONObject expected, Object actual) {
        assertTrue(expected.has("delimiter"), "Invalid input for " + this.getClass().getSimpleName() + ". Delimiter not found: " + expected);
        assertTrue(expected.has("value"), "Invalid input for " + this.getClass().getSimpleName() + ". Value not found: " + expected);

        String expectedDelimiter = expected.getString("delimiter");
        List<String> actualResult = new ArrayList<>(List.of(actual.toString().split(expectedDelimiter)));
        List<String> expectedResult = new ArrayList<>(List.of(expected.getString("value").split(expectedDelimiter)));

        // get score of actual result
        String actualLastEle = actualResult.get(actualResult.size() - 1);
        String actualScore = actualLastEle.split(":")[1];
        actualResult.set(actualResult.size() - 1, actualLastEle.split(":")[0]);

        // get score of expected result
        String expectedScore = String.valueOf(expectedResult.stream().map(Integer::parseInt).reduce(0, Integer::sum));

        if(!actualScore.equals(expectedScore)) return false;

        for (String str : expectedResult){
            if(actualResult.stream().noneMatch(t -> t.contains(str))){
                return false;
            }
        }
        return true;
    }
}
