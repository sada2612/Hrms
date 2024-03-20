import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Leave, LeaveBalance } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-leavelist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './leavelist.component.html',
  styleUrls: ['./leavelist.component.scss']
})
export default class LeavelistComponent {
  active: any;
  Leaves: any;
  leavedata: any[];
  leaveDto: Leave;
  Leavesbalances: LeaveBalance[];
  Leavesbalance: LeaveBalance;
  role: any;
  today = this.datePipe.transform(new Date(), 'MMM d, y');
  email: any;
  constructor(
    private router: Router,
    private AlertService: AlertService,
    private ApiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.decodeJwt();
    this.getLeaves();
    this.getLeavesBalances();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.email = data['email'];
      this.role = data['role'] == 'Admin';
    });
  }
  async leaveDetile(data) {
    if (data) {
      this.AlertService.SimpleAlert(`Leave Detile : ${data}`);
    }
  }

  ValidateDelete(fromdate) {
    return new Date() > new Date(fromdate);
  }

  UpdateLeave(id) {
    this.router.navigate([`admin/leave/update/${id}`]);
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

  addLeave() {
    var res = this.Leavesbalances.find((data) => {
      return data.employee.email == this.email;
    });
    if (res) {
      this.router.navigate([`admin/leave/leaveadd/${res.employeeId}`]);
    } else {
      this.AlertService.Invalid('Oops...', 'You Not Have Leave Balanace', 'error').then((data) => {
        data.isConfirmed ? this.router.navigate([`admin/attendancelist`]) : this.router.navigate([`admin/attendancelist`]);
      });
    }
  }
  Deleteleave(id, employeeId) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.leaveDto = this.Leaves.find((record) => record.leaveId == id);
        this.Leavesbalance = this.Leavesbalances.find((record) => record.employee.employeeId == employeeId);

        if (this.leaveDto.leaveType == 'Paid Leave') {
          this.ApiService.Delete(id, Api.Leave).subscribe((data) => {
            if (data) {
              if (this.leaveDto.leaveLength == 'Half') {
                this.Leavesbalance.utilized = this.Leavesbalance.utilized - 0.5;
              } else {
                this.Leavesbalance.utilized =
                  this.Leavesbalance.utilized - this.calculateLeaveDays(this.leaveDto.formDate, this.leaveDto.toDate);
              }

              this.ApiService.Update(this.Leavesbalance, Api.LeaveBalance).subscribe((data) => {
                if (data) {
                  this.AlertService.Invalid('Approved!', `${this.leaveDto.employee.firstName}'s Leave Deleted.`, 'success').then((data) => {
                    if (data.isConfirmed) {
                      this.getLeaves();
                      this.getLeavesBalances();
                    }
                  });
                }
              });
            }
          });
        }
        this.AlertService.deleteCancelAlert();
      }
    });
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

  updateLeavesbalance(Id: any) {
    this.router.navigate([`admin/leavebalance/${Id}`]);
  }
  deleteLeavesbalance(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.LeaveBalance).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert().then((data) => {
              if (data.isConfirmed) {
                this.getLeavesBalances();
              }
            });
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
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
  async selectDate() {
    const { value: date } = await this.AlertService.date();
    if (date) {
      this.AlertService.SimpleAlert(`leave date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayAtt(date);
          if (this.leavedata.length == 0) {
            this.AlertService.Invalid('Not Found?', 'That thing is still around?', 'question');
          }
        }
      });
    }
  }

  getLeavesBalances() {
    this.ApiService.GetAll(Api.LeaveBalance).subscribe((data) => {
      this.Leavesbalances = data['result'].filter((leave) => {
        return leave.employeeId != null;
      });
    });
  }

  addLeaveBalance() {
    this.router.navigate([`admin/leavebalance/add`]);
  }

  Reject(id, leaveId) {
    this.leaveDto = this.Leaves.find((record) => record.employeeId == id && record.leaveId == leaveId);
    this.AlertService.LeaveApprove(`You want Reject ${this.leaveDto.employee.firstName}'s leave !`, 'Yes, Reject it').then((data) => {
      if (data.isConfirmed) {
        this.leaveDto.status = 'Rejected';
        this.ApiService.Update(this.leaveDto, Api.Leave).subscribe((data) => {
          if (data) {
            this.AlertService.Invalid('Rejected!', `${this.leaveDto.employee.firstName}'s Leave Rejected.`, 'success').then(() => {
              this.getLeaves();
              this.getLeavesBalances();
            });
          }
        });
      }
    });
  }

  ViewEmpProfile(Id) {
    this.router.navigate([`admin/employee/profile/${Id}`]);
  }
  Approve(id, name, type) {
    this.AlertService.LeaveApprove('', 'Yes, Approve it').then((result) => {
      if (result.isConfirmed) {
        this.leaveDto = this.Leaves.find((record) => record.employeeId == id && record.status == 'Initiated');
        this.Leavesbalance = this.Leavesbalances.find((record) => record.employee.employeeId == id);
        if (this.Leavesbalance) {
          if (this.Leavesbalance.utilized < this.Leavesbalance.entitled + this.Leavesbalance.carried_Forworded) {
            this.leaveDto.status = 'Approved';

            this.ApiService.Update(this.leaveDto, Api.Leave).subscribe((data) => {
              if (data) {
                if (this.leaveDto.leaveLength == 'Half') {
                  this.Leavesbalance.utilized = this.Leavesbalance.utilized + 0.5;
                } else {
                  this.Leavesbalance.utilized =
                    this.Leavesbalance.utilized + this.calculateLeaveDays(this.leaveDto.formDate, this.leaveDto.toDate);
                }

                this.ApiService.Update(this.Leavesbalance, Api.LeaveBalance).subscribe((data) => {
                  if (data) {
                    this.AlertService.Invalid('Approved!', `${name}'s Leave Approved.`, 'success').then((data) => {
                      if (data.isConfirmed) {
                        this.getLeaves();
                        this.getLeavesBalances();
                      }
                    });
                  }
                });
              }
            });
          } else {
            this.AlertService.LeaveApprove('He Not Have That much leaves balance!', 'Yes, Approve it').then((result) => {
              if (result.isConfirmed) {
                this.ApiService.Update(this.leaveDto, Api.Leave).subscribe((data) => {
                  if (data) {
                    if (this.leaveDto.leaveLength == 'Half') {
                      this.Leavesbalance.utilized = this.Leavesbalance.utilized + 0.5;
                    } else {
                      this.Leavesbalance.utilized =
                        this.Leavesbalance.utilized + this.calculateLeaveDays(this.leaveDto.formDate, this.leaveDto.toDate);
                    }

                    this.ApiService.Update(this.Leavesbalance, Api.LeaveBalance).subscribe((data) => {
                      if (data) {
                        this.AlertService.Invalid('Approved!', `${name}'s Leave Approved.`, 'success').then((data) => {
                          if (data.isConfirmed) {
                            this.getLeaves();
                            this.getLeavesBalances();
                          }
                        });
                      }
                    });
                  }
                });
              }
              if (result.isDenied) {
                this.AlertService.Invalid('Cancel!', `${name}'s Leave Changes Not Affected.`, 'error');
              }
            });
          }
        } else {
          this.AlertService.Invalid('Not Found!', `${name}'s Leave Balance not Found.`, 'question');
        }
      }
    });
  }

  calculateLeaveDays(fromDate, toDate) {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    let currentDay = startDate;
    let leaveCount = 0;

    while (currentDay <= endDate) {
      const dayOfWeek = currentDay.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        leaveCount++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return leaveCount;
  }
}
