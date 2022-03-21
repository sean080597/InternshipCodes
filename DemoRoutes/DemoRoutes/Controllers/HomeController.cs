using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DemoRoutes.Models;

namespace DemoRoutes.Controllers
{
    public class HomeController : BaseController
    {
        //load list of users from Model ListUsers
        List<User> ls_users = ListUsers.LoadSampleData();

        public ActionResult Index()
        {
            Product pro = new Product();
            if(_currentLanguage == "en")
            {
                pro.Name = "Product: Milk";
                pro.Price = 2;
                pro.Currency = "USD";
                pro.Desc = StringHelper.TrimLength("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
            }

            if (_currentLanguage == "ja")
            {
                pro.Name = "プロダクト: ミルク";
                pro.Price = 2;
                pro.Currency = "Yen";
                pro.Desc = StringHelper.TrimLength("利用可能なLorem Ipsumのパッセージの多くのバリエーションがありますが、大多数は注入されたユーモア、または少し信じられないようにも見えないランダム化された単語によって、何らかの形で変更を受けました。 もしあなたがLorem Ipsumの一節を使うつもりなら、恥ずかしいことがテキストの真ん中に隠されていないことを確かめる必要があります。");
            }
            return View(pro);
        }

        public ActionResult ListUsersPage()
        {
            return View(ls_users);
        }

        public ActionResult OrderByFirstName()
        {
            ls_users = ls_users.OrderBy(x => x.FirstName).ToList();
            return View(ls_users);
        }

        public ActionResult OrderByLastName()
        {
            ls_users = ls_users.OrderBy(x => x.LastName).ToList();
            return View(ls_users);
        }

        public ActionResult OrderByBirthday()
        {
            ls_users = ls_users.OrderBy(x => x.Birthday).ToList();
            return View(ls_users);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        //partial view
        public ActionResult SortListUsers()
        {
            return SortListUsers();
        }
    }
}