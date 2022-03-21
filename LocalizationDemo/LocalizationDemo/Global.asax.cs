using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using LocalizationDemo.Models;

namespace LocalizationDemo
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            HttpContext context = HttpContext.Current;
            RouteData rData = context.Request.RequestContext.RouteData;
            var defaultLanguage = "en";
            var languageSession = "en";//to apply global language

            //check if queryString or routeData exists
            string queryLang = rData.Values["lang"].ToString();
            if (string.IsNullOrEmpty(queryLang))
            {
                //check if session exists & set "en" if does not exist queryString
                if (context != null && context.Session != null)
                    languageSession = context.Session["lang"] != null ? context.Session["lang"].ToString() : defaultLanguage;
            }
            else
            {
                //get list supported languages
                List<String> ls_lang = LanguageModel.getListCulture();

                //check when passing param "lang"
                languageSession = ls_lang.Contains(queryLang) ? queryLang : defaultLanguage;
            }

            //set session["lang"]
            context.Session["lang"] = languageSession;

            //set global language
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(languageSession);
            Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(languageSession);
        }
    }
}
