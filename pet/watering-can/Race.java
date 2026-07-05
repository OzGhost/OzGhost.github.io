
public class Race {
    volatile static Object[] rack = new Object[2];

    public static void main(String[] args) throws Exception {
        Object chan = new Object();
        String out = new Race().exec(chan);
        System.out.println("__ received output: " + out);
        System.out.println("__ function returned, waiting for remaining thread(s)...");
        synchronized (chan) {
            while (rack[0] == null || rack[1] == null)
                chan.wait();
        }
        System.out.println("__ shutdown!");
    }

    String exec(Object chan) throws Exception {
        Thread t1 = new Thread(new ResultGiver(chan));
        Thread t2 = new Thread(new Timer(1000, chan));
        t1.start();
        t2.start();
        synchronized (chan) {
            while(rack[0] == null && rack[1] == null)
                chan.wait();
        }
        if (rack[0] == null)
            return "<empty>";
        return (String)rack[0];
    }

    static class ResultGiver implements Runnable {
        Object chan;

        ResultGiver(Object c) { chan = c; }

        @Override
        public void run() {
            long t = 300;
            if (System.currentTimeMillis() % 2 == 0)
                t = 1500;
            try {
                Thread.sleep(t);
            } catch (Exception e) {
                System.out.println("__ giver sleep failure!");
            }
            rack[0] = "__ calculated completed, time taken (in ms): " + t;
            if (rack[1] != null)
                System.out.println("__ late response: " + rack[0]);
            synchronized (chan) {
                chan.notifyAll();
            }
        }
    }

    static class Timer implements Runnable {
        long duration;
        Object chan;

        Timer(long d, Object c) { duration = d; chan = c; }

        @Override
        public void run() {
            try {
                Thread.sleep(duration);
            } catch(Exception e) {
                System.out.println("__ timer sleep failure!");
            }
            rack[1] = true;
            synchronized (chan) {
                chan.notifyAll();
            }
        }
    }
}
