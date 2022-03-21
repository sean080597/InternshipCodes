using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace LogUserActivityDemo
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

        void Session_Start(object sender, EventArgs e)
        {
            HttpContext.Current.Session.Add(Constants.SESSION_ACTIVITY_LOG_ID, Guid.NewGuid().ToString());

            //clear log file
            string filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/LogFiles"), Constants.LogFileName);
            FileStream fileStream = File.Open(filePath, FileMode.Open);
            fileStream.SetLength(0);
            fileStream.Close();

            using (StreamWriter writetext = new StreamWriter(filePath, false))
            {
                writetext.WriteLine("Controller \t\t\t\t\t| Action \t| Datetime");
                writetext.WriteLine("--------------------------------------------------------------------------------------");
            }
        }
    }
}
