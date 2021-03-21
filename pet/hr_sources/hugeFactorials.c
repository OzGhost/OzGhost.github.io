#include <stdio.h>
#include <stdlib.h>

static int factorials[] = {
    0, 1, 2, 6, 24, 120, 720, 5040,
    40320, 362880, 3628800, 39916800, 479001600
};

static inline short * hugeMultiple(short n, short *a, short m, short *b, short *rlen) {
    short len, remain, indicator;
    len = n + m + 1;
    *rlen = len;
    short *rs = (short*) malloc(len * sizeof(short));
    remain = 0;
    for (int i = 0; i < n; i++) {
        indicator = i;
        for (int j = 0; j < m; j++) {
            int tmp = a[i] * b[j];
            tmp += remain;
            rs[indicator] += tmp % 10;
            remain = tmp / 10;
            if (rs[indicator] > 9) {
                rs[indicator] -= 10;
                remain++;
            }
            indicator++;
        }
        if (remain > 0) {
            rs[indicator] += remain;
            remain = 0;
        }
    }
    return rs;
}

static inline void hugePrint(short len, short *huge) {
    short i = len;
    while (i > 0 && !huge[--i])
        ;
    while (i >= 0) {
        printf("%d", huge[i--]);
    }
    printf("\n");
}

static inline short * hugeFactorial (int n, short *len) {
    short fragment[] = {n%10, n/10};
    if (n == 13) {
        short tweltFrag[] = {0,0,6,1,0,0,9,7,4};
        return hugeMultiple(2, fragment, 9, tweltFrag, len);
    } else if (n > 13) {
        short rsLen = 0;
        short * rs = hugeFactorial(n - 1, &rsLen);
        return hugeMultiple(2, fragment, rsLen, rs, len);
    }
    return (short *)malloc(0);
}

int main() {
    int n;
    scanf("%d", &n);
    if (n < 13) {
        printf("%d\n", factorials[n]);
    } else {
        short len;
        short * rs = hugeFactorial(n, &len);
        hugePrint(len, rs);
    }
    return 0;
}
