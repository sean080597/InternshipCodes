using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemoRoutes.Models
{
    public class Product
    {
        public string Name { get; set; }
        public long Price { get; set; }
        public string Currency { get; set; }
        public string Desc { get; set; }
    }
}