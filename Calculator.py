class Calculator:                               #  a class named Calculator
    def __init__(self,a,b):                     # Constructor method
        self.a=a
        self.b=b
    
    def add(self):                                # Method to perform addition
        return self.a+self.b
    
    def sub(self):                                  # Method to perform substraction
        return self.a- self.b
    
    def mul(self):                                   # Method to perform multiplication
        return self.a*self.b
    
    def div(self):                                  # Method to perform division
        try:
          res= self.a/self.b
          return res
        except ZeroDivisionError:
            return "Invalid second Value.."
    
    def mod(self):                                    # Method to perform modulus
        return self.a%self.b
    
    def exp(self):                                       # Method to perform exponential
        return self.a**self.b
    
if __name__=='__main__':
    try:
        a=int(input("enter the first value:"))
        s=input('enter the symbol(+,-,*,/,%,^):')
        b=int(input("enter the second value:"))
        obj=Calculator(a,b)
        if s == '+':
            print(f"{a}+{b}={obj.add()}")
        elif s == '-':
            print(f"{a}-{b}={obj.sub()}")
        elif s == '*':
            print(f"{a}*{b}={obj.mul()}")
        elif s == '/':
            print(f"{a}/{b}={obj.div()}")
        elif s == '%':
            print(f"{a}%{b}={obj.mod()}")
        elif s == '^':
            print(f"{a}^{b}={obj.exp()}")
        else:
            print('ener the correct symbol..')
    except ValueError:
        print('enter the correct number...')
    
    
        