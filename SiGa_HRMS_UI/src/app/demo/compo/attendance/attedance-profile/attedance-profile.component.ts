import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { Employee, Attendance, Api } from 'src/app/Dto/DataTypes';
import { ChartOptions } from 'src/app/demo/default/dashboard/dashboard.component';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-attedance-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, NgApexchartsModule],
  templateUrl: './attedance-profile.component.html',
  styleUrls: ['./attedance-profile.component.scss']
})
export default class AttedanceProfileComponent {
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
  role: any;
  constructor(
    private ApiService: ApiService,
    private AlertService: AlertService,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.decodeJwt();
    this.getEmpData(this.route.snapshot.paramMap.get('id'));
    this.invoke();
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.clock();
    this.YourAttendance();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.role = data['email'];
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

  async selectDate() {
    const { value: date } = await this.AlertService.AttedanceDateAlert('Select Week');
    if (date) {
      this.ArrangeWeekData(date);
    }
  }

  NextWeek() {
    var currentDate = new Date(this.today);
    if (currentDate <= new Date()) {
      const sevenDaysNext = new Date(this.today);
      sevenDaysNext.setDate(currentDate.getDate() + 7);
      this.today = this.datePipe.transform(sevenDaysNext, 'yyyy-MM-dd');
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

  updateActualHours(newData: number[]) {
    this.chartOptions.series = [...this.chartOptions.series.slice(0, 1), { name: 'Actual Hours', data: newData }];
  }

  getEmpData(Id: any) {
    this.ApiService.Get(Id, Api.Employee).subscribe((data) => {
      this.employee = data['result'];
      this.ArrangeWeekData(this.today);
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
          this.dateArray[i] = this.convertTimeToDecimal(data.workingHours);
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
    }, 1000));

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
}
