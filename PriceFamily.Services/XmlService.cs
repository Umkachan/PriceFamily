using Microsoft.AspNetCore.Http;
using PriceFamily.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace PriceFamily.Services
{
    public class XmlService : IXmlService
    {
        public async Task<PriceInfo> GetAllPriceInfo(IFormFile file)
        {
            var priceInfo = new PriceInfo();
            var priceCategories = new List<Category>();
            var offers = new List<Offer>();

            if (file == null)
            {
                return priceInfo;
            }
            string xml = string.Empty;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();
                xml = Encoding.UTF8.GetString(fileBytes);
            }

            await Task.Run(() =>
            {
                var xDoc = new XmlDocument();
                xDoc.LoadXml(xml);

                XmlElement xRoot = xDoc.DocumentElement;

                foreach (XmlNode xnode in xRoot)
                {
                    foreach (XmlNode item in xnode.ChildNodes)
                    {
                        if (item.Name == "categories")
                        {
                            GetCategories(item, priceCategories);
                        }

                        if (item.Name == "offers")
                        {
                            GetOffers(item, offers);
                        }
                    }
                    // получаем атрибут name
                    if (xnode.Attributes.Count > 0)
                    {
                        XmlNode attr = xnode.Attributes.GetNamedItem("Categories");
                        if (attr != null)
                        {
                            GetCategories(attr, priceCategories);
                        }
                        Console.WriteLine(attr.InnerText);
                    }
                    // обходим все дочерние узлы элемента user

                }
            });

            priceInfo.PriceCategories = priceCategories;
            priceInfo.PriceOffers = offers;
            return priceInfo;
        }

        private void GetCategories(XmlNode categories, List<Category> categoriesList)
        {
            foreach (XmlNode category in categories)
            {
                var categoryId = int.Parse(category.Attributes.GetNamedItem("id").Value);
                string name = category.InnerText;

                var tempCategory = new Category();
                tempCategory.Id = categoryId;
                tempCategory.Name = name;
                categoriesList.Add(tempCategory);
            }
        }

        private void GetOffers(XmlNode offers, List<Offer> offersList)
        {
            foreach (XmlNode offer in offers)
            {
                var currentOffer = new Offer();
                var offerId = int.Parse(offer.Attributes.GetNamedItem("id").Value);
                currentOffer.Id = offerId;

                foreach (XmlNode node in offer.ChildNodes)
                {
                    if (node.Name == "price")
                    {
                        var price = double.Parse(node.InnerText);
                        currentOffer.Price = price;
                    }

                    if (node.Name == "categoryId")
                    {
                        var categoryId = int.Parse(node.InnerText);
                        currentOffer.CategoryId = categoryId;
                    }

                    if (node.Name == "name")
                    {
                        var offerName = node.InnerText;
                        currentOffer.Name = offerName;
                    }

                    if (node.Name == "description")
                    {
                        var offerDescription = node.InnerText;
                        currentOffer.Description = offerDescription;
                    }
                }

                offersList.Add(currentOffer);
            }
        }
    }
}
