package org.qpro;

import java.io.*;
import java.util.Scanner;

public class YourAnswer {

    private static byte ENDLINE = (byte)'\n';

    public void answerTo(InputStream input, OutputStream output) throws Exception {
        OutputStream os = new BufferedOutputStream(output);
        Scanner sc = new Scanner(input);
        int n = sc.nextInt();
        int fsize = sc.nextInt();
        int[] m = new int[10];
        int x;
        sc.nextLine();
        x = sc.nextInt();
        PrimeQueue q = new PrimeQueue(x);
        m[x]++;
        int i = 1;
        for (; i < fsize; i++) {
            sc.nextLine();
            x = sc.nextInt();
            q.offer(x);
            m[x]++;
        }
        int middle = fsize / 2 + 1;
        int t = 0;
        int j;
        for (j = 0; j < 10; j++) {
            t += m[j];
            if (t >= middle) {
                os.write((byte)(j + '0'));
                os.write(ENDLINE);
                break;
            }
        }
        for (; i < n; i++) {
            sc.nextLine();
            x = sc.nextInt();
            m[q.poll()]--;
            q.offer(x);
            m[x]++;
            t = 0;
            for (j = 0; j < 10; j++) {
                t += m[j];
                if (t >= middle) {
                    os.write((byte)(j + '0'));
                    os.write(ENDLINE);
                    break;
                }
            }
        }
        os.flush();
    }

    private static class PrimeQueue {
        private PrimeNode head;
        private PrimeNode tail;
        
        public PrimeQueue(int val) {
            head = new PrimeNode();
            head.val = val;
            tail = head;
        }

        public void offer(int val) {
            tail.next = new PrimeNode();
            tail = tail.next;
            tail.val = val;
        }

        public int poll() {
            int val = head.val;
            head = head.next;
            return val;
        }
    }

    private static class PrimeNode {
        private int val;
        private PrimeNode next;
    }
}

