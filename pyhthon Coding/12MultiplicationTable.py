def multiplication_table():
    try:
        num = int(input("Enter number: "))   #inputs
        end = int(input("Enter range (end): "))
        if end <= 0:
            print("Range must be positive.")
            return
        print(f"\nMultiplication Table of {num}")
        for i in range(1, end + 1):
            print(f"{num} x {i} = {num * i}")    #multiplication
    except ValueError:
        print("Please enter valid integers.")

def full_table():
    print("\nFull Multiplication Table 1-10 \n")
    print("    ", end="")
    for i in range(1, 11):
        print(f"{i:4}", end="")   #headers
    print()
    print("-" * 44)
    for i in range(1, 11):      #rows
        print(f"{i:2} |", end="")
        for j in range(1, 11):
            print(f"{i*j:4}", end="")
        print()

if __name__=='__main__':
    multiplication_table()
    