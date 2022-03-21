using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace LocalizationDemo.Controllers
{
    public class MultilanguagesController : Controller
    {
        // GET: Multilanguage
        public ActionResult Index()
        {
            //ViewBag.Language = Session["lang"];
            return View();
        }

        public ActionResult ChangeCulture(string lang)
        {
            //check if session null to set default lang is "en"
            if (Session["lang"] == null) Session["lang"] = "en";

            //save to session
            Session["lang"] = lang;

            return RedirectToAction("Index");
        }
    }
}