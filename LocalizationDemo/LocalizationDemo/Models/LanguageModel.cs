using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace LocalizationDemo.Models
{
    public class LanguageModel
    {
        static string fileName = "LanguageData.xml";
        static string path = Path.Combine(HttpContext.Current.Server.MapPath("~/Models"), fileName);

        public static IEnumerable<Language> getListLang()
        {
            List<Language> ls_lang = new List<Language>();

            XElement element = XElement.Load(path);
            foreach(var e in element.Elements())
            {
                ls_lang.Add(new Language { langName = e.Element("langName").Value, langCulture = e.Element("langCulture").Value });
            }
            return ls_lang;
        }

        public static List<string> getListCulture()
        {
            XElement element = XElement.Load(path);
            List<string> ls_culture = new List<string>();
            foreach (var e in element.Elements())
            {
                ls_culture.Add(e.Element("langCulture").Value);
            }
            return ls_culture;
        }
    }
}