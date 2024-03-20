import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Leave, Employee, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-add-leave',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export default class AddLeaveComponent {
  leaveDto: Leave = new Leave();
  status: boolean;
  employees: Employee;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  res: Leave[];
  ll: any[];
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.leaveDto.employeeId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getLeaves();
  }

  getLeaves() {
    this.ApiService.GetAll(Api.Leave).subscribe((data) => {
      this.res = data['result'];
    });
  }
  addLeave() {
    this.ApiService.Add(this.leaveDto, Api.Leave).subscribe((data) => {
      if (data) {
        this.AlertService.Invalid('Successfull !', 'Leave Request Initiated', 'success').then((data) => {
          if (data.isConfirmed) {
            this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
              data['role'] == 'Hr' ? this.router.navigate([`admin/leave`]) : this.router.navigate([`guest/leave`]);
            });
          }
        });
      } else {
        this.AlertService.errorAlert();
      }
    });
  }
  onDateChange(selectedDate: string) {
    const date = new Date(selectedDate);

    if (new Date(date) >= new Date()) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops... !', 'You Selected Weekday  !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.formDate = '';
          }
        });
      } else {
        var res = this.res.filter((data) => {
          return this.leaveDto.employeeId == data.employeeId && date >= new Date(data.formDate) && date <= new Date(data.toDate);
        });
        if (res.length > 0) {
          this.AlertService.Invalid('Oops... !', 'You Have Already Applied Leave On This Date !', 'error').then((data) => {
            if (data.isConfirmed) {
              this.leaveDto.formDate = '';
            }
          });
        }
      }
    } else {
      this.AlertService.Invalid('Oops... !', 'You Selected Date Not Valid !', 'error').then((data) => {
        if (data.isConfirmed) {
          this.leaveDto.formDate = '';
        }
      });
    }
  }

  toonDateChange(selectedDate: string) {
    const date = new Date(selectedDate);

    if (new Date(date) >= new Date(this.leaveDto.formDate)) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops... !', 'You Selected Weekday !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.toDate = '';
          }
        });
      }
    } else {
      if (this.leaveDto.formDate == '') {
        this.AlertService.Invalid('Oops... !', 'Please Select From Date !', 'error').then(() => {
          this.leaveDto.toDate = '';
        });
      } else {
        this.AlertService.Invalid('Oops... !', 'You Selected Date Not Valid !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.leaveDto.toDate = '';
          }
        });
      }
    }
  }

  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 6 && day !== 0;
  }
}
