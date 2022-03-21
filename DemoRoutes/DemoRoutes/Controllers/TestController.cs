using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoRoutes.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Action1(int id)
        {
            return View();
        }

        public ActionResult Action2(int id, string role)
        {
            return View();
        }

        public ActionResult Action3(int index)
        {
            return View();
        }

        public ActionResult Action4(int page, string role)
        {
            return View();
        }
    }
}