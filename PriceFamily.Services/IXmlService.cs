using Microsoft.AspNetCore.Http;
using PriceFamily.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PriceFamily.Services
{
    public interface IXmlService
    {
        Task<PriceInfo> GetAllPriceInfo(IFormFile file);
    }
}
