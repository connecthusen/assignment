def fun(n):
    numbers=[]
    for i in range(n):
        num=int(input(f"Enter the Number{i+1}:"))  #take the numbers as input and append in list
        numbers.append(num)
    print(f"Sum of Numbers:{sum(numbers)}")         #sum
    print(f"Average of Numbers:{sum(numbers)/n}")   #Average
    print(f"Max Number is:{max(numbers)}")          #max 
    print(f"Min Number is:{min(numbers)}")          #min

if __name__=='__main__':
    n=int(input("How many Numbers do you want to enter?: "))
    fun(n)






