import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Consts } from 'src/app/shared/const/consts';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
    constructor(private _apiServices: AdminService) {}

    revenueDayOfMonth: any;
    revenueMonthOfYear: any;
    orderDayOfMonth: any;
    orderMonthOfYear: any;
    optionsDayOfMonth: any;
    optionsMonthOfYear: any;
    months = Consts.month;
    selectMonthOfRevenue = new Date().getMonth() + 1;
    selectMonthOfOrder = new Date().getMonth() + 1;
    totalOrder: any;
    totalRevenue: any;
    totalCustomer: any;

    options: any;
    orderStatusToday: any;
    orderStatusMonth: any;

    ngOnInit() {
        this.loadRevenueDayOfMonth();
        this.loadRevenueMonthOfYear();
        this.loadOrderDayOfMonth();
        this.loadOrderMonthOfYear();
        this.loadOrderStatusToday();
        this.loadOrderStatusMonth();

        this._apiServices.getDataAll('/statistics/today').subscribe((res) => {
            this.totalOrder = res.data.totalOrder;
            this.totalRevenue = res.data.totalRevenue;
            this.totalCustomer = res.data.totalCustomer;
        });
    }

    loadOrderStatusToday(): void {
        this._apiServices.getDataAll('/order/status/statistics/day').subscribe((res) => {
            const labels = res.data.map((item: any) => item.orderStatusName);
            const quantity = res.data.map((item: any) => item.quantity);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            this.orderStatusToday = {
                labels: labels,
                datasets: [
                    {
                        data: quantity,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                            documentStyle.getPropertyValue('--red-500'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--yellow-400'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--pink-500'),
                            documentStyle.getPropertyValue('--red-500'),
                        ],
                    },
                ],
            };

            this.options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor,
                        },
                    },
                },
            };
        });
    }

    loadOrderStatusMonth(): void {
        this._apiServices.getDataAll('/order/status/statistics/month').subscribe((res) => {
            const labels = res.data.map((item: any) => item.orderStatusName);
            const quantity = res.data.map((item: any) => item.quantity);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            this.orderStatusMonth = {
                labels: labels,
                datasets: [
                    {
                        data: quantity,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--red-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--yellow-400'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--red-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                        ],
                    },
                ],
            };

            this.options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor,
                        },
                    },
                },
            };
        });
    }

    loadRevenueDayOfMonth(): void {
        this._apiServices.getDataAll(`/statistics/${this.selectMonthOfRevenue}`).subscribe((res) => {
            const labels = res.data.map((item: any) => item.day);
            const totalRevenue = res.data.map((item: any) => item.totalRevenue);

            this.revenueDayOfMonth = {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Doanh thu (VND)',
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        data: totalRevenue,
                    },
                ],
            };
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.optionsDayOfMonth = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
    }

    loadOrderDayOfMonth(): void {
        this._apiServices.getDataAll(`/statistics/${this.selectMonthOfOrder}`).subscribe((res) => {
            const labels = res.data.map((item: any) => item.day);
            const totalRevenue = res.data.map((item: any) => item.totalOrder);

            this.orderDayOfMonth = {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Đơn hàng',
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        data: totalRevenue,
                    },
                ],
            };
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.optionsDayOfMonth = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
    }

    loadRevenueMonthOfYear(): void {
        this._apiServices.getDataAll('/statistics').subscribe((res) => {
            const labels = res.data.map((item: any) => item.month);
            const totalRevenue = res.data.map((item: any) => item.totalRevenue);

            this.revenueMonthOfYear = {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (VND)',
                        data: totalRevenue,
                        type: 'bar',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        borderColor: 'white',
                        borderWidth: 2,
                    },
                ],
            };
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.optionsMonthOfYear = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
    }

    loadOrderMonthOfYear(): void {
        this._apiServices.getDataAll('/statistics').subscribe((res) => {
            const labels = res.data.map((item: any) => item.month);
            const totalRevenue = res.data.map((item: any) => item.totalOrder);

            this.orderMonthOfYear = {
                labels: labels,
                datasets: [
                    {
                        label: 'Đơn hàng',
                        data: totalRevenue,
                        type: 'bar',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        borderColor: 'white',
                        borderWidth: 2,
                    },
                ],
            };
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.optionsMonthOfYear = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
    }

    changeMonthOfRevenue(): void {
        this.loadRevenueDayOfMonth();
    }

    changeMonthOfOrder(): void {
        this.loadOrderDayOfMonth();
    }
}
