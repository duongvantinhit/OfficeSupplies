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

    ngOnInit() {
        this.loadRevenueDayOfMonth();
        this.loadRevenueMonthOfYear();
        this.loadOrderDayOfMonth();
        this.loadOrderMonthOfYear();
        this._apiServices.getDataAll('/statistics/today').subscribe((res) => {
            console.log(res.data);
            this.totalOrder = res.data.totalOrder;
            this.totalRevenue = res.data.totalRevenue;
            this.totalCustomer = res.data.totalCustomer;
        });
    }

    loadRevenueDayOfMonth() {
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

    loadOrderDayOfMonth() {
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

    loadRevenueMonthOfYear() {
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

    loadOrderMonthOfYear() {
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

    changeMonthOfRevenue() {
        this.loadRevenueDayOfMonth();
    }

    changeMonthOfOrder() {
        this.loadOrderDayOfMonth();
    }
}
