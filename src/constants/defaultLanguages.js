export const defaultLanguages = (id) => {
  switch (id) {
    case 75:
      return `#include <stdio.h>

            int main()
            {
                printf("Hello World");
            
                return 0;
            }`;
    case 76:
      return `#include <iostream>
            int main()
            {
                std::cout<<"Hello World";
                return 0;
            }`;
    case 51:
      return `using System;
            class HelloWorld {
              static void Main() {
                Console.WriteLine("Hello World");
              }
            }`;
    case 60:
      return `package main
            import "fmt"
            
            func main() {
                fmt.Println("Hello World")
            }`;
    case 62:
      return `public class Main
            {
                public static void main(String[] args) {
                    System.out.println("Hello World");
                }
            }
            `;
    case 63:
      return `console.log('Hello World');`;
    case 78:
      return `fun main() {
                println("Hello World")
            }`;
    case 70:
      return `print ('Hello World')`;
    case 68:
      return `echo "Hello World";`;
    case 80:
      return `print("Hello World")`
    default:
      return ` will add default code for this language later | try other popular language to get default code to get started `;
  }
};
