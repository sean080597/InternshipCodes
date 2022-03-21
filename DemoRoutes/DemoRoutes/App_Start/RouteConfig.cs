using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DemoRoutes
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Test/Action3", "Test/Action3/{index}", new { controller = "Test", action="Action3", index = UrlParameter.Optional});

            routes.MapRoute("Test/Action2", "Test/Action2/{role}/{id}", new { controller = "Test", action = "Action2", role = UrlParameter.Optional, id = UrlParameter.Optional });

            routes.MapRoute("Test/Action4", "Test/Action4/{role}/{page}", new { controller = "Test", action = "Action4", page = UrlParameter.Optional, role = UrlParameter.Optional });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
