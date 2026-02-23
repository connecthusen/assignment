def ispalindrome(s):
    original=s
    reverse=s[::-1]
    print(f"Original:{original}")
    print(f"reverse:{reverse}")
    for i in range(len(s)):
        print(f"{original[i]}-->{reverse[i]}")
        if original[i]==reverse[i]:
            continue
        else:
            print("Result:NOT A PALINDOME..")
            break
    else:
        print("Result:PALINDOME..")


if __name__=='__main__':
    s=input("Enter the number/Word:")
    ispalindrome(s)
