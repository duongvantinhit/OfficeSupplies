using Microsoft.AspNetCore.Mvc;

namespace OS.App.Controllers
{
    public class ManagerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
