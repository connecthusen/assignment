def factorail(num):
    if num<0:    #neagtive number handling
        print("Factorail is not defined for negatives..")
    elif num==0 or num==1:   #1 and 0 number handling
        print(f"{num}!=1")
    else:                     #grater than 1 numbers
        result=1
        print(f'{num}!=',end="")
        for i in range (num,0,-1):
            if i==1:
                print(f" {i} ",end="")
            else:
                print(f" {i} ×",end="")
                result*=i
        else:
            print(f"= {result}",end='\n')
    return

if __name__=='__main__':
    num=int(input("Enter a number:"))
    factorail(num)


