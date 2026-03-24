class Account:                                                    # Account class represents a bank account
    def __init__(self):                                           #initializes account details
        self.balance=10000                              
        self.password='Husen@123'
        self.card='8722'

    def valid(self,password,card):   # Method to validate login credentials
        if password==self.password and card==self.card:
           return True
    
    def CheckBalance(self):           # Method to check current balance
        print(f"Balance:₹{self.balance}")
        

    def deposit(self,amount):         # Method to deposit money
        self.balance+=amount
        print(f"Deposit Succesfull...")
        print(f"Balance:{self.balance}")
        
    def withdraw(self,amount):        # Method to withdraw money
        if (self.balance-amount)<0:   # Check if withdrawal makes balance negative
            print(f"you have Insufficient Balanace....")
        elif (self.balance-amount)<500:     # Check if withdrawal violates minimum ₹500 rule
           print("Transaction cancelled...\nYou have to keep minimum ₹500 in account....")
        else:                              # If all conditions satisfied, deduct amount
            self.balance-=amount
            print("Withdrawl  Successfull....")
            print(f"Balance:{self.balance}")
        

if __name__=='__main__':
    account=Account()         # Create account object once
    while True:
        print("====== WELL COME TO ATM ======")
        print("Use CARDNO:8722  password:Husen@123 for reference")
        card=input("Enter the CARDNO:")
        password=input("Enter the password:")
        if account.valid(password,card):  # Validate login
            while True:                     # ATM operations menu loop
                print("*"*10 + "ATM SIMULATOR" + "*"*10) 
                print("1. Check Balance \n2. Deposit  \n3. Withdraw  \n4. Exit")
                try:
                    choice=int(input("Enter your Choice:"))
                    if choice==1:
                        account.CheckBalance()
                    elif choice==2:
                        amount=int(input("Enter the amount to Deposit:"))
                        account.deposit(amount)
                    elif choice==3:
                        amount=int(input("Enter the amount to With draw:"))
                        account.withdraw(amount)
                    elif choice==4:
                        print("Thank YOU!!1")
                        break
                    else:
                        print("Enter the correcct Choice from Menu..")
                except ValueError:
                    print("Enter the Numbers Only...")
        else:
            print("Enter the Correct Password and CardNO....")


