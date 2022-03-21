using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExtensionDemo.Models
{
    public class StringHelper
    {
        public static string ChangeFirstLetterCase(string inputString)
        {
            if (inputString.Length > 0)
            {
                char[] charArray = inputString.ToCharArray();
                charArray[0] = char.IsUpper(charArray[0]) ? char.ToLower(charArray[0]) : char.ToUpper(charArray[0]);
                return new string(charArray);
            }
            return inputString;
        }
    }
}