class Subjects:
    def __init__(self,sub1,sub2,sub3,sub4,sub5):
        self.sub1=sub1                                  #suject wise marks
        self.sub2=sub2
        self.sub3=sub3
        self.sub4=sub4
        self.sub5=sub5
        self.total=sub1+sub2+sub3+sub4+sub5            #calcualte the total
        self.percent=(self.total/500)*100               #calculate teh percentage
    
    def marks(self):                                    #display the totalmarks,percentage,sublecct wise marks
        print(f"MARKS => sub1:{self.sub1} sub2:{self.sub2} sub3:{self.sub3} sub4:{self.sub4} sub5:{self.sub5}")
        print(f"Total(out of 500):{self.total}")
        print(f"Percentage:{self.percent}")
        return

    def Grade(self):                    #grade calculation
        if self.percent<50:
            return " F (Fail)"
        elif (50<=self.percent<=59):
            return "D (Pass)"
        elif (60<=self.percent<=69):
            return "C (Average)"
        elif (70<=self.percent<=79):
            return " B (Good)"
        elif (80<=self.percent<=89):
            return "A (Excellent)"
        else :
            return "A+ (Outstanding)"
     
    def result(self):                      #result calcualtion
        if self.sub1 >= 40 and self.sub2 >= 40 and self.sub3 >= 40 and self.sub4 >= 40 and self.sub5 >= 40:
            return "PASS"
        else:
            return ("FAIL")
        
if __name__=='__main__':
    try:                                      #take inputs amrks
        sub1,sub2,sub3,sub4,sub5=map(int,input("enter the sub1,sub2,sub3,sub4.sub5 out of 100 marks(with spcae):").split())
        student=Subjects(sub1,sub2,sub3,sub4,sub5)
        student.marks()
        print(f"Grade:{student.Grade()}")
        print(f"Result:{student.result()}")
    except ValueError:
        print("enter the correct sub marks out of 100:")


        
       

        