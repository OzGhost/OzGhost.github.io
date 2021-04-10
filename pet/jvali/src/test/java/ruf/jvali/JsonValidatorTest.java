package ruf.jvali;

import static org.junit.Assert.*;
import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Map.Entry;

public class JsonValidatorTest {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String RP = "src/test/java/resources/";

    @Test
    public void test_suit_01() throws Exception {
        run_suit("01");
    }

    @Test
    public void test_suit_02() throws Exception {
        run_suit("02");
    }

    @Test
    public void test_suit_03() throws Exception {
        run_suit("03");
    }

    @Test
    public void test_suit_04() throws Exception {
        run_suit("04");
    }

    @Test
    public void test_suit_05() throws Exception {
        run_suit("05");
    }

    private void run_suit(String sn) throws Exception {
        JsonNode frame = mapper.readTree(new File(RP + "suit_frame_"+sn+".txt"));
        JsonNode subject = mapper.readTree(new File(RP + "suit_subject_"+sn+".txt"));
        List<Entry<String, String>> vios = JsonValidator.from(frame).examine(subject);
        List<String> flatVios = new ArrayList<>(vios.size());
        for (Entry<String, String> e: vios) {
            flatVios.add(e.getKey() + " : " + e.getValue());
        }
        String[] rawVios = flatVios.toArray(new String[flatVios.size()]);
        Arrays.sort(rawVios);
        List<String> exp = null;
        try (BufferedReader br = new BufferedReader(new FileReader(new File(RP + "suit_output_"+sn+".txt")))) {
            exp = br.lines().collect(Collectors.toList());
        }
        String[] rawExp = exp.toArray(new String[exp.size()]);
        StringBuilder msg = new StringBuilder();
        boolean fall = false;
        if (rawExp.length != rawVios.length) {
            fall = true;
            msg.append("\nUnbalance in length, expected <")
                .append(rawExp.length).append("> but was <").append(rawVios.length).append(">\n");
        } else {
            msg.append('\n');
            for (int i = 0; i < rawVios.length; i++) {
                if ( ! (""+rawVios[i]).equals(rawExp[i])) {
                    fall = true;
                    msg.append("mismatch at ").append(i).append('\n');
                }
            }
        }
        if (fall) {
            msg.append("\n>> Expected: \n");
            for (int i = 0; i < rawExp.length; i++) {
                msg.append('#').append(i).append(": ").append(rawExp[i]).append('\n');
            }
            msg.append(">> But was: \n");
            for (int i = 0; i < rawVios.length; i++) {
                msg.append('#').append(i).append(": ").append(rawVios[i]).append('\n');
            }
            throw new Exception(msg.toString());
        }
    }
}

