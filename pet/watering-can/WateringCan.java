import org.dhatim.fastexcel.reader.ReadableWorkbook;
import org.dhatim.fastexcel.reader.ExcelReaderException;
import org.dhatim.fastexcel.reader.Sheet;
import org.dhatim.fastexcel.reader.Row;
import org.dhatim.fastexcel.reader.CellType;
import org.dhatim.fastexcel.reader.Cell;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.HashMap;
import java.util.Optional;
import java.util.LinkedList;
import java.util.ArrayList;
import java.util.Date;
import java.text.SimpleDateFormat;

public class WateringCan {
    public static boolean verbose = false;
    public static SimpleDateFormat dateFmt = new SimpleDateFormat("dd/MM/yyyy");

    public static void main(String[] args) throws Exception {
        new WateringCan().run();
    }

    public void run() throws Exception {
        try (
            BufferedInputStream is = new BufferedInputStream(new FileInputStream("input.xlsx"));
            ReadableWorkbook wb = new ReadableWorkbook(is);
            //BufferedOutputStream osj = new BufferedOutputStream(new FileOutputStream("output.join.csv"));
            BufferedOutputStream oss = new BufferedOutputStream(new FileOutputStream("output.split.csv"))
        ) {
            BufferedOutputStream osj = null; //fme
            HashMap<String, LinkedList<ShipUnit>> shipMap = toShipMap(wb.getFirstSheet());
            Optional<Sheet> osheet = wb.getSheet(1);
            if (!osheet.isPresent()) {
                lof("[e] 2nd sheet not found!");
                return;
            }
            downStream(osheet.get(), shipMap, osj, oss);
        }
    }

    public HashMap<String, LinkedList<ShipUnit>> toShipMap(Sheet sh) throws Exception {
        lof("[i] loading ship map ...");
        HashMap<String, ArrayList<ShipUnit>> buf = new HashMap<>();
        Iterator<Row> irow = sh.openStream().iterator();
        if (irow.hasNext())
            irow.next(); //drop title row
        while (irow.hasNext()) {
            Row r = irow.next();
            int rline = r.getRowNum();
            if ("".equals(asString(r, ShipUnit.ID_IDX))) {
                lof("[w] stop reading due to empty material cell, sheet=1st row=" + rline);
                printRow(r);
                break;
            }
            ShipUnit u = new ShipUnit(r);
            ArrayList<ShipUnit> l = new ArrayList<>();
            l.add(u);
            buf.merge(u.id, l, this::append);
        }
        HashMap<String, LinkedList<ShipUnit>> out = new HashMap<>();
        for (Entry<String, ArrayList<ShipUnit>> e : buf.entrySet()) {
            String k = e.getKey();
            ArrayList<ShipUnit> v = e.getValue();
            v.sort(this::byETA);
            LinkedList<ShipUnit> sorted = new LinkedList<>();
            for (ShipUnit s: v)
                sorted.offer(s);
            out.put(k, sorted);
        }
        lof("[i] ship map loaded!");
        return out;
    }

    public ArrayList<ShipUnit> append(ArrayList<ShipUnit> oldl, ArrayList<ShipUnit> newl) {
        oldl.add(newl.get(0));
        return oldl;
    }

    public int byETA(ShipUnit a, ShipUnit b) {
        String x = "instock";
        if (x.equals(a.eta))
            return x.equals(b.eta) ? 0 : -1;
        if (x.equals(b.eta))
            return 1;
        if (a.etaT == null)
            return b.etaT == null ? 0 : 1;
        if (b.etaT == null)
            return -1;
        return a.etaT.compareTo(b.etaT);
    }

    public void downStream(
        Sheet sh,
        HashMap<String, LinkedList<ShipUnit>> shipMap,
        BufferedOutputStream osj,
        BufferedOutputStream oss
    ) throws Exception {
        lof("[i] watering orders ...");
        Iterator<Row> irow = sh.openStream().iterator();
        if (irow.hasNext()) {
            Row title = irow.next();
            writeLine(oss, words(title), null);
        }
        while (irow.hasNext()) {
            Row r = irow.next();
            int rline = r.getRowNum();
            String id = asString(r, 5);
            if ("".equals(id)) {
                lof("[w] stop reading due to empty material cell, sheet=2nd row=" + rline);
                printRow(r);
                break;
            }
            int req = asInt(r, 9);
            LinkedList<ShipUnit> ships = shipMap.get(id);
            String[] head = readHead(r);
            if (ships == null) {
                ships = new LinkedList<>();
                lof("[w] id not found in ship map id=<"+id+"> on row=" + rline);
            }
            log("[i] on order="+asString(r, 0)+" need="+id+" qty=" + req);
            LinkedList<ShipUnit> pickShips = new LinkedList<>();
            while (req > 0 && !ships.isEmpty()) {
                ShipUnit ship = ships.peek();
                if (ship.remain > req) {
                    ship.remain -= req;
                    pickShips.offer(new ShipUnit(ship, req));
                    log("[i]__ take part ship date="+ship.eta+" qty="+req);
                    req = 0;
                    break;
                } else {
                    req -= ship.remain;
                    pickShips.offer(ships.poll());
                    log("[i]__ take full ship date="+ship.eta+" qty="+ship.remain);
                }
            }
            if (req != 0)
                pickShips.offer(new ShipUnit(0));
            writeLine(oss, head, pickShips);
        }
        lof("[i] done!");
    }

