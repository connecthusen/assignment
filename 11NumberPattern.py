# Pattern 1:
# 1
# 1 2
# 1 2 3
def pattern1(h):              
    for i in range(1, h + 1):
        for j in range(1, i + 1):
            print(j, end=" ")
        print()

# Pattern 2:
# 1
# 2 2
# 3 3 3
def pattern2(h):
    for i in range(1, h + 1):
        for j in range(i):
            print(i, end=" ")
        print()

# Pattern 3:
# 5 4 3 2 1
# 4 3 2 1
def pattern3(h):
    for i in range(h, 0, -1):
        for j in range(i, 0, -1):
            print(j, end=" ")
        print()

# Pattern 4:
#     1
#    121
#   12321
def pattern4(h):
    for i in range(1, h + 1):
        for space in range(h - i):
            print(" ", end="")
        for num in range(1, i + 1):
            print(num, end="")
        for num in range(i - 1, 0, -1):
            print(num, end="")
        print()


if __name__=='__main__':
    while True:
        print("\n Choose Pattern (1-4)")
        print("1 - Pattern1")
        print("2 - Pattern2")
        print("3 - Pattern3")
        print("4 - Pattern4")
        print("5 - Exit")
        choice = int(input("Enter pattern number: "))
        if choice==5:
            exit()
        h = int(input("Enter height: "))#height
        if choice == 1:
            pattern1(h)
        elif choice == 2:
            pattern2(h)
        elif choice == 3:
            pattern3(h)
        elif choice == 4:
            pattern4(h)
        else:
            print("Invalid choice!")
