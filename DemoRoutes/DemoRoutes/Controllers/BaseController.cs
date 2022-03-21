using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoRoutes.Controllers
{
    public class BaseController : Controller
    {
        protected string _currentLanguage = "";
        //protected string _defaultLanguage = "en";
        protected string _defaultLanguage = System.Configuration.ConfigurationManager.AppSettings["mainLanguage"];
        protected string[] _languages = { "en", "ja"};

        public BaseController()
        {
            //get current request
            var req = System.Web.HttpContext.Current.Request;

            //check if cookie "lang" is set
            if(req.Cookies["lang"] != null)
            {
                _currentLanguage = req.Cookies["lang"].Value;
            }

            //detect change language from queryString
            if(req.QueryString["lang"] != null && _languages.Contains(req.QueryString["lang"]))
            {
                _setLanguage(req.QueryString["lang"]);
            }
            //check if null
            else if (_currentLanguage == "")
            {
                _setLanguage(_defaultLanguage);
            }

            //put current lang to ViewBag & can access from views, layouts.
            ViewBag.Currentlanguage = _currentLanguage;
            ViewBag.Languages = _languages;
            ViewBag.DefaultLanguage = _defaultLanguage;
        }

        protected void _setLanguage(string lang)
        {
            _currentLanguage = lang;

            //save to cookie by using response
            System.Web.HttpContext.Current.Response.Cookies.Add(new HttpCookie("lang", lang));
        }
    }
}