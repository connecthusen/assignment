def calculator(a,b):
    print("Results:")
    print(f"{a}+{b}={a+b}")
    print(f"{a}-{b}={a-b}")
    print(f"{a}*{b}={a*b}")
    print(f"{a}/{b}={a/b}")
    print(f"{a}%{b}={a%b}")
    print(f"{a}^{b}={a**b}")

if __name__=='__main__':
    a=int(input("Enter the a:"))
    b=int(input("Enter the b:"))
    calculator(a,b)