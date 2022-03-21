using ExtensionDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ExtensionMethods;

namespace ExtensionDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

            ViewBag.listeven = numbers.getEvenList();

            ViewBag.listodd = numbers.getOddList();

            string str = "blahblah balhb al";
            ViewBag.resultText = str.FirstCharToUpper();
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}