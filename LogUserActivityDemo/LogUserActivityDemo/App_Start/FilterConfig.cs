using System.Web;
using System.Web.Mvc;
using LogUserActivityDemo.CustomAttributes;

namespace LogUserActivityDemo
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new LogSessionActivityAttribute());
        }
    }
}
