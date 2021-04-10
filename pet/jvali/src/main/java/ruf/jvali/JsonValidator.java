package ruf.jvali;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import java.util.LinkedList;
import java.util.Map.Entry;

public class JsonValidator {

    private JsonNode frame;
    
    private JsonValidator(JsonNode f) {
        frame = f;
    }

    public static JsonValidator from(JsonNode frame) {
        return new JsonValidator(frame);
    }

    public List<Entry<String, String>> examine(JsonNode subject) {
        return new LinkedList<>();
    }
}

