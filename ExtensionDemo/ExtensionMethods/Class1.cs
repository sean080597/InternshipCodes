using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExtensionMethods
{
    public static class Class1
    {
        public static string FirstCharToUpper(this string input)
        {
            if (String.IsNullOrEmpty(input))
            {
                throw new ArgumentException("ArgumentException");
            }
            return input.First().ToString().ToUpper() + input.Substring(1);
        }

        public static IEnumerable<int> getEvenList(this List<int> numbers)
        {
            return numbers.Where(n => n % 2 == 0);
        }

        public static IEnumerable<int> getOddList(this List<int> numbers)
        {
            return numbers.Where(n => n % 2 != 0);
        }
    }
}