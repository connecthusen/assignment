from datetime import datetime
from datetime import date

# store today's date and current time
today=date.today()
now=datetime.now()

class Person:
    def __init__(self,day,month,year):
        self.d=day
        self.m=month
        self.y=year

    def AgeInYears(self):                                       #Calculate exact age in year
        if today.month==self.m:
            if today.day>=self.d:
                return today.year-self.y
            else:
                return today.year-self.y-1 
        elif today.month>self.m:
            return today.year-self.y
        else:
            return today.year-self.y-1
    
    def AgeInMonths(self):                                   #Calculate exact age in months
        if today.day>self.d:
            return (self.AgeInYears()*12) +( (today.month-self.m)%12)
        else:
            return ((self.AgeInYears()*12) )+ ((today.month-self.m)-1)
        
    def AgeInDays(self):                                    #alculate exact age In days
            y = self.AgeInYears()
            total= y * 365
            for year in range(self.y, self.y + y):
                if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
                    if not (year == self.y and (self.m > 2)):
                        total += 1
            if today.year % 400==0 or (today.year % 4==0 and today.year % 100 !=0):
                month_days=[31,29,31,30,31,30,31,31,30,31,30,31]
            else:
                month_days=[31,28,31,30,31,30,31,31,30,31,30,31]

            if today.month >= self.m:
                for i in range(self.m, today.month):
                    total += month_days[i-1]
            else:
                for i in range(self.m, 13):
                    total += month_days[i-1]
                
                for i in range(1, today.month):
                    total += month_days[i-1]

            day_diff = today.day - self.d
            if day_diff < 0:
                if today.month > 1:
                    total-= month_days[today.month - 2]
                    day_diff += month_days[today.month - 2]

            total += day_diff
            return total

           
    def AgeInHours(self):                                #Calculate exact age in hours
        return ( self.AgeInDays()*24) + (now.hour)
    
    def AgeInMinutes(self):                               #Calculate exact age in minutes
        return (self.AgeInHours()*60) + (now.minute)
    
    def Untill100(self):                                  #Calculate exact years to untill 100 age
        return (100-self.AgeInYears())


if __name__=='__main__':
    try:
        day,month,year=map(int,input("enter the Birth Day, month,year(with space):").split()) #take inputs
        if 0<day<=31 and 0<month<=12:                                      #validate date and month
            person=Person(day,month,year)                                   # define objecct
            print(f"Current Age:{person.AgeInYears()}")
            print(f"Age In Months:{person.AgeInMonths()}")
            print(f"Age In Days:{person.AgeInDays()}")
            print(f"Age In Hours:{person.AgeInHours()}")
            print(f"Age In minutes:{person.AgeInMinutes()}")
            print(f'Years until age 100:{person.Untill100()}')
        else:
            print("enter the correct day and month:")
    except ValueError:
        print("enter the correct day,month,year:")