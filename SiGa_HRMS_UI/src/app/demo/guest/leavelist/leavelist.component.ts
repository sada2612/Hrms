import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { Leave, LeaveBalance, Api, Employee } from 'src/app/Dto/DataTypes';

@Component({
  selector: 'app-leavelist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './leavelist.component.html',
  styleUrls: ['./leavelist.component.scss']
})
export default class LeavelistComponent {
  active: any;
  Leaves: Leave[];
  leaveDto: Leave = new Leave();
  Leavesbalances: LeaveBalance[];
  leavedata: Leave[];
  today = this.datePipe.transform(new Date(), 'MMM d, y');
  email: any;
  emp: Employee;

  constructor(
    private router: Router,
    private ApiService: ApiService,
    private datePipe: DatePipe,
    private AlertService: AlertService
  ) {
    this.decodeJwt();
    this.getLeaves();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.email = data['email'];
      this.getEmp();
    });
  }
  getEmp() {
    this.ApiService.getbyemail(this.email, Api.Employee).subscribe((data) => {
      this.emp = data['result'];
    });
  }
  DeleteLeave(Id) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Leave).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert().then(() => {
              this.getLeaves();
            });
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }

  UpdateLeave(id) {
    this.router.navigate([`guest/leave/update/${id}`]);
  }

  getLeaves() {
    this.ApiService.GetAll(Api.Leave).subscribe((data) => {
      this.Leaves = data['result'];
      this.leavedata = this.Leaves.filter((leave) => {
        const fromDate = new Date(leave.formDate);
        return (
          (leave.status == 'Initiated' && leave.leaveId != null) ||
          (fromDate.getMonth() + 1 === new Date().getMonth() + 1 &&
            fromDate.getDate() <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() &&
            leave.leaveId != null)
        );
      });
    });
  }

  async leaveDetile(data) {
    if (data) {
      this.AlertService.SimpleAlert(`Leave Detile : ${data}`);
    }
  }
  todayAtt(date) {
    const currentDate = new Date(date);
    this.today = this.datePipe.transform(date, 'MMM d, y');
    this.leavedata = this.Leaves.filter((data) => {
      var fromdate = new Date(data.formDate);
      var todate = new Date(data.toDate);
      return currentDate >= fromdate && currentDate <= todate;
    });
  }
  AddLeave() {
    this.router.navigate([`guest/leave/leaveadd/${this.emp.employeeId}`]);
  }

  async selectDate() {
    const { value: date } = await this.AlertService.date();
    if (date) {
      this.AlertService.SimpleAlert(`Leave date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayAtt(date);
          if (this.leavedata.length == 0) {
            this.AlertService.Invalid('Not Found?', 'That thing is still around?', 'question');
          }
        }
      });
    }
  }

  DateTimePipe(date) {
    return this.datePipe.transform(date, 'MMM d, y, h:mm a');
  }
}
