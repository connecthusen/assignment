def prime(num):
    if num<2:
        return False
    else:
        for i in range (2,(num//2)+1):
            if num % i == 0:
                return False
        else:
            return True
    
def RangeOfPrime(start,end):
    if start<2 and end<2:
        print("there is No Prime numbers..")
    else:
        print("Prime Numbers:",end="")
        for i in range (start,end+1):
            if prime(i):
                print(f"{i}",end=",")

if __name__=='__main__':
    print("***Prime Numbers***")
    print("1.SingleNUmber")
    print("2.Range")
    Choice=int(input("Enter your Choice:"))
    if Choice==1:
        num=int(input("Enter the Number:"))
        if prime(num):
            print(f"{num} is A Prime Number")
        else:
            print(f"{num} is Not a Prime Number..")
    elif Choice==2:
        start=int(input("Enter the Start Number:"))
        end=int(input("Enter the end Number:"))
        RangeOfPrime(start,end)
    else:
        print("enter the correct Choice")