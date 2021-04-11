package ruf.jvali;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.function.Consumer;
import java.util.List;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.AbstractMap.SimpleEntry;

public class JsonValidator {

    private static final String RI = "_r";
    private static final String DL = ".";
    private static final Map<String, Consumer<CheckPoint>> VALIDICT = new HashMap<>();
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
        examine(subject, frame, vioPit, "_");
        return vios;
    }

    private void examine(JsonNode subject, JsonNode frame, Consumer<Entry<String, String>> pit, String ap) {
        if (subject == null || ! subject.isContainerNode()) {
            if ( ! isRule(frame)) {
                crash("Rule not foud at: <" + ap + ">");
            }
            check(subject, (ObjectNode)frame, msg -> pit.accept(new SimpleEntry<>(ap, msg)));
        } else if (subject.isObject()) {
            if ( ! frame.isObject()) {
                crash("Mismatch type at: <" + ap + ">");
            }
            ObjectNode oSubject = (ObjectNode) subject;
            ObjectNode oFrame = (ObjectNode) frame;
            Iterator<Entry<String, JsonNode>> ite = oFrame.fields();
            while (ite.hasNext()) {
                Entry<String, JsonNode> field = ite.next();
                String name = field.getKey();
                JsonNode subFrame = field.getValue();
                if (RI.equals(name)) {
                    if ( ! isRule(subFrame)) {
                        crash("Found rule field without rule at: <" + ap + ">");
                    }
                    check(oSubject, (ObjectNode)subFrame, msg -> pit.accept(new SimpleEntry<>(ap, msg)));
                } else {
                    examine(oSubject.get(name), subFrame, pit, ap+DL+name);
                }
            }
        } else if (subject.isArray()) {
            if ( ! frame.isArray()) {
                crash("Mismatch type at: <" + ap + ">");
            }
            ArrayNode aFrame = (ArrayNode)frame;
            if (aFrame.size() < 1) {
                crash("Expect at least 1 element at: " + ap + ">");
            }
            JsonNode firstFrame = aFrame.get(0);
            if (isRule(firstFrame)) {
                check(subject, (ObjectNode)firstFrame, msg -> pit.accept(new SimpleEntry<>(ap, msg)));
            }
            if (aFrame.size() == 1) return;
            JsonNode secondFrame = aFrame.get(1);
            ArrayNode aSubject = (ArrayNode)subject;
            Iterator<JsonNode> ite = aSubject.elements();
            int i = 0;
            if (isRule(secondFrame)) {
                ObjectNode iFrame = (ObjectNode) secondFrame;
                while (ite.hasNext()) {
                    String iap = ap + DL + i++;
                    check(ite.next(), iFrame, msg -> pit.accept(new SimpleEntry<>(iap, msg)));
                }
            } else {
                while (ite.hasNext()) {
                    String iap = ap + DL + i++;
                    examine(ite.next(), secondFrame, pit, iap);
                }
            }
        } else {
            out();
        }
    }
    
    private boolean isRule(JsonNode n) {
        if (n == null || ! n.isObject()) return false;
        ObjectNode on = (ObjectNode) n;
        JsonNode idf = on.get(RI);
        if (idf == null || ! idf.isInt()) return false;
        return idf.asInt() == 1;
    }

    private void crash(String msg) {
        throw new ValiException(msg);
    }

    private void check(JsonNode subject, ObjectNode frame, Consumer<String> pit) {
        Iterator<Entry<String, JsonNode>> ite = frame.fields();
        while (ite.hasNext()) {
            Entry<String, JsonNode> field = ite.next();
            String name = field.getKey();
            if (RI.equals(name)) continue;
            Consumer<CheckPoint> validator = VALIDICT.get(name);
            if (validator == null) {
                crash("Found no validator with name: <" + name + ">");
            } else {
                JsonNode args = field.getValue();
                CheckPoint cp = new CheckPoint(args, subject, pit);
                validator.accept(cp);
            }
        }
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
        public ValiException(String msg) {
            super(msg);
        }
    }

    static {
        VALIDICT.put("notNull", new NotNullValidator());
        VALIDICT.put("max", new MaxValidator());
        VALIDICT.put("oneOf", new OneOfValidator());
        VALIDICT.put("min", new MinValidator());
    }

    private static class NotNullValidator implements Consumer<CheckPoint> {
        private static final String MSG = "must not be null";
        @Override
        public void accept(CheckPoint cp) {
            JsonNode val = cp.getValue();
            if (val == null || val.isNull()) {
                cp.report(MSG);
            }
        }
    }

    private static class MaxValidator implements Consumer<CheckPoint> {
        private static final String MSG = "must have no more then {} element(s)";
        @Override
        public void accept(CheckPoint cp) {
            JsonNode val = cp.getValue();
            if (val == null) return;
            JsonNode args = cp.getArgs();
            if (args == null || ! args.isInt()) {
                throw new ValiException("Expect integer node as arguments for max validator");
            }
            int max = args.asInt();
            if (val.isArray()) {
                ArrayNode aVal = (ArrayNode)val;
                if (aVal.size() > max) {
                    cp.report(MSG.replace("{}", ""+max));
                }
            }
        }
    }

    private static class OneOfValidator implements Consumer<CheckPoint> {
        private static final String MSG = "must be one of pre-defined value(s)";
        @Override
        public void accept(CheckPoint cp) {
            JsonNode val = cp.getValue();
            if (val == null || val.isNull()) {
                return;
            }
            if ( ! val.isTextual()) {
                cp.report(MSG);
                return;
            }
            JsonNode args = cp.getArgs();
            if ( args == null || ! args.isTextual()) {
                throw new ValiException("Expect string node as arguments for oneOf validator");
            }
            String sVal = val.asText();
            String argString = args.asText();
            String[] allowedVals = args.asText().split("\\|");
            for (String aVal: allowedVals) {
                if (aVal.equals(sVal)) return;
            }
            cp.report(MSG);
        }
    }

    private static class MinValidator implements Consumer<CheckPoint> {
        private static final String MSG = "must have at least {} element(s)";
        @Override
        public void accept(CheckPoint cp) {
            JsonNode val = cp.getValue();
            if (val == null) return;
            JsonNode args = cp.getArgs();
            if (args == null || ! args.isInt()) {
                throw new ValiException("Expect integer node as arguments for min validator");
            }
            int min = args.asInt();
            if (val.isArray()) {
                ArrayNode aVal = (ArrayNode)val;
                if (aVal.size() < min) {
                    cp.report(MSG.replace("{}", ""+min));
                }
            } else if (val.isObject()) {
                ObjectNode oVal = (ObjectNode)val;
                if (oVal.size() < min) {
                    cp.report(MSG.replace("{}", ""+min));
                }
            }
        }
    }
}

