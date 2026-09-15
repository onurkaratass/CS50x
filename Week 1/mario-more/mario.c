#include <cs50.h>
#include <stdio.h>

int main(void)
{

    int height;
    do
    {
        height = get_int("Height: ");
    }
    while (height < 1 || height > 8);


    for (int i = 0; i < height; i++)
    {

        for (int spaces = 0; spaces < height - 1 - i; spaces++)
        {
            printf(" ");
        }


        for (int hashes = 0; hashes < i + 1; hashes++)
        {
            printf("#");
        }


        printf("  ");


        for (int hashes = 0; hashes < i + 1; hashes++)
        {
            printf("#");
        }


        printf("\n");
    }
}
