import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, LeaveBalance, Api, Bank } from 'src/app/Dto/DataTypes';
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
  Bank?: Bank = null;
  constructor(
    private AlertService: AlertService,
    private ApiService: ApiService,
    private router: Router
  ) {
    this.decodeJwt();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.getEmployee(data['email']);
    });
  }

  async updateNumber() {
    const { value: phone } = await this.AlertService.InputAlert('Phone', 'text', 'Your phone number', 'Enter your phone number');
    if (phone) {
      this.AlertService.SimpleAlert(`Entered Number: ${phone}`).then((data) => {
        if (data.isConfirmed) {
          this.EmployeeDto.phone = phone;
          this.ApiService.Update(this.EmployeeDto, Api.Employee).subscribe((data) => {
            if (data == true) {
              this.AlertService.ToastAlert('Contect Number Updated successfully').then(() => {
                this.getEmployee(this.EmployeeDto.email);
              });
            }
          });
        }
      });
    }
  }

  async updateEmgNumber() {
    const { value: phone } = await this.AlertService.InputAlert(
      'Phone',
      'text',
      'Your emergency phone number',
      'Enter your emergency phone number'
    );
    if (phone) {
      this.AlertService.SimpleAlert(`Entered Number: ${phone}`).then((data) => {
        if (data.isConfirmed) {
          this.EmployeeDto.emergencyPhone = phone;
          this.ApiService.Update(this.EmployeeDto, Api.Employee).subscribe((data) => {
            if (data == true) {
              this.AlertService.ToastAlert('Emergency Contect Number Updated successfully').then(() => {
                this.getEmployee(this.EmployeeDto.email);
              });
            }
          });
        }
      });
    }
  }
  async UpdateEmail() {
    const { value: email } = await this.AlertService.InputAlert('Email', 'email', 'Your email address', 'Enter your email address');
    if (email) {
      this.AlertService.SimpleAlert(`Entered email: ${email}`).then((data) => {
        if (data.isConfirmed) {
          this.EmployeeDto.personalEmail = email;
          this.ApiService.Update(this.EmployeeDto, Api.Employee).subscribe((data) => {
            if (data == true) {
              this.AlertService.ToastAlert('Personal Email Updated successfully').then(() => {
                this.getEmployee(this.EmployeeDto);
              });
            }
          });
        }
      });
    }
  }
  getEmployee(email: any) {
    this.ApiService.getbyemail(email, Api.Employee).subscribe((data) => {
      this.EmployeeDto = data['result'];
      this.getLeavedetails(this.EmployeeDto.employeeId);
      this.ApiService.Get(this.EmployeeDto.employeeId, Api.Bank).subscribe((data) => {
        if (data['isSuccess']) {
          this.Bank = data['result'][0];
        }
      });
    });
  }

  getLeavedetails(Id: any) {
    this.ApiService.Get(Id, Api.LeaveBalance).subscribe((data) => {
      this.leavesDetails = data['result'];
    });
  }
  async selectImage() {
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()),
          this.AlertService.SelectedImageConfirm(e).then((res) => {
            if (res.isConfirmed) {
              this.EmployeeDto.imgUrl = this.imageUrl;
              this.ApiService.Update(this.EmployeeDto, Api.Employee).subscribe((res) => {
                if (res) {
                  this.AlertService.ToastAlert('Your profile has been saved').then((data) => {
                    if (data.dismiss) {
                      this.router.navigate(['guest/employees']);
                    }
                  });
                } else {
                  this.AlertService.errorAlert();
                }
              });
            }
          });
      };

      reader.readAsDataURL(file);
    }
  }

  AddLeaveBalance() {
    this.router.navigate(['leavebalance/add']);
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
    } else {
    }
  }
}
