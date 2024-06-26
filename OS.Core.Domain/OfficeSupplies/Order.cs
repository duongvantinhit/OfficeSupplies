﻿using OS.Core.Domain.SeedWork;
using System.ComponentModel.DataAnnotations.Schema;

namespace OS.Core.Domain.OfficeSupplies
{
    [Table("Orders")]
    public class Order : BaseEntity<string>
    {
        public string? UserId { get; set; }
        public double TotalCost { get; set; }
        public DateTime OrderDate { get; set; }
        public string? PromotionId { get; set; }
        public string? OrderStatusId { get; set; }
        public ICollection<OrderDetail>? OrderDetails { get; set; }
        public Promotion? Promotion { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }
        public OrderStatus? OrderStatus { get; set; }

        public int Count()
        {
            throw new NotImplementedException();
        }
    }
}
