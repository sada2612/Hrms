import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveBalance, Employee, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-add-leavebalance',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-leavebalance.component.html',
  styleUrls: ['./add-leavebalance.component.scss']
})
export default class AddLeavebalanceComponent {
  leaveBalanceDto: LeaveBalance = new LeaveBalance();
  status: boolean;
  employees: Employee[];
  res: any[] = [];
  leavebalance: LeaveBalance[];
  email: any;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.decodeJwt();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.getEmployees(data['email']);
    });
  }
  async getEmployees(email) {
    this.ApiService.GetAll(Api.LeaveBalance).subscribe((l) => {
      this.leavebalance = l['result'];
    });
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.employees = data['result'].filter((k) => {
        return k.email != email && !this.unioque(k.employeeId);
      });
    });
  }

  unioque(id) {
    var res = this.leavebalance.filter((data) => {
      return data.employeeId == id;
    });
    return res.length == 0 ? false : true;
  }

  addLeaveBalance() {
    this.ApiService.Add(this.leaveBalanceDto, Api.LeaveBalance).subscribe((response) => {
      if (response == true) {
        this.AlertService.ToastAlert(`${this.leaveBalanceDto.employee.firstName}'s Leave Balance Added Sucessfully`).then(() =>
          this.router.navigate([`admin/leave`])
        );
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }
}
