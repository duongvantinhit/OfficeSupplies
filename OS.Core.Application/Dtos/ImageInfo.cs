using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OS.Core.Application.Dtos
{
    public class ImageInfo
    {
        public string? FileName { get; set; }
        public string? Url { get; set; }
        public long Size { get; set; }
        public string? ContentType { get; set; }
    }
}
