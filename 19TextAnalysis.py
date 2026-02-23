def words(text):   #counts the words
    words = text.split()
    return len(words)


def vowels(text):   #counts the vowels
    vowels = "aeiouAEIOU"
    count = 0
    for ch in text:
        if ch in vowels:
            count += 1
    return count


def consonants(text):  #counts the consonants
    vowels = "aeiouAEIOU"
    count = 0
    for ch in text:
        if ch.isalpha() and ch not in vowels:
            count += 1
    return count


def reverse(text):   #reverse the string
    reversed = ""
    for i in range(len(text)-1, -1, -1):
        reversed += text[i]
    return reversed


def is_palindrome(text):   #check the palindrome
    txt = text.replace(" ", "").lower()
    reversed = reverse(txt)
    if txt == reversed:
        return True
    else:
        return False


def remove(text):       #remove the vowels
    vowels = "aeiouAEIOU"
    result = ""
    for ch in text:
        if ch not in vowels:
            result += ch
    return result


def word_frequency(text):  #calcualte the word frequency
    words = text.lower().split()
    freq = {}

    for word in words:
        if word in freq:
            freq[word] += 1
        else:
            freq[word] = 1

    return freq


def longest(text):
    words = text.split()
    longest = ""

    for word in words:
        if len(word) > len(longest):
            longest = word

    return longest


def analyze_text(text):
    print("\n=== TEXT ANALYSIS ===")

    print("Words:", words(text))
    print("Vowels:",vowels(text))
    print("Consonants:", consonants(text))
    print("Reversed:", reverse(text))

    if is_palindrome(text):
        print("Palindrome: Yes")
    else:
        print("Palindrome: No")

    print("Without vowels:", remove(text))

    long = longest(text)
    print("Longest word:", long, f"({len(long)} letters)")

    freq = word_frequency(text)
    print("Word Frequency:")
    for key in freq:
        print(key + ":", freq[key])


if __name__ == "__main__":
    text = input("Enter text: ")
    analyze_text(text)