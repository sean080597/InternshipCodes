using DemoRoutes.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoRoutes.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult DisplayXML()
        {
            List<User> data = new List<User>();
            data = ReadDataXMLFile();
            return View(data);
        }

        public List<User> ReadDataXMLFile()
        {
            string xmlData = Server.MapPath("~/XMLFiles/ListOfUsers.xml");
            DataSet ds = new DataSet();

            ds.ReadXml(xmlData);

            var ls_users = new List<User>();
            ls_users = (from rows in ds.Tables[0].AsEnumerable()
                        select new User
                        {
                            FirstName = rows[0].ToString(),
                            LastName = rows[1].ToString(),
                            Birthday = Convert.ToDateTime(rows[2]),
                        }).ToList();
            return ls_users;
        }

        public ActionResult OrderByFirstName()
        {
            var data = new List<User>();
            data = ReadDataXMLFile();
            data = data.OrderBy(x => x.FirstName).ToList();
            return View(data);
        }

        public ActionResult OrderByLastName()
        {
            var data = new List<User>();
            data = ReadDataXMLFile();
            data = data.OrderBy(x => x.LastName).ToList();
            return View(data);
        }

        public ActionResult OrderByBirthday()
        {
            var data = new List<User>();
            data = ReadDataXMLFile();
            data = data.OrderBy(x => x.Birthday).ToList();
            return View(data);
        }

        //partial view
        public ActionResult ButtonSortListUsers()
        {
            return ButtonSortListUsers();
        }
    }
}