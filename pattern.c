#include <stdio.h>

int main() {
    int n, c, k, space;
    char ch = 'A';

    printf("Please enter your lucky number:");
    scanf("%d", &n);

    space = n - 1;

    // Print upper triangle
    for (k = 1; k <= n; k++) {
        // Print spaces
        for (c = 1; c <= space; c++)
            printf("  ");

        // Print sequence of odd numbers
        for (c = 1; c <= 2 * k - 1; c += 2)
            printf("%d ", c);

        // Print alphabets
        for (c = 0; c < k - 1; c++)
            printf("%c ", ch++);
        
        // Reset character
        ch = 'A';

        printf("\n");
        space--;
    }

    space = 1;

    for (k = 1; k <= n - 1; k++) {
        for (c = 1; c <= space; c++)
            printf("  ");

       for (c = 1; c <= 2 * (n - k) - 1; c += 2)
            printf("%d ", c);

        for (c = 0; c < n - k - 1; c++)
            printf("%c ", ch++);
        
        ch = 'A';

        printf("\n");
        space++;
    }

    return 0;
}