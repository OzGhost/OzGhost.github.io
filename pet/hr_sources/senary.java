
public class senary {
    
    private static int[] pbase = new int[]{
        0,1,2,3,4,5,
        10,11,12,13,14,15,
        20,21,22,23,24,25,
        30,31,32,33,34,35,
        40,41,42,43,44,45,
        50
    };

    private static int[] singleMulti (int i, int j, int o, int l) {
        int[] rs = new int[l];
        int stock = 0;
        int prefix = 1;
        int pointer = 0;
        while (pointer < o) {
            rs[pointer] = 0;
            pointer++;
        }
        while (i > 0) {
            int m = pbase[i%10 * j + stock];
            rs[pointer] = m%10;
            stock = m/10;
            prefix *= 10;
            i /= 10;
            pointer++;
        }
        rs[pointer] = stock > 0 ? stock : 0;
        pointer++;
        while (pointer < l) {
            rs[pointer] = 0;
            pointer++;
        }
        return rs;
    }

    private static int multiMulti (int i, int j) {

        int rs = 0;
        int ilen = String.valueOf(i).length();
        int jlen = String.valueOf(j).length();
        int len = ilen + jlen;

        int[][] buff = new int[jlen][len];
        int prefix = 1;
        int pointer = 0;
        int stock = 0;

        while (j > 0) {
            buff[pointer] = singleMulti(i, j%10, pointer, len);
            j /= 10;
            pointer++;
        }

        for (int k = 0; k < len; k++) {
            int m = 0;
            for (int n = 0; n < jlen; n++) {
                m += buff[n][k];
            }
            m = pbase[m + stock];
            rs = prefix * (m%10) + rs;
            stock = m/10;
            prefix *= 10;
        }
        
        if (stock > 0) {
            rs = prefix * stock + rs;
        }
        return rs;
    }

    private static void printArr (int[] ar) {
        for (int i = 0; i < ar.length; i++) {
            System.out.print("[" + ar[i] + "]");
        }
        System.out.println();
    }

    private static int score(int i) {
        int rs = 0;
        while (i > 0) {
            if ((i%10) == 0) {
                rs++;
            }
            i /= 10;
        }
        return rs;
    }

    private static int answer = 0;
    private static int N = 0;

    private static void roomCostSum(
            int i,
            int j,
            int[][] matrix,
            int lastCost
    ) {
        if (i == N || j == N) {
            int s = score(multiMulti(lastCost, matrix[i][j]));
            answer = (s > answer) ? s : answer;
            return;
        }
        int current = multiMulti(lastCost, matrix[i][j]);
        if (i < N) {
            roomCostSum(i+1, j, matrix, current);
        }
        if (j < N) {
            roomCostSum(i, j+1, matrix, current);
        }
    }

    public static void main (String[] args) {
        answer = 0;
        N = 2;
        
        int[][] mt = new int[3][3];
        mt[0] = new int[]{3,2,3};
        mt[1] = new int[]{2,3,2};
        mt[2] = new int[]{3,2,3};

        roomCostSum(0, 0, mt, 1);

        System.out.println(answer);
    }
}
