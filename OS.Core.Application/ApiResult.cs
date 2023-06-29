namespace OS.Core.Application
{
    public interface IApiResponse<T>
    {
        T Data { get; set; }
    }

    public class ApiResult<T> : IApiResponse<T>
    {
        public bool Successed { get; set; }
        public int ResponseCode { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public int TotalRows { get; set; }
        public int TotalPages { get; set; }

        public void SetApiResponse(bool successed = true, int statusCode = 200, T? data = default, string? msg = null)
        {
            Successed = successed;
            ResponseCode = statusCode;
            Message = msg;
            Data = data;
        }

        public void SetApiSuccessful(T? data = default, string? msg = null)
        {
            Successed = true;
            ResponseCode = 200;
            Message = msg;
            Data = data;
        }
    }
}
