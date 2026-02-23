
#Function to calculate and display bill breakdown.
def bill(amount,n,tax,tip):
    print("=== BILL BREAKDOWN ===")
    print(f"Subtotal :₹{amount}")
    Tax=(amount/100)*tax        #tax calculation
    Tip=(amount/100)*tip        # tip calculation
    Total=amount+Tax+Tip        #total amopunt
    print(f"Tax({tax}%):₹{Tax}")
    print(f"After Tax:₹{amount + Tax}")
    print(f"Tip({tip}):₹{Tip}")
    print(f"Total:₹{Total}")
    print(f"Per person:₹{Total/n}")

if __name__=='__main__':
    try:
        amount=float(input("enter the Total Bill:"))         #take the inputs
        n=int(input("enter the Number of People:"))
        tax=float(input("enter the Tax Percent:"))
        tip=float(input("enter the Tip Percent:"))
        bill(amount,n,tax,tip)                             #call the function
    except ValueError:
        print("enter the correct value")

