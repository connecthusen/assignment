def manipulation(s):                                                    # Function to perform multiple string operations
    print(f"original :{s}")                                              # Print the original sentence
    print(f"Total Characteres(with space) :{len(s)}")                     # Count total characters including spaces
    print(f"Total Characters(withoout space):{len(s.replace(' ',''))}")    #  Count total characters excluding spaces
    print(f"Total words:{len(s.split(' '))}")                              # Count total words
    print(f"Uppercase:{s.upper()}")                                         # Convert sentence to uppercase
    print(f"Lowercase:{s.lower()}")                                         # Convert sentence to lowercase
    print(f"Title :{s.title()}")                                            # Convert sentence to Title Case
    print(f"First Word:{s.split()[0]}")                                     # Display first word of the sentence
    print(f"Last Word:{s.split()[-1]}")                                      # Display last word of the sentence
    print(f"reversed:{s[::-1]}")                                             # Reverse the entire sentence

if __name__=='__main__':
    sentence=input('enter the sentence:')                                   # Take sentence input from user
    if sentence=="":                                                        # Check if input is empty
        print('enter the at least one word..')
    else:
        manipulation(sentence)                                              # Call the manipulation function