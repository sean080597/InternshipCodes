using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LogUserActivityDemo.CustomAttributes
{
    public class LogSessionActivityAttribute : ActionFilterAttribute
    {
        //file path to save log file
        string filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/LogFiles"), Constants.LogFileName);

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if(filterContext.HttpContext.Session[Constants.SESSION_ACTIVITY_LOG_ID] != null)
            {
                try
                {
                    WriteLogFile(
                        filePath,
                        filterContext.Controller.ToString(),
                        filterContext.ActionDescriptor.ActionName
                    );
                }
                catch
                {

                }
            }
            base.OnActionExecuting(filterContext);
        }

        static async void WriteLogFile(string filePath, string controllerName, string actionName)
        {
            try
            {
                using (StreamWriter outputFile = new StreamWriter(filePath, true))
                {
                    string str = controllerName + " \t| " + actionName + " \t| " + DateTime.Now;
                    await outputFile.WriteLineAsync(str);
                }
            }
            catch
            {

            }
        }
    }
}