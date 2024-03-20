import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


import { SharedModule } from 'src/app/theme/shared/shared.module';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexLegend
} from 'ng-apexcharts';
import { ApiService } from 'src/app/services/api-service.service';
import { Api, Attendance, Employee, Leave } from 'src/app/Dto/DataTypes';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  legend: ApexLegend;
};

class festdto {
  name: string;
  date: any;
  imgurl: any;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  chartOptions_4: Partial<ChartOptions>;
  chartOptions_5: Partial<ChartOptions>;
  chartOptions_6: Partial<ChartOptions>;

  monthChart;
  weekChart;
  time: any;
  attendance: Attendance = new Attendance();
  employee: Employee;
  event: festdto[] = [];
  cheakIn = false;
  cheakOut = false;
  Completed = false;
  leavesData: any[];
  emplength: any = 0;
  leavelength: any = 0;
  upcomingApproved: Leave[];
  currentYearEmp: any = 0;

  constructor(
    private Apiservice: ApiService,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.decodeJwt();
    setTimeout(() => {
      this.weekChart = new ApexCharts(document.querySelector('#visitor-chart'), this.weekOptions);
      this.weekChart.render();
    }, 500);
    this.getdata();
    this.clock();
    this.chartOptions_4 = {
      chart: {
        type: 'bar',
        height: 365,
        toolbar: {
          show: false
        }
      },
      colors: ['#13c2c2'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [80, 95, 70, 42, 65, 55, 78]
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      grid: {
        show: false
      }
    };
    this.chartOptions_5 = {
      chart: {
        type: 'line',
        height: 340,
        toolbar: {
          show: false
        }
      },
      colors: ['#faad14'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 4
        }
      },
      stroke: {
        curve: 'smooth',
        width: 1.5
      },
      grid: {
        strokeDashArray: 4
      },
      series: [
        {
          data: [58, 90, 38, 83, 63, 75, 35, 55]
        }
      ],
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-05-19T00:00:00.000Z',
          '2018-06-19T00:00:00.000Z',
          '2018-07-19T01:30:00.000Z',
          '2018-08-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-10-19T04:30:00.000Z',
          '2018-11-19T05:30:00.000Z',
          '2018-12-19T06:30:00.000Z'
        ],
        labels: {
          format: 'MMM'
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    };
    this.chartOptions_6 = {
      chart: {
        type: 'bar',
        height: 430,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4
        }
      },
      stroke: {
        show: true,
        width: 8,
        colors: ['transparent']
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 10,
          height: 10,
          radius: 50
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      colors: ['#faad14', '#1890ff'],
      series: [
        {
          name: 'Net Profit',
          data: [180, 90, 135, 114, 120, 145]
        },
        {
          name: 'Revenue',
          data: [120, 45, 78, 150, 168, 99]
        }
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      }
    };
  }

  ngOnInit(): void {}
  decodeJwt() {
    this.Apiservice.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.getEmpData(data['email']);
    });
    this.Apiservice.GetAll(Api.Employee).subscribe((data) => {
      this.emplength = data['result'];
      this.currentYearEmp = this.emplength.filter((data) => {
        return new Date(data.joinDate).getFullYear() == new Date().getFullYear();
      });
    });
    this.Apiservice.GetAll(Api.Leave).subscribe((data) => {
      this.leavelength = data['result'].filter((k) => {
        return k.status == 'Initiated';
      });
      this.upcomingApproved = data['result'].filter((k: Leave) => {
        return k.status == 'Approved' && k.formDate >= this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      });
    });

    // console.log(this.leavelength);
    
    // console.log(this.upcomingApproved);
    
    // console.log(this.upcomingApproved?.length + this.leavelength?.length);
    

    // console.log((this.leavelength?.length / (this.upcomingApproved?.length + this.leavelength?.length)) * 100);
    this.getdata()
  }

  YourAttendance() {
    this.Apiservice.GetByUsing(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Api.Attendance).subscribe((data) => {
      this.leavesData = data['result'];
      this.attendance = this.leavesData.find((attendance) => attendance.employee?.employeeId === this.employee.employeeId);
      if (this.attendance) {
        if (this.attendance.checkIn != null && this.attendance.checkOut != null) {
          this.Completed = true;
        } else if (this.attendance.checkOut == null) {
          this.cheakOut = true;
        }
      } else {
        this.cheakIn = true;
      }
    });
  }
  CheckIn() {
    var newAttendance = new Attendance();
    newAttendance.employeeId = this.employee.employeeId;
    newAttendance.checkIn = this.datePipe.transform(new Date(), 'HH:mm:ss');
    newAttendance.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    newAttendance.status = 'Present';

    this.Apiservice.Add(newAttendance, Api.Attendance).subscribe((data) => {
      if (data) {
        this.Apiservice.Get(this.employee.employeeId, Api.Attendance).subscribe((data) => {
          this.attendance = data['result'];
          this.cheakIn = false;
          this.cheakOut = true;
        });
      }
    });
  }

  CheckOut() {
    this.AlertService.CheckOutAlert(this.employee.firstName).then((data) => {
      if (data.isConfirmed) {
        this.attendance.checkOut = this.datePipe.transform(new Date(), 'HH:mm:ss');
        this.attendance.workingHours = this.CommonService.workingHours(this.attendance.checkIn, this.attendance.checkOut);
        this.attendance.employee = null;
        this.Apiservice.Update(this.attendance, Api.Attendance).subscribe((data) => {
          if (data) {
            this.router.navigate(['admin/attendanceprofile/', this.attendance.employeeId]);
          }
        });
      }
    });
  }
  getEmpData(email: any) {
    this.Apiservice.getbyemail(email, Api.Employee).subscribe((data) => {
      this.employee = data['result'];
      this.YourAttendance();
    });
  }
  getdata() {
    this.Apiservice.GetAll(Api.OfficeFest).subscribe((data) => {
      data['result'].forEach((element) => {
        var name = element.name;
        var date = element.date;
        element['photos'][0].split(',').forEach((data) => {
          if (data != '') {
            var dto = new festdto();
            (dto.name = name), (dto.date = date), (dto.imgurl = `http://localhost:5102/Uploads/OfficeFest/${dto.name}/${data}`);
            this.event.push(dto);
          }
        });
      });
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      setTimeout(() => {
        this.weekChart = new ApexCharts(document.querySelector('#visitor-chart'), this.weekOptions);
        this.weekChart.render();
      }, 200);
    }

    if (changeEvent.nextId === 2) {
      setTimeout(() => {
        this.monthChart = new ApexCharts(document.querySelector('#visitor-chart-1'), this.monthOptions);
        this.monthChart.render();
      }, 200);
    }
  }

  monthOptions = {
    chart: {
      height: 450,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [
      {
        name: 'Page Views',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
      },
      {
        name: 'Sessions',
        data: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
      }
    ],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  weekOptions = {
    chart: {
      height: 450,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#1890ff', '#13c2c2'],
    series: [
      {
        name: 'Page Views',
        data: [31, 40, 28, 51, 42, 109, 100]
      },
      {
        name: 'Sessions',
        data: [11, 32, 45, 32, 34, 52, 41]
      }
    ],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  clock = () =>
    setInterval(() => {
      this.time = this.Apiservice.updateClock();
    }, 1000);

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'ti ti-gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'ti ti-message-circle',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'ti ti-settings',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
