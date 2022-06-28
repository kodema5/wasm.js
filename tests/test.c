#include "../include/js_math.h"

int sum (int *arr, int n)
{
    int s = 0;
    for (int i = 0; i<n; i++) {
        s = s + arr[i];
    }
    return s;
}

double sin2 ( double a ) {
    return sin(a) * 2.0;
}

double degToRad(double d) {
    return d * ( PI / 180.0);
}

extern double ext_add2(double);

double add4(double a) {
    return ext_add2(a) * 2.0;
}