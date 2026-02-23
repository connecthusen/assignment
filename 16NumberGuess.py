import random

def game():
    best_score = 0  #  track minimum attempts
    while True:
        number = random.randint(1, 100)
        attempts_left = 7
        attempts_used = 0
        print("\n I have selected a number between 1 and 100.")
        print("You have 7 attempts to guess it.")
        while attempts_left > 0:
            try:
                guess = int(input("\nEnter your guess: "))
            except ValueError:
                print("Please enter a valid number.")
                continue
            attempts_used += 1
            attempts_left -= 1
            if guess == number:
                print(f"Congratulations! You guessed correct Number with {attempts_used} attempts.")
                if best_score==0 or attempts_used < best_score:   # Update best score
                    best_score = attempts_used
                    print(" New Score!")
                break
            elif guess > number:
                print("Too high!")
            else:
                print("Too low!")

            if abs(guess - number) <= 5:
                print("Very close...")
            print(f"Attempts remaining: {attempts_left}")
        else:
            print(f"\n Game Over! The correct number was {number}.")

        if best_score is not None:                  # Show best score
            print(f"Best Score is: {best_score} attempts")

        play=int(input("\nDo you want to play again?\n Enter 1 to continue..or Other numbers to exit: "))
        if play!=1:
            print("Thank you")
            exit()


if __name__ == "__main__":
    game()