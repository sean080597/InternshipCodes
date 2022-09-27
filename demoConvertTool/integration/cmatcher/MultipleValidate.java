package com.io.ktek.keno.integration.cmatcher;

import com.io.ktek.integrationtest.comparer.IComparator;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.fail;

public class MultipleValidate implements IComparator {

    @Autowired
    private ApplicationContext context;

    @Override
    public boolean match(JSONObject expected, Object actual) {
        JSONArray arr = expected.getJSONArray("values");
        for (Object obj : arr){
            if(obj instanceof JSONObject){
                JSONObject tmp = (JSONObject) obj;
                try{
                    String type = tmp.getString("_type_");
                    IComparator comparator = (IComparator) context.getBean(type);
                    if(!comparator.match(tmp, actual)){
                        return false;
                    }
                }catch (JSONException ex){
                    fail("Missing _type_: " + ex.getMessage());
                }catch (BeansException ex){
                    fail("Invalid _type_: " + ex.getMessage());
                }
            }
        }
        return true;
    }
}
