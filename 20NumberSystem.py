def factorial(n):
    if n < 0:
        return "Not defined for negative numbers"
    fact = 1
    for i in range(1, n + 1):
        fact = fact * i
    return fact


def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True


def fibonacci(n):
    if n <= 0:
        return "Invalid input"
    elif n == 1:
        return 0
    elif n == 2:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)


def sum_of_digits(n):
    total = 0
    n = abs(n)
    while n > 0:
        digit = n % 10
        total += digit
        n = n // 10
    return total


def reverse_number(n):
    rev = 0
    negative = False
    if n < 0:
        negative = True
        n = abs(n)
    while n > 0:
        digit = n % 10
        rev = rev * 10 + digit
        n = n // 10
    if negative:
        return -rev
    return rev


def is_armstrong(n):
    temp = n
    power = len(str(n))
    total = 0
    while temp > 0:
        digit = temp % 10
        total += digit ** power
        temp = temp // 10

    if total == n:
        return True
    else:
        return False


def gcd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = temp
    return a


def lcm(a, b):
    return abs(a * b) // gcd(a, b)


def is_perfect_number(n):
    if n <= 0:
        return False

    total = 0
    for i in range(1, n):
        if n % i == 0:
            total += i

    if total == n:
        return True
    else:
        return False


def math_menu():
    while True:
        print("\n=== NUMBER SYSTEM MENU ===")
        print("1. Factorial")
        print("2. Prime Check")
        print("3. Fibonacci")
        print("4. Sum of Digits")
        print("5. Reverse Number")
        print("6. Armstrong Number")
        print("7. GCD")
        print("8. LCM")
        print("9. Perfect Number")
        print("10. Exit")

        choice = input("Enter choice: ")

        if choice == "1":
            n = int(input("Enter number: "))
            print("Factorial:", factorial(n))
        elif choice == "2":
            n = int(input("Enter number: "))
            if is_prime(n):
                print("Prime Number")
            else:
                print("Not Prime")
        elif choice == "3":
            n = int(input("Enter position: "))
            print("Fibonacci:", fibonacci(n))
        elif choice == "4":
            n = int(input("Enter number: "))
            print("Sum of digits:", sum_of_digits(n))
        elif choice == "5":
            n = int(input("Enter number: "))
            print("Reversed:", reverse_number(n))
        elif choice == "6":
            n = int(input("Enter number: "))
            if is_armstrong(n):
                print("Armstrong Number")
            else:
                print("Not Armstrong")
        elif choice == "7":
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
            print("GCD:", gcd(a, b))
        elif choice == "8":
            a = int(input("Enter first number: "))
            b = int(input("Enter second number: "))
            print("LCM:", lcm(a, b))
        elif choice == "9":
            n = int(input("Enter number: "))
            if is_perfect_number(n):
                print("Perfect Number")
            else:
                print("Not Perfect")
        elif choice == "10":
            print("Program Ended")
            break
        else:
            print("Invalid choice")


if __name__ == "__main__":
    math_menu()