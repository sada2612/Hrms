import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, LeaveBalance, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export default class ProfileComponent {
  EmployeeDto: Employee;
  leavesDetails: LeaveBalance;
  imageUrl: string;
  Bank: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private ApiService: ApiService
  ) {
    this.getLeavedetails(this.route.snapshot.paramMap.get('id'));
    this.getEmployee(this.route.snapshot.paramMap.get('id'));
  }

  AddLeaveBalance() {
    this.router.navigate(['admin/leavebalance/add']);
  }

  getLeavedetails(Id: any) {
    this.ApiService.Get(Id, Api.LeaveBalance).subscribe((data) => {
      this.leavesDetails = data['result'];
    });
  }

  getEmployee(id: any) {
    this.ApiService.Get(id, Api.Employee).subscribe((data) => {
      this.EmployeeDto = data['result'];
      this.ApiService.Get(this.EmployeeDto.employeeId, Api.Bank).subscribe((data) => {
        this.Bank = data['result'];
      });
    });
  }

  updateForm(Id: number) {
    this.router.navigate([`admin/employee/${Id}`]);
  }

  async selectImage() {
    const { value: file } = await this.AlertService.SelectImgPopup();
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()),
          this.AlertService.SelectedImageConfirm(e).then((res) => {
            debugger;
            if (res.isConfirmed) {
              this.EmployeeDto.imgUrl = this.imageUrl;
              debugger;
              this.ApiService.Update(this.EmployeeDto, Api.Employee).subscribe((res) => {
                if (res) {
                  this.AlertService.ToastAlert('Your profile has been saved').then((data) => {
                    if (data.dismiss) {
                      this.router.navigate(['admin/employees']);
                    }
                  });
                } else {
                  this.AlertService.errorAlert();
                }
              });
            } else {
            }
          });
      };

      reader.readAsDataURL(file);
    }
  }

  async BankFormPopup(id) {
    const { value: formValues } = await this.AlertService.BankFromAlert();
    if (formValues.bankName != '' && formValues.bankAccNumber != '' && formValues.bankIfscCode != '' && formValues.bankBranch != '') {
      formValues.employeeId = id;
      this.ApiService.Add(formValues, Api.Bank).subscribe((data) => {
        if (data == true) {
          this.AlertService.ToastAlert('Bank Detials Added successfully').then(() => {
            this.ApiService.GetAll(Api.Bank).subscribe((data) => {
              this.Bank = data['result'].filter((data) => {
                return formValues.bankAccNumber == data.bankAccNumber;
              });
            });
          });
        }
      });
    }
  }
}
