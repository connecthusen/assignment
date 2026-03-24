def price(n,day):
    discount_day=['fri','sat','sun']                     #disount days
    total=0
    child,adult,senior=0,0,0
    for i in range (n):                                   #take age  for tickets
        age=int(input(f"enter the age of ticket {i+1}:"))
        if age<=0:
            print("Invalid age")
            continue
        elif age<3:
            amount=0
        elif 3<=age<=12:
            amount=150
            child+=1
        elif 13<=age<=59:
            amount=300
            adult+=1
        else:
            amount=200
            senior+=1
        total+=amount
        

    if day in discount_day:                    #calcualte discount
        percentage=20
        discount=(total/100)*20
    else:
        percentage=0
        discount=0
    print("*"*10 + "Movie Tickets"+ "*"*10)                # print ticket details     
    print("Child:₹150 Adult:₹300 Senior:₹200")
    print(f"Child:{child} Adult:{adult} Senior:{senior}")
    print(f"Base Price: ₹{total}")
    print(f"discount({percentage}%): ₹{discount}")
    print('_'*30)
    print(f"TOTAL: ₹{total-discount}")

if __name__=='__main__':
    n=int(input("enter the No of tickets:"))
    day=input("ente the day(sun,mon,tue,wed,thur,fri,sat):").lower()
    price(n,day)


