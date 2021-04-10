package ruf.jvali;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.function.Consumer;
import java.util.List;
import java.util.LinkedList;
import java.util.Map.Entry;

public class JsonValidator {

    private static final String RI = "_r";
    private JsonNode frame;
    
    private JsonValidator(JsonNode f) {
        frame = f;
    }

    public static JsonValidator from(JsonNode frame) {
        return new JsonValidator(frame);
    }

    public List<Entry<String, String>> examine(JsonNode subject) {
        List<Entry<String, String>> vios = new LinkedList<>();
        Consumer<Entry<String, String>> vioPit = e -> vios.add(e);
        examine(frame, subject, vioPit, "_");
        return vios;
    }

    private void examine(JsonNode subject, JsonNode frame, Consumer<Entry<String, String>> pit, String ap) {
        if (subject == null || subject.isValueNode()) {
            if ( ! isRule(frame)) {
                crash("Rule not foud at: " + ap);
            }
            check(subject, (ObjectNode)frame, msg -> pit.accept(new SimpleEntry<>(ap, msg)));
        } else if (subject.isObject()) {
            ObjectNode oSubject = (ObjectNode) subject;
            if (frame.isObject()) {
                crash("Mismatch type at: " + ap);
            }
            ObjectNode oFrame = (ObjectNode) frame;
            Iterator<Entry<String, JsonNode>> ite = oFrame.fields();
            while (ite.hasNext()) {
                Entry<String, JsonNode> field = ite.next();
                String name = field.getKey();
                JsonNode subFrame = field.getValue();
                if (RI.equals(field.getKey())) {
                    if ( ! isRule(subFrame)) {
                        crash("Found rule field without rule at: " + ap);
                    }
                    check(oSubject, (ObjectNode)subFrame, msg -> pit.accept(new SimpleEntry<>(ap, msg)));
                } else {
                    examine(oSubject.get(name), subFrame, pit, ap + "." + name);
                }
            }
        } else {
            out();
        }
    }

    private void crash(String msg) {
        throw new ValiException(msg);
    }
    
    private void out() {
        throw new RuntimeException("[xx] not supported yet");
    }

    private static class CheckPoint {
        private JsonNode args;
        private JsonNode value;
        private Consumer<String> pit;

        private CheckPoint(JsonNode a, JsonNode v, Consumer<String> p) {
            args = a;
            value = v;
            pit = p;
        }

        private JsonNode getArgs() {
            return args;
        }
        
        private JsonNode getValue() {
            return value;
        }

        private void report(String vioMsg) {
            pit.accept(vioMsg);
        }
    }

    private static class ValiException extends RuntimeException {
        public ValidateException(String msg) {
            super(msg);
        }
    }
}

