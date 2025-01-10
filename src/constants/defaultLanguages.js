export const defaultLanguages = (id) => {
  switch (id) {
    case "c":
      return `#include <stdio.h>

            int main()
            {
                printf("Hello World");
            
                return 0;
            }`;
    case "cpp":
      return `#include <iostream>
            int main()
            {
                std::cout<<"Hello World";
                return 0;
            }`;
    case "csharp":
      return `using System;
            class HelloWorld {
              static void Main() {
                Console.WriteLine("Hello World");
              }
            }`;
    case "go":
      return `package main
            import "fmt"
            
            func main() {
                fmt.Println("Hello World")
            }`;
    case "java":
      return `public class Main
            {
                public static void main(String[] args) {
                    System.out.println("Hello World");
                }
            }
            `;
    case "javascript":
      return `console.log('Hello World');`;
    case "kotlin":
      return `fun main() {
                println("Hello World")
            }`;
    case "python":
      return `print ('Hello World')`;
    case "php":
      return `echo "Hello World";`;
    default:
      return `will add default code for this language later | try other language to get default code to get started`;
  }
};
