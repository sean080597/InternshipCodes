using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemoRoutes.Models
{
    public class ListUsers
    {
        public static List<User> LoadSampleData()
        {
            List<User> output = new List<User>();
            output.Add(new User { FirstName = "Tim", LastName = "Corey", Birthday = Convert.ToDateTime("2/25/1970") });
            output.Add(new User { FirstName = "Joe", LastName = "Smith", Birthday = Convert.ToDateTime("3/31/1970") });
            output.Add(new User { FirstName = "Sue", LastName = "Storm", Birthday = Convert.ToDateTime("1/3/1970") });
            output.Add(new User { FirstName = "Sara", LastName = "Jones", Birthday = Convert.ToDateTime("3/6/1970") });
            output.Add(new User { FirstName = "Jamie", LastName = "Doe", Birthday = Convert.ToDateTime("2/18/1970") });
            output.Add(new User { FirstName = "Mary", LastName = "Smith", Birthday = Convert.ToDateTime("1/23/1970") });
            return output;
        }
    }
}