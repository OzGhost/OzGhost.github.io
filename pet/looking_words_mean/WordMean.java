import java.net.*;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public class WordMean {
    private static String[] words;

    private static final String NOR_PREFIX  = "";
    private static final String OBJ_PREFIX  = "    ";
    private static final String CTX_PREFIX  = "        ";
    private static final String ARR_PREFIX  = "            ";

    private static final String MEAN_URL
        = "https://vdict.com/%s,1,0,0.html";
    private static final String AUDIO_URL
        = "https://www.vocabulary.com/dictionary/%s";
    private static final String SPELL_PATTERN
        = "<div class=\"pronounce\">\\/[^<>]+\\/<\\/div>";
    private static final String MEAN_PATTERN
        = "<ul class=\"list1\"><li><b>[^<>]+<\\/b>";
    private static final String AUDIO_PATTERN
        = "data-audio=\"[^<>=]+\"";

    private static String loadPage (String uri) throws Exception {
        final URL link = new URL(uri);
        final URLConnection con = link.openConnection();
        final BufferedReader in = new BufferedReader(
            new InputStreamReader(
                con.getInputStream()
            )
        );
        String inputLine = in.readLine();
        final StringBuilder sb = new StringBuilder();
        while (inputLine != null) {
            sb.append(inputLine);
            inputLine = in.readLine();
        }
        return sb.toString();
    }

    private static String[] loadRelatePage (String word) throws Exception {
        String[] rs = new String[2];
        rs[0] = loadPage( String.format(MEAN_URL, word) );
        rs[1] = loadPage( String.format(AUDIO_URL, word) );
        return rs;
    }

    private static String[] getRelateThing (String[] pageContent, String word) {
        final List<String> rs = new LinkedList<>();
        rs.add(word);

        final Matcher spellMatcher = Pattern.compile(SPELL_PATTERN)
            .matcher(pageContent[0]);
        final Matcher meanMatcher = Pattern.compile(MEAN_PATTERN)
            .matcher(pageContent[0]);
        final Matcher audioMatcher = Pattern.compile(AUDIO_PATTERN)
            .matcher(pageContent[1]);

        // spell load
        if (spellMatcher.find()) {
            final String g = spellMatcher.group();
            final int len = g.length();
            rs.add(
                g.substring(23, len - 6)
            );
        } else {
            rs.add("?");
        }

        if (audioMatcher.find()) {
            final String g = audioMatcher.group();
            final int len = g.length();
            rs.add(
                g.substring(12, len - 1)
            );
        } else {
            rs.add("?");
        }
        
        while (meanMatcher.find()) {
            final String g = meanMatcher.group();
            final int len = g.length();
            rs.add(g.substring(25, len - 4));
        }
        return rs.toArray(new String[rs.size()]);
    }

    private static String toJSON (String[] spellNMean) {
        final StringBuilder rs = new StringBuilder();
        rs.append(OBJ_PREFIX + "{\n");
        rs.append(CTX_PREFIX + "word: \"" + spellNMean[0] + "\",\n");
        rs.append(CTX_PREFIX + "spell: \"" + spellNMean[1] + "\",\n");
        rs.append(CTX_PREFIX + "audioCode: \"" + spellNMean[2] + "\",\n");
        rs.append(CTX_PREFIX + "means: [\n");
        String colon = "";
        for (int i = 3; i < spellNMean.length; i++) {
            rs.append(colon);
            rs.append(ARR_PREFIX + "\"" + spellNMean[i] + "\"");
            colon = ",\n";
        }
        rs.append("\n" + CTX_PREFIX + "]\n");
        rs.append(OBJ_PREFIX + "}");
        return rs.toString();
    }
    
    public static void main (String[] args) throws Exception {
        PrintWriter pw = null;
        String colon = "";
        try {
            pw = new PrintWriter("/tmp/words.json", "UTF-8");
            pw.write("var words = [\n");
            for (String word: words) {
                String[] pages = loadRelatePage(word);
                String[] rs = getRelateThing(pages, word);
                pw.write(colon);
                pw.write( toJSON(rs) );
                colon = ",\n";
            }
            pw.write("\n]");
            pw.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try { pw.close(); } catch (Exception e) {}
        }
    }

    static {
        words = new String[] {"the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "hot", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father", "head", "stand", "own", "page", "should", "country", "found", "answer", "school", "grow", "study", "still", "learn", "plant", "cover", "food", "sun", "four", "between", "state", "keep", "eye", "never", "last", "let", "thought", "city", "tree", "cross", "farm", "hard", "start", "might", "story", "saw", "far", "sea", "draw", "left", "late", "run", "don't", "while", "press", "close", "night", "real", "life", "few", "north", "open", "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease", "paper", "group", "always", "music", "those", "both", "mark", "often", "letter", "until", "mile", "river", "car", "feet", "care", "second", "book", "carry", "took", "science", "eat", "room", "friend", "began", "idea", "fish", "mountain", "stop", "once", "base", "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "enough", "plain", "girl", "usual", "young", "ready", "above", "ever", "red", "list", "though", "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "pose", "leave", "song", "measure", "door", "product", "black", "short", "numeral", "class", "wind", "question", "happen", "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem", "piece", "told", "knew", "pass", "since", "top", "whole", "king", "space", "heard", "best", "hour", "better", "true", "during", "hundred", "five", "remember", "step", "early", "hold", "west", "ground", "interest", "reach", "fast", "verb", "sing", "listen", "six", "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war", "lay", "against", "pattern", "slow", "center", "love", "person", "money", "serve", "appear", "road", "map", "rain", "rule", "govern", "pull", "cold", "notice", "voice", "unit", "power", "town", "fine", "certain", "fly", "fall", "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun", "field", "rest", "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain", "front", "teach", "week", "final", "gave", "green", "oh", "quick", "develop", "ocean", "warm", "free", "minute", "strong", "special", "mind", "behind", "clear", "tail", "produce", "fact", "street", "inch", "multiply", "nothing", "course", "stay", "wheel", "full", "force", "blue", "object", "decide", "surface", "deep", "moon", "island", "foot", "system", "busy", "test", "record", "boat", "common", "gold", "possible", "plane", "stead", "dry", "wonder", "laugh", "thousand", "ago", "ran", "check", "game", "shape", "equate", "hot", "miss", "brought", "heat", "snow", "tire", "bring", "yes", "distant", "fill", "east", "paint", "language", "among", "grand", "ball", "yet", "wave", "drop", "heart", "am", "present", "heavy", "dance", "engine", "position", "arm", "wide", "sail", "material", "size", "vary", "settle", "speak", "weight", "general", "ice", "matter", "circle", "pair", "include", "divide", "syllable", "felt", "perhaps", "pick", "sudden", "count", "square", "reason", "length", "represent", "art", "subject", "region", "energy", "hunt", "probable", "bed", "brother", "egg", "ride", "cell", "believe", "fraction", "forest", "sit", "race", "window", "store", "summer", "train", "sleep", "prove", "lone", "leg", "exercise", "wall", "catch", "mount", "wish", "sky", "board", "joy", "winter", "sat", "written", "wild", "instrument", "kept", "glass", "grass", "cow", "job", "edge", "sign", "visit", "past", "soft", "fun", "bright", "gas", "weather", "month", "million", "bear", "finish", "happy", "hope", "flower", "clothe", "strange", "gone", "jump", "baby", "eight", "village", "meet", "root", "buy", "raise", "solve", "metal", "whether", "push", "seven", "paragraph", "third", "shall", "held", "hair", "describe", "cook", "floor", "either", "result", "burn", "hill", "safe", "cat", "century", "consider", "type", "law", "bit", "coast", "copy", "phrase", "silent", "tall", "sand", "soil", "roll", "temperature", "finger", "industry", "value", "fight", "lie", "beat", "excite", "natural", "view", "sense", "ear", "else", "quite", "broke", "case", "middle", "kill", "son", "lake", "moment", "scale", "loud", "spring", "observe", "child", "straight", "consonant", "nation", "dictionary", "milk", "speed", "method", "organ", "pay", "age", "section", "dress", "cloud", "surprise", "quiet", "stone", "tiny", "climb", "cool", "design", "poor", "lot", "experiment", "bottom", "key", "iron", "single", "stick", "flat", "twenty", "skin", "smile", "crease", "hole", "trade", "melody", "trip", "office", "receive", "row", "mouth", "exact", "symbol", "die", "least", "trouble", "shout", "except", "wrote", "seed", "tone", "join", "suggest", "clean", "break", "lady", "yard", "rise", "bad", "blow", "oil", "blood", "touch", "grew", "cent", "mix", "team", "wire", "cost", "lost", "brown", "wear", "garden", "equal", "sent", "choose", "fell", "fit", "flow", "fair", "bank", "collect", "save", "control", "decimal", "gentle", "woman", "captain", "practice", "separate", "difficult", "doctor", "please", "protect", "noon", "whose", "locate", "ring", "character", "insect", "caught", "period", "indicate", "radio", "spoke", "atom", "human", "history", "effect", "electric", "expect", "crop", "modern", "element", "hit", "student", "corner", "party", "supply", "bone", "rail", "imagine", "provide", "agree", "thus", "capital", "won't", "chair", "danger", "fruit", "rich", "thick", "soldier", "process", "operate", "guess", "necessary", "sharp", "wing", "create", "neighbor", "wash", "bat", "rather", "crowd", "corn", "compare", "poem", "string", "bell", "depend", "meat", "rub", "tube", "famous", "dollar", "stream", "fear", "sight", "thin", "triangle", "planet", "hurry", "chief", "colony", "clock", "mine", "tie", "enter", "major", "fresh", "search", "send", "yellow", "gun", "allow", "print", "dead", "spot", "desert", "suit", "current", "lift", "rose", "continue", "block", "chart", "hat", "sell", "success", "company", "subtract", "event", "particular", "deal", "swim", "term", "opposite", "wife", "shoe", "shoulder", "spread", "arrange", "camp", "invent", "cotton", "born", "determine", "quart", "nine", "truck", "noise", "level", "chance", "gather", "shop", "stretch", "throw", "shine", "property", "column", "molecule", "select", "wrong", "gray", "repeat", "require", "broad", "prepare", "salt", "nose", "plural", "anger", "claim", "continent", "oxygen", "sugar", "death", "pretty", "skill", "women", "season", "solution", "magnet", "silver", "thank", "branch", "match", "suffix", "especially", "fig", "afraid", "huge", "sister", "steel", "discuss", "forward", "similar", "guide", "experience", "score", "apple", "bought", "led", "pitch", "coat", "mass", "card", "band", "rope", "slip", "win", "dream", "evening", "condition", "feed", "tool", "total", "basic", "smell", "valley", "nor", "double", "seat", "arrive", "master", "track", "parent", "shore", "division", "sheet", "substance", "favor", "connect", "post", "spend", "chord", "fat", "glad", "original", "share", "station", "dad", "bread", "charge", "proper", "bar", "offer", "segment", "slave", "duck", "instant", "market", "degree", "populate", "chick", "dear", "enemy", "reply", "drink", "occur", "support", "speech", "nature", "range", "steam", "motion", "path", "liquid", "log", "meant", "quotient", "teeth", "shell", "neck"};
    }
}

