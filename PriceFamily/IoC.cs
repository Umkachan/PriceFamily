using Microsoft.Extensions.DependencyInjection;
using PriceFamily.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PriceFamily
{
    public class IoC
    {

        public static void IoCRegister(IServiceCollection services)
        {
            services.AddTransient<IXmlService, XmlService>();
        }
    }
}
