#include <stdio.h>
#include <stdlib.h>

int kaprekar[21] = {1, 9, 45, 55, 99, 297, 703, 999, 2223, 2728, 4950, 5050, 7272, 7777, 9999, 17344, 22222, 77778, 82656, 95121, 99999};

inline static int binarySearch(int low, int up, int x) {
    if (up <= low)
        return up;
    int middle = (low + up) / 2;
    int val = kaprekar[middle];
    if (val == x)
        return middle;
    if (x < val)
        return binarySearch(low, middle-1, x);
    return binarySearch(middle+1, up, x);
}

int main() {
    int low, up;
    scanf("%d", &low);
    scanf("%d", &up);
    int i = binarySearch(0, 20, low);
    int counter = 0;
    if (kaprekar[i] < low)
        i++;
    while(i < 16 && kaprekar[i] < up) {
        counter++;
        printf("%d ", kaprekar[i]);
        i++;
    }
    if (counter < 1)
        printf("INVALID RANGE");
    printf("\n");
    return 0;
}

