using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using PriceFamily.Models;
using PriceFamily.Services;

namespace PriceFamily.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class XmlController : ControllerBase
    {
        private readonly IXmlService _xmlService;
        private IMemoryCache _cache;
        public XmlController(IXmlService xmlService, IMemoryCache memoryCache)
        {
            _xmlService = xmlService;
            _cache = memoryCache;
        }

        [HttpPost]
        [Route("UploadFile")]
        public async Task<IActionResult> GetAllOffers()
        {
            IFormFile file = Request.Form.Files[0];
            PriceInfo info = await _xmlService.GetAllPriceInfo(file);
            string cacheKey = file.FileName;
            var infoCacheResult = (PriceInfo)_cache.Get(cacheKey);
            if(infoCacheResult != null)
            {
                _cache.Remove(cacheKey);
            }

            if(info != null)
            {
                _cache.Set(cacheKey, info);
            }

            return Ok();
        }

        [HttpGet]
        [Route("GetAllCategories")]
        public async Task<IActionResult> GetAllCategories(string cacheKey)
        {
            var infoCacheResult = new PriceInfo();
            var result = await Task.Run(() => {

                infoCacheResult = (PriceInfo)_cache.Get(cacheKey);

                if (infoCacheResult != null)
                {
                    return new List<Offer>();
                }

                return infoCacheResult.PriceOffers;
            });

            return Ok(infoCacheResult.PriceCategories);
        }

        [HttpGet]
        [Route("GetAllOffers")]
        public async Task<IActionResult> GetAllOffers(string cacheKey)
        {
            var infoCacheResult = new PriceInfo();
            var result = await Task.Run(()=> {

                infoCacheResult = (PriceInfo)_cache.Get(cacheKey);

                if (infoCacheResult != null)
                {
                    return new List<Offer>();
                }

                return infoCacheResult.PriceOffers;
            });

            return Ok(infoCacheResult.PriceOffers);
        }
    }
}