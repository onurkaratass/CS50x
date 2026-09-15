from cs50 import get_string

text = get_string("Text: ")

letters = 0
words = 1
sentences = 0

for char in text:
    if char.isalpha():
        letters += 1
    elif char == " ":
        words += 1
    elif char in [".", "!", "?"]:
        sentences += 1

L = (letters / words) * 100
S = (sentences / words) * 100

index = round(0.0588 * L - 0.296 * S - 15.8)

if index < 1:
    print("Before Grade 1")
elif index >= 16:
    print("Grade 16+")
else:
    print(f"Grade {index}")
