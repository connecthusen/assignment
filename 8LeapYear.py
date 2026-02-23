def leapyear(year):
    if year % 400 == 0:
        print(f"{year} is a Leap year (its divisible by 400)")
    elif year % 4 == 0 and year % 100 !=0:
        print(f"{year} is a Leap year(its not multiply of 100 and its divisible by 4)")
    else:
        print(f"{year} is NOT a leap year")


if __name__=='__main__':
    while True:
        try:
            year=int(input("enter the year(or 0 to exit):"))
            if year == 0:
                exit()
            else:
                leapyear(year)
        except ValueError:
            print("enter the correct year...")
    