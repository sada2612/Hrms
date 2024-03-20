import { Component, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
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
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Employee, Attendance, Api } from 'src/app/Dto/DataTypes';
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

@Component({
  selector: 'app-create-attendance',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './create-attendance.component.html',
  styleUrls: ['./create-attendance.component.scss']
})
export default class CreateAttendanceComponent {
  @ViewChild('chart') chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  sumWorking: any;
  weekData: any[] = [5, 9, 6, 4, 3];
  mock: any[] = [];
  leavesData: any[];
  active: any;
  weekChart: ApexCharts;
  monthChart: ApexCharts;
  monthOptions: any;
  time: any;
  employee: Employee;
  attendance: Attendance = new Attendance();
  cheakIn: boolean = false;
  cheakOut: boolean = false;
  working: any;
  Completed = false;
  today: any;
  dateArray: number[] = [];
  tempdata: Attendance;
  count: number = 0;
  day1 = 0;
  logout: any;
  att: any;
  AllAttedanc: any;
  constructor(
    private ApiService: ApiService,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.invoke();
    this.decodeJwt();
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.clock();
    this.AttendanceList();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.getEmpData(data['email']);
    });
  }
  async selectDate() {
    const { value: date } = await this.AlertService.AttedanceDateAlert('select week');
    if (date) {
      this.ArrangeWeekData(date);
    }
  }
  nevigateAttedanceList() {
    this.router.navigate(['guest/attendancelist/yourattendance']);
  }
  YourAttendance() {
    this.ApiService.GetByUsing(this.today, Api.Attendance).subscribe((data) => {
      this.leavesData = data['result'];
      this.attendance = this.leavesData.find((attendance) => attendance.employee?.employeeId === this.employee.employeeId);

      if (this.attendance) {
        if (this.attendance.checkIn != null && this.attendance.checkOut != null) {
          this.Completed = true;
          clearInterval(this.working);
        } else if (this.attendance.checkOut == null) {
          this.cheakOut = true;
          this.working = setInterval(() => {
            this.attendance.workingHours = this.CommonService.Total(this.attendance.checkIn);
          }, 1000);
        }
      } else {
        this.cheakIn = true;
      }
    });
  }

  invoke() {
    this.chartOptions = {
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
          name: 'Expected Hours',
          data: [0, 9.0, 9.0, 9.0, 9.0, 9.0, 0]
        },
        {
          name: 'Actual Hours',
          data: [0, 5, 6, 4, 2, 9, 0]
        }
      ],
      xaxis: {
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    };
  }

  AttendanceList() {
    this.ApiService.GetAll(Api.Attendance).subscribe((data) => {
      this.AllAttedanc = data['result'];
      this.todayAtt(this.today);
    });
  }

  workinHours(time) {
    return this.CommonService.Total(time);
  }
  todayAtt(date) {
    this.today = this.datePipe.transform(date, 'MMM d, y');
    const currentDate = formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
    this.att = this.AllAttedanc.filter((date) => date.date === currentDate);
  }

  TimePipe(timeString) {
    return this.CommonService.TimePipe(timeString);
  }

  async selectAttedanceDate() {
    const { value: date } = await this.AlertService.date();
    if (date) {
      this.AlertService.SimpleAlert(`attedance date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayAtt(date);
          if (this.att.length == 0) {
            this.AlertService.Invalid('Not Found?', 'That thing is still around?', 'question');
          }
        }
      });
    }
  }
  updateActualHours(newData: number[]) {
    this.chartOptions.series = [...this.chartOptions.series.slice(0, 1), { name: 'Actual Hours', data: newData }];
  }

  CheckIn() {
    var newAttendance = new Attendance();
    newAttendance.employeeId = this.employee.employeeId;
    newAttendance.checkIn = this.datePipe.transform(new Date(), 'HH:mm:ss');
    newAttendance.date = this.today;
    newAttendance.status = 'Present';

    this.ApiService.Add(newAttendance, Api.Attendance).subscribe((data) => {
      if (data) {
        this.ApiService.Get(this.employee.employeeId, Api.Attendance).subscribe((data) => {
          this.attendance = data['result'];
          this.working = setInterval(() => {
            this.attendance.workingHours = this.CommonService.Total(this.attendance.checkIn);
          }, 1000);
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
        this.ApiService.Update(this.attendance, Api.Attendance).subscribe((data) => {
          if (data) {
            this.cheakOut = false;
            this.Completed = true;
            clearInterval(this.working);
            this.ArrangeWeekData(this.today);
          }
        });
      }
    });
  }

  getEmpData(email: any) {
    this.ApiService.getbyemail(email, Api.Employee).subscribe(async (data) => {
      this.employee = data['result'];
      this.ArrangeWeekData(this.today);
      this.YourAttendance();
    });
  }

  NextWeek() {
    var currentDate = new Date(this.today);
    if (currentDate <= new Date()) {
      const sevenDaysBack = new Date(this.today);
      sevenDaysBack.setDate(currentDate.getDate() + 7);
      this.today = this.datePipe.transform(sevenDaysBack, 'yyyy-MM-dd');
      this.ArrangeWeekData(this.today);
    }
  }
  BackWeek() {
    const currentDate = new Date(this.today);
    const sevenDaysBack = new Date(this.today);
    sevenDaysBack.setDate(currentDate.getDate() - 7);
    this.today = this.datePipe.transform(sevenDaysBack, 'yyyy-MM-dd');
    this.ArrangeWeekData(this.today);
  }
  checkalert() {
    let timerInterval;
    Swal.fire({
      title: `Hii`,
      text: 'Are You Still Working?',
      icon: 'question',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        timerInterval = setInterval(() => {}, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        this.CheckOut();
      }
    });
  }
  ArrangeWeekData(date) {
    const today = new Date(date);
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      this.ApiService.GetWeelyAttedanceByUsingDate(
        this.employee.employeeId,
        this.datePipe.transform(currentDate, 'yyyy-MM-dd'),
        Api.Attendance
      ).subscribe((data) => {
        if (data == null) {
          this.dateArray[i] = this.convertTimeToDecimal('00:00:00');
        } else {
          this.dateArray[i] = this.convertTimeToDecimal(data?.workingHours);
        }
      });
    }

    setTimeout(() => {
      this.updateActualHours(this.dateArray);
      this.sumWorking = this.dateArray.reduce((x, y) => {
        return x + y;
      });
    }, 500);
  }

  convertTimeToDecimal(timeString: string): number {
    return this.CommonService.convertTimeToDecimal(timeString);
  }

  convertDecimalToTime(decimalTime) {
    return this.CommonService.convertDecimalToTime(decimalTime);
  }

  clock = () =>
    (this.logout = setInterval(() => {
      this.time = this.ApiService.updateClock();
      const currentTime = new Date();
      const targetTime = new Date();
      targetTime.setHours(20, 31);

      if (currentTime.getHours() === targetTime.getHours() && currentTime.getMinutes() === targetTime.getMinutes()) {
        this.checkalert();
        clearInterval(this.logout);
      }
    }, 1000));
}