    public void writeLine(BufferedOutputStream os, String[] head, LinkedList<ShipUnit> ships) throws Exception {
        write(os, head, false);
        if (ships != null && !ships.isEmpty()) {
            for (ShipUnit ship: ships)
                write(os, ship.flatForm(), true);
        }
        writeRaw(os, "\n");
    }

    public void write(BufferedOutputStream os, String[] cells, boolean tail) throws Exception {
        int len = cells.length;
        if (len == 0) {
            throw new RuntimeException("unexpected length=0");
        }
        if (tail)
            writeRaw(os, ",");
        String norm = normalize(cells[0]);
        writeRaw(os, norm);
        for (int i = 1; i < len; i++) {
            String c = cells[i];
            norm = normalize(c);
            writeRaw(os, ",");
            writeRaw(os, norm);
        }
    }

    public String normalize(String s) {
        if (s.indexOf((int)',') < 0 &&
                s.indexOf((int)'"') < 0 &&
                s.indexOf((int)'\n') < 0) {
            return s;
        }
        return "\"" + s.replaceAll("\"", "\"\"") + "\"";
    }

    public void writeRaw(BufferedOutputStream os, String s) throws Exception {
        byte[] bs = s.getBytes();
        os.write(bs, 0, bs.length);
    }

    public String[] readHead(Row r) {
        String[] out = new String[13];
        for (int i = 0; i < 13; i++)
            out[i] = asString(r, i);
        return out;
    }

    public String[] words(Row r) {
        int len = r.getCellCount();
        String[] out = new String[len];
        for (int i = 0; i < len; i++)
            out[i] = asString(r, i);
        return out;
    }

    public class ShipUnit {
        public static final int ID_IDX = 5;
        public String id = ""; //5
        public int remain = 0; //8
        public String invoice = ""; //9
        public String trackingNum = ""; //10
        public String readyDate = ""; //11
        public String eta = ""; //12
        public Date etaT = null;
        public String country = ""; //1
        public String shipMode = ""; //2
        public String purchasingDoc = ""; //3

        ShipUnit(Row r) {
            remain = asInt(r, 8);
            if (remain == 0) {
                remain = asInt(r, 6);
                log("[i] ship qty missing: row="+r.getRowNum());
            }
            id = asString(r, 5);
            invoice = asString(r, 9);
            trackingNum = asString(r, 10);
            readyDate = asString(r, 11);
            eta = asString(r, 12);
            etaT = asDate(r, 12);
            country = asString(r, 1);
            shipMode = asString(r, 2);
            purchasingDoc = asString(r, 3);
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append("id=").append(id).append('\n');
            sb.append("remain=").append(remain).append('\n');
            sb.append("invoice=").append(invoice).append('\n');
            sb.append("trackingNum=").append(trackingNum).append('\n');
            sb.append("readyDate=").append(readyDate).append('\n');
            sb.append("eta=").append(eta).append('\n');
            sb.append("country=").append(country).append('\n');
            sb.append("shipMode=").append(shipMode).append('\n');
            sb.append("purchasingDoc=").append(purchasingDoc).append('\n');
            return sb.toString();
        }

        public String shortForm() {
            return new StringBuilder()
                .append(eta).append('|').append(remain)
                .toString();
        }

        ShipUnit(ShipUnit o, int v) {
            remain = v;

            id = o.id;
            invoice = o.invoice;
            trackingNum = o.trackingNum;
            readyDate = o.readyDate;
            eta = o.eta;
            etaT = o.etaT;
            country = o.country;
            shipMode = o.shipMode;
            purchasingDoc = o.purchasingDoc;
        }

        public String[] flatForm() {
            return new String[]{
                ""+remain,
                invoice,
                trackingNum,
                readyDate,
                eta,
                shipMode,
                purchasingDoc
            };
        }

        ShipUnit(int v) {
            invoice = "no goods";
        }
    }

    public static String asString(Row r, int idx) {
        if (idx >= r.getCellCount()) {
            return "";
        }
        Cell c = r.getCell(idx);
        if (c == null)
            return "";
        if (c.getType() == CellType.STRING)
            return c.asString();
        String v = c.getRawValue();
        return v == null ? "" : v;
    }

    public static int asInt(Row r, int idx) {
        String v = asString(r, idx);
        if (v == "")
            return 0;
        return Integer.parseInt(v);
    }

    public static Date asDate(Row r, int idx) {
        String v = asString(r, idx);
        if ("instock".equals(v))
            return null;
        Date d;
        if (v == "" || null == (d = toDate(v)))
            return null;
        return d;
    }

    public static Date toDate(String v) {
        String t = v.trim();
        if ( ! t.matches("^\\d{2}/\\d{2}/\\d{4}$")) {
            lof("[w] dd/MM/yyyy format not matched: " + v);
            return null;
        }
        Date out = null;
        try {
            out = dateFmt.parse(t);
        } catch (Exception e) {
            lof("[e] invalid date: " + v, e);
        }
        return out;
    }

    public static void log(String v, Exception... es) {
        if (!verbose)
            return;
        lof(v, es);
    }

    public static void lof(String v, Exception... es) {
        System.out.println("__" + v);
        if (es != null && es.length > 0)
            es[0].printStackTrace();
    }

    public static void printRow(Row r) {
        int len = r.getCellCount();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++)
            sb.append(',').append(asString(r, i));
        lof("[d] row: " + sb.toString());
    }
}
