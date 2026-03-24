

class Bio():                                                #class named Bio to store student details
    def __init__(self,name,age,course,branch,college,email): # Constructor method - runs automatically when object is created
        self.name=name
        self.age=age
        self.course=course
        self.branch=branch
        self.college=college
        self.email=email
    
    def Card(self):                                           # Method to display the student bio card
        print("╔"+"═"*40 + "╗")
        print("║"+"STUDENT BIO CARD".center(40)+"║")
        print("╠" + "═"*40 + "╣")
        print(f"║ Name    : {self.name}".ljust(40) + " ║")
        print(f"║ Age     : {self.age}".ljust(40) + " ║")
        print(f"║ Course  : {self.course}".ljust(40) + " ║")
        print(f"║ branch  : {self.branch}".ljust(40) + " ║")
        print(f"║ College : {self.college}".ljust(40) + " ║")
        print(f"║ Email   : {self.email}".ljust(40) + " ║")
        print("╚" + "═"*40 + "╝")
   


if __name__=='__main__':                                     # This block runs only when the file is executed directly
    try:
        name=input("enter the name:")                        # Taking user input for student details
        age=int(input("enter the age:"))
        course=input("enter the course:")
        branch=input("enter the branch:")
        college=input("enter the college:")
        email=input("enter the Email:")
        if '@' in email:                                          # Simple email validation
            bio=Bio(name,age,course,branch,college,email)      # Create Bio object 
            bio.Card()                                          # Call Card method to display formatted bio
        else:
            print("enter the correct email using @....")

    except ValueError:
        print('enter the correct values')


